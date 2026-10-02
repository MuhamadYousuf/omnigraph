import type { Metadata } from "next";
import { Download } from "lucide-react";
import { receipt } from "../../lib/showcase";
import { NextSection, PageIntro, SectionTag } from "../components/editorial";
import { CostModel, ExecutionCanvas } from "../components/interactive";

export const metadata: Metadata = {
  title: "Benchmarks & methodology",
  description:
    "A reproducible local DuckDB benchmark: 500,000 synthetic source rows, 447,000 canonical entities, recorded timings and explicit comparison assumptions.",
};

export default function Benchmarks() {
  const benchmark = receipt.benchmark;
  return (
    <>
      <PageIntro
        tag="BENCHMARKS // MEASURED LOCAL FIXTURE"
        title={
          <>
            500,000 rows.
            <br />
            <span>{benchmark.median_ms.toFixed(2)} milliseconds.</span>
          </>
        }
        description="Median of three local DuckDB scan, normalization, and deduplication runs. A reproducible synthetic workload with published scope, counts, and checksums."
        aside={"TRANSFORM TIME ONLY\nAI + NEO4J TIME EXCLUDED"}
      />
      <section className="benchmark-facts page-width">
        <div>
          <span className="mono">CANONICAL ENTITIES</span>
          <strong>447,000</strong>
        </div>
        <div>
          <span className="mono">DUPLICATES COLLAPSED</span>
          <strong>53,000</strong>
        </div>
        <div>
          <span className="mono">MATCHING RESULT CHECKSUMS</span>
          <strong>3 / 3</strong>
        </div>
        <div>
          <span className="mono">MODEL API COST / FIXTURE</span>
          <strong>$0.00</strong>
        </div>
      </section>
      <section className="section-space carbon">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <SectionTag>01 // RECORDED EXECUTION</SectionTag>
              <h2>
                A measurement
                <br />
                you can inspect.
              </h2>
            </div>
            <p>
              All three runs used the same local Parquet fixture and accepted
              SQL. The count reconciliation and output checksum are checked
              after each measured transform.
            </p>
          </div>
          <div className="benchmark-execution">
            <ExecutionCanvas />
            <div className="run-results">
              <div className="mono">CONSECUTIVE RUNS / WALL CLOCK</div>
              {benchmark.runs.map((run) => (
                <div className="run-row" key={run.run}>
                  <span className="mono">RUN_0{run.run}</span>
                  <strong>
                    {run.elapsed_ms.toFixed(2)}
                    <small> ms</small>
                  </strong>
                  <span className="mono">MATCH ✓</span>
                </div>
              ))}
              <p>
                Median: {benchmark.median_ms.toFixed(2)} ms. The first run
                follows fixture creation. No OS cache flush was performed, so
                these are not cold-disk measurements.
              </p>
              <a
                href="/benchmarks/fixture-receipt.json"
                download
                className="text-link"
              >
                Download measured receipt <Download size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space page-width">
        <div className="section-heading">
          <div>
            <SectionTag>02 // ARCHITECTURAL COMPARISON</SectionTag>
            <h2>
              Compare the work.
              <br />
              Then compare the numbers.
            </h2>
          </div>
          <p>
            Graph reconciliation, retrieval, and SQL orchestration solve
            different parts of the data problem. Only the OmniGraph showcase’s
            local transform fixture has been timed here.
          </p>
        </div>
        <div
          className="comparison-wrap"
          tabIndex={0}
          role="region"
          aria-label="Comparison table; scroll horizontally on small screens"
        >
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Evaluation dimension</th>
                <th>
                  OmniGraph
                  <br />
                  <span>Deterministic hybrid</span>
                </th>
                <th>
                  Naive vector RAG
                  <br />
                  <span>Retrieval + generation</span>
                </th>
                <th>
                  dbt / manual engineering
                  <br />
                  <span>Authored transformations</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Primary operation</th>
                <td>
                  Compile mappings, reconcile entities, project relationships.
                </td>
                <td>
                  Retrieve relevant chunks and generate a contextual answer.
                </td>
                <td>Author, orchestrate, and test SQL transformations.</td>
              </tr>
              <tr>
                <th>500k-row processing time</th>
                <td>
                  <strong>{benchmark.median_ms.toFixed(2)} ms</strong>
                  <small>Local transform only; synthetic fixture.</small>
                </td>
                <td>
                  Not benchmarked.
                  <small>
                    Depends on embedding, indexing, retrieval, and model
                    workload.
                  </small>
                </td>
                <td>
                  Not benchmarked.
                  <small>
                    Depends on the execution engine and authored query.
                  </small>
                </td>
              </tr>
              <tr>
                <th>Model API cost per run</th>
                <td>
                  <strong>$0.00 measured</strong>
                  <small>
                    This fixture invokes no model. Mapping compilation may have
                    a cost if a hosted model is chosen.
                  </small>
                </td>
                <td>
                  <strong>$400+ modeled example*</strong>
                  <small>
                    For a full-row prompt path at the assumptions below. Not an
                    observed RAG price.
                  </small>
                </td>
                <td>
                  <strong>$0.00 possible</strong>
                  <small>
                    SQL workflows do not inherently require a model API.
                  </small>
                </td>
              </tr>
              <tr>
                <th>Repeatability / accuracy</th>
                <td>
                  3 of 3 fixture checksums match.
                  <small>
                    Deterministic rules still require semantic validation.
                  </small>
                </td>
                <td>
                  Answer generation is probabilistic.
                  <small>
                    Retrieval quality and answer correctness require evaluation.
                  </small>
                </td>
                <td>
                  SQL can be deterministic.
                  <small>Data tests and mapping review remain necessary.</small>
                </td>
              </tr>
              <tr>
                <th>Source data boundary</th>
                <td>Local engine; metadata-only model contract.</td>
                <td>Determined by the retrieval and model deployment.</td>
                <td>Determined by the warehouse and deployment.</td>
              </tr>
              <tr>
                <th>Relationship model</th>
                <td>Explicit entity keys and graph edges.</td>
                <td>
                  Similarity retrieval unless relationships are modeled
                  separately.
                </td>
                <td>Explicit joins and models authored by the data team.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="comparison-note">
          * The $400 input-only example is 500,000 rows × 100 tokens × $8 per
          million tokens. Output and retry costs can add to it. Ordinary vector
          indexing can have a very different cost profile. Determinism means
          repeatability, not a 100% guarantee of source accuracy or mapping
          correctness.
        </p>
      </section>
      <section className="cost-section section-space">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <SectionTag>03 // TRANSPARENT COST ASSUMPTIONS</SectionTag>
              <h2>
                Change the assumptions.
                <br />
                See the cost move.
              </h2>
            </div>
            <p>
              Sending every row through an LLM scales model input with dataset
              size. This calculator exposes that arithmetic. It makes no claim
              about a particular provider or contract.
            </p>
          </div>
          <CostModel />
        </div>
      </section>
      <section className="section-space page-width">
        <div className="editorial-split">
          <div>
            <SectionTag>04 // REPRODUCE THE RESULT</SectionTag>
            <h2>
              Scope first.
              <br />
              Speed second.
            </h2>
            <p className="left-caption">
              Recorded on {receipt.measured_at.slice(0, 10)}. Re-run the fixture
              on your hardware before using this number to size a deployment.
            </p>
          </div>
          <div className="methodology">
            <dl>
              <div>
                <dt>Engine</dt>
                <dd>{receipt.engine} / Node API</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>
                  {receipt.hardware.cpu}
                  <br />
                  {receipt.hardware.ram_gib} GiB RAM /{" "}
                  {receipt.hardware.platform}
                </dd>
              </div>
              <div>
                <dt>Execution budget</dt>
                <dd>
                  {receipt.hardware.threads} DuckDB threads /{" "}
                  {receipt.hardware.memory_limit} memory limit
                </dd>
              </div>
              <div>
                <dt>Input</dt>
                <dd>
                  500,000 deterministic synthetic rows; four columns; ZSTD
                  Parquet; 447,000 distinct customer keys.
                </dd>
              </div>
              <div>
                <dt>Measured operation</dt>
                <dd>
                  Read Parquet, normalize emails, select the latest row by a
                  unique source-row key, and materialize the grouped entity
                  table in memory.
                </dd>
              </div>
              <div>
                <dt>Excluded operations</dt>
                <dd>
                  Source fixture generation, model inference, rule compilation,
                  count and checksum auditing, Neo4j writes, and network
                  transfer.
                </dd>
              </div>
              <div>
                <dt>Comparison limit</dt>
                <dd>
                  No end-to-end production result, cold-disk run, competitor
                  measurement, or graph write benchmark is claimed.
                </dd>
              </div>
            </dl>
            <div className="reproduce-command">
              <span className="mono">FROM THE SHOWCASE DIRECTORY</span>
              <pre>
                <code>pnpm install{"\n"}pnpm benchmark</code>
              </pre>
              <p>
                The command regenerates the synthetic source, performs three
                transforms, validates counts and checksums, and updates the
                downloadable receipt.
              </p>
            </div>
          </div>
        </div>
      </section>
      <NextSection
        label="RETURN / PLATFORM ARCHITECTURE"
        title="See why the pipeline behaves this way."
        href="/platform"
      />
    </>
  );
}
