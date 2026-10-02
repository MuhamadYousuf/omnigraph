import { DuckDBInstance, version } from "@duckdb/node-api";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { cpus, totalmem, platform, arch } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { performance } from "node:perf_hooks";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const work = path.join(root, ".benchmark-work");
const destination = path.join(root, "public", "benchmarks");
await mkdir(work, { recursive: true });
await mkdir(destination, { recursive: true });
const source = path.join(work, "customers.parquet");
const query = `CREATE OR REPLACE TABLE canonical_customers AS
SELECT customer_id,
       arg_max(lower(trim(email)), source_row_id) AS email_key,
       arg_max(display_name, source_row_id) AS display_name
FROM read_parquet($source)
WHERE customer_id IS NOT NULL
GROUP BY customer_id;`;
const instance = await DuckDBInstance.create(":memory:", {
  threads: "4",
  memory_limit: "2GB",
  temp_directory: path.join(work, "temp"),
});
const connection = await instance.connect();
try {
  const safeSource = source.replaceAll("\\", "/").replaceAll("'", "''");
  await connection.run(`COPY (
    SELECT i AS source_row_id, i % 447000 AS customer_id,
      ' CUSTOMER_' || (i % 447000)::VARCHAR || '@EXAMPLE.TEST ' AS email,
      'Customer ' || (i % 447000)::VARCHAR AS display_name
    FROM range(500000) AS fixture(i)
  ) TO '${safeSource}' (FORMAT parquet, COMPRESSION zstd);`);
  const results = [];
  for (let run = 1; run <= 3; run++) {
    const started = performance.now();
    await connection.run(query, { source });
    const elapsedMs = Math.round((performance.now() - started) * 100) / 100;
    const audit = (
      await connection.runAndReadAll(`SELECT count(*) AS rows,
      count(DISTINCT customer_id) AS unique_keys,
      md5(string_agg(customer_id::VARCHAR || '|' || email_key || '|' || display_name,
                    chr(10) ORDER BY customer_id)) AS checksum
      FROM canonical_customers`)
    ).getRowObjects();
    const row = audit[0];
    results.push({
      run,
      elapsed_ms: elapsedMs,
      output_rows: Number(row.rows),
      unique_keys: Number(row.unique_keys),
      result_checksum_md5: row.checksum,
    });
  }
  const same = results.every(
    (r) =>
      r.output_rows === 447000 &&
      r.unique_keys === 447000 &&
      r.result_checksum_md5 === results[0].result_checksum_md5,
  );
  if (!same)
    throw new Error("Fixture reconciliation or repeatability check failed");
  const receipt = {
    schema_version: "1.0",
    run_id: "OG-SYNTHETIC-500K",
    measured_at: new Date().toISOString(),
    scope:
      "Local synthetic DuckDB transform only; excludes fixture generation, auditing, AI compilation, and Neo4j persistence.",
    engine: `DuckDB ${version()}`,
    hardware: {
      cpu: cpus()[0].model,
      logical_cores: cpus().length,
      ram_gib: Math.round(totalmem() / 1024 ** 3),
      platform: `${platform()} ${arch()}`,
      threads: 4,
      memory_limit: "2GB",
    },
    source: {
      format: "Parquet / ZSTD",
      rows: 500000,
      sha256: createHash("sha256")
        .update(await readFile(source))
        .digest("hex"),
      synthetic: true,
    },
    reconciliation: {
      input_rows: 500000,
      canonical_entities: 447000,
      duplicate_rows_collapsed: 53000,
      rejected_rows: 0,
      count_balance: true,
    },
    graph_projection: {
      expected_customer_nodes: 447000,
      persisted: false,
      neo4j_elapsed_ms: null,
    },
    benchmark: {
      runs: results,
      median_ms: [...results].sort((a, b) => a.elapsed_ms - b.elapsed_ms)[1]
        .elapsed_ms,
      cache_policy:
        "Three consecutive runs in one process; no OS cache flush. Median reported.",
      repeated_results_match: same,
      model_api_cost_usd: 0,
    },
    transform_sql: query,
  };
  const payload = JSON.stringify(receipt, null, 2) + "\n";
  const digest = createHash("sha256").update(payload).digest("hex");
  await writeFile(path.join(destination, "fixture-receipt.json"), payload);
  await writeFile(
    path.join(destination, "fixture-receipt.sha256"),
    digest + "  fixture-receipt.json\n",
  );
  console.log(
    JSON.stringify(
      {
        median_ms: receipt.benchmark.median_ms,
        runs: results,
        counts: receipt.reconciliation,
        engine: receipt.engine,
        hardware: receipt.hardware,
        receipt_sha256: digest,
      },
      null,
      2,
    ),
  );
} finally {
  connection.closeSync();
  instance.closeSync();
}
