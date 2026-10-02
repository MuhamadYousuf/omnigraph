"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, RotateCcw } from "lucide-react";
import { cypher, industries, number, receipt } from "../../lib/showcase";
import { Topology } from "./editorial";

function moveTab(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  length: number,
  setActive: (index: number) => void,
) {
  const offset = ["ArrowRight", "ArrowDown"].includes(event.key)
    ? 1
    : ["ArrowLeft", "ArrowUp"].includes(event.key)
      ? -1
      : 0;
  if (!offset && event.key !== "Home" && event.key !== "End") return;
  event.preventDefault();
  const next =
    event.key === "Home"
      ? 0
      : event.key === "End"
        ? length - 1
        : (index + offset + length) % length;
  setActive(next);
  event.currentTarget.parentElement
    ?.querySelectorAll<HTMLButtonElement>("button")
    [next]?.focus();
}

const stages = [
  {
    tag: "01 / UNDERSTAND",
    title: "Metadata sampling & profiling",
    headline: "A small profile. A complete plan.",
    copy: "Local profiling computes types, null rates, cardinalities, and candidate keys. The AI Swarm receives a statistical description of the source, then compiles the mapping. Raw cell values stay outside the model context.",
    input: "SCHEMA + AGGREGATES",
    output: "SQL / CYPHER CONTRACT",
  },
  {
    tag: "02 / EXECUTE",
    title: "Vectorized in-memory execution",
    headline: "One rule. Every record.",
    copy: "DuckDB scans the source and executes the accepted SQL across typed column vectors. Normalization, deduplication, and joins run in the local engine. The number of source rows does not become the number of model calls.",
    input: "FULL SOURCE DATASET",
    output: "VALIDATED ENTITY TABLES",
  },
  {
    tag: "03 / CONNECT",
    title: "Topological graph projection",
    headline: "From rows to relationships.",
    copy: "Stable entity keys become graph nodes. Validated foreign keys become relationships. Neo4j constraints and parameterized writes preserve identity across repeat loads, so queries can follow business connections.",
    input: "ENTITIES + VALID EDGES",
    output: "QUERYABLE ONTOLOGY",
  },
];

export function PipelineTabs() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return (
    <div className="pipeline-interactive">
      <div
        role="tablist"
        aria-label="Pipeline stages"
        aria-orientation="vertical"
        className="pipeline-tablist"
      >
        {stages.map((item, index) => (
          <button
            type="button"
            role="tab"
            id={`stage-tab-${index}`}
            aria-controls="pipeline-panel"
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            key={item.tag}
            onClick={() => setActive(index)}
            onKeyDown={(e) => moveTab(e, index, 3, setActive)}
          >
            <span className="mono">{item.tag}</span>
            <span>{item.title}</span>
            <ArrowUpRight size={22} />
          </button>
        ))}
      </div>
      <div
        id="pipeline-panel"
        role="tabpanel"
        aria-labelledby={`stage-tab-${active}`}
        className="pipeline-panel"
      >
        <div className="panel-meta mono">
          <span>{stage.input}</span>
          <span>↓</span>
          <span>{stage.output}</span>
        </div>
        <div className="pipeline-visual">
          {active === 0 ? (
            <div className="profile-table">
              <div className="mono profile-title">
                SCHEMA_PROFILE / CUSTOMERS
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Distinct</th>
                    <th>Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>customer_id</td>
                    <td>INT64</td>
                    <td>447,000</td>
                    <td>KEY</td>
                  </tr>
                  <tr>
                    <td>email</td>
                    <td>VARCHAR</td>
                    <td>447,000</td>
                    <td>REDACT</td>
                  </tr>
                  <tr>
                    <td>display_name</td>
                    <td>VARCHAR</td>
                    <td>447,000</td>
                    <td>REDACT</td>
                  </tr>
                </tbody>
              </table>
              <div className="mono profile-tail">
                RAW_VALUES: EXCLUDED / METADATA: ALLOWED
              </div>
            </div>
          ) : active === 1 ? (
            <div className="vector-diagram">
              <div className="mono">COLUMN VECTORS / BATCH EXECUTION</div>
              <div className="vector-lanes">
                {["SCAN", "NORMALIZE", "DEDUPE"].map((label, index) => (
                  <div key={label}>
                    <span className="mono">{label}</span>
                    <div>
                      {Array.from({ length: 16 }, (_, i) => (
                        <i
                          className={i < 16 - index * 3 ? "filled" : ""}
                          key={i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="vector-result">
                <strong>
                  {receipt.benchmark.median_ms}
                  <small> ms</small>
                </strong>
                <span className="mono">
                  MEASURED FIXTURE MEDIAN
                  <br />
                  500,000 SOURCE ROWS / 3 RUNS
                </span>
              </div>
            </div>
          ) : (
            <Topology id="pipeline-graph" compact />
          )}
        </div>
        <h3>{stage.headline}</h3>
        <p>{stage.copy}</p>
        <Link className="text-link" href="/platform">
          Read the architecture <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function IndustryMatrix() {
  const [active, setActive] = useState(0);
  const item = industries[active];
  return (
    <div className="industry-matrix">
      <div
        className="industry-list"
        role="tablist"
        aria-label="Industry examples"
        aria-orientation="vertical"
      >
        {industries.map((industry, index) => (
          <button
            key={industry.id}
            id={`industry-${industry.id}`}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-controls="industry-panel"
            tabIndex={active === index ? 0 : -1}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
            onKeyDown={(e) => moveTab(e, index, 4, setActive)}
          >
            <span className="mono">0{index + 1}</span>
            <span>{industry.title}</span>
            <ArrowUpRight size={27} strokeWidth={1} />
          </button>
        ))}
      </div>
      <div
        id="industry-panel"
        role="tabpanel"
        aria-labelledby={`industry-${item.id}`}
        className="industry-telemetry"
      >
        <div className="telemetry-heading mono">
          <span>{item.code} / REFERENCE SCHEMA</span>
          <span>TOPOLOGY_VIEW</span>
        </div>
        <Topology variant={item.id} id={`matrix-${item.id}`} />
        <div className="telemetry-bottom">
          <div>
            <strong>{item.metric}</strong>
            <span className="mono">{item.metricLabel}</span>
          </div>
          <p>{item.question}</p>
        </div>
        <div className="telemetry-footer">
          <span className="mono">ILLUSTRATIVE DOMAIN MODEL</span>
          <Link
            href={`/solutions#${item.slug}`}
            aria-label={`Explore ${item.title}`}
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Code({ value }: { value: string }) {
  const tokens = value.split(
    /(\b(?:CREATE|OR|REPLACE|TABLE|AS|SELECT|FROM|WHERE|GROUP BY|IS NOT NULL|UNWIND|MERGE|SET|FOR|REQUIRE|IS UNIQUE|IF NOT EXISTS)\b)/g,
  );
  return (
    <pre>
      <code>
        {tokens.map((token, index) => (
          <span
            key={index}
            className={index % 2 ? "syntax-keyword" : undefined}
          >
            {token}
          </span>
        ))}
      </code>
    </pre>
  );
}

export function ExecutionCanvas() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(3);
  const logs = [
    `source    500,000 rows / Parquet`,
    `transform ${receipt.benchmark.median_ms.toFixed(2)} ms median / 3 runs`,
    "audit     447,000 entities + 53,000 duplicates / PASS",
  ];
  const code = active === 0 ? receipt.transform_sql : cypher;
  useEffect(() => {
    if (visibleLogs >= logs.length) return;
    const timer = window.setTimeout(
      () => setVisibleLogs((count) => count + 1),
      420,
    );
    return () => window.clearTimeout(timer);
  }, [visibleLogs, logs.length]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <div className="execution-canvas">
      <div className="execution-toolbar">
        <div role="tablist" aria-label="Execution engine">
          {["DuckDB / SQL", "Neo4j / Cypher"].map((name, index) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`engine-${index}`}
              aria-controls="engine-panel"
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              onClick={() => {
                setActive(index);
                setCopied(false);
              }}
              onKeyDown={(e) => moveTab(e, index, 2, setActive)}
            >
              {name}
            </button>
          ))}
        </div>
        <button
          className="copy-control mono"
          type="button"
          onClick={copy}
          aria-label="Copy query"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span aria-live="polite">
            {copyFailed ? "COPY UNAVAILABLE" : copied ? "COPIED" : "COPY QUERY"}
          </span>
        </button>
      </div>
      <div
        role="tabpanel"
        id="engine-panel"
        aria-labelledby={`engine-${active}`}
      >
        <div className="execution-caption mono">
          {active === 0
            ? "RECORDED LOCAL EXECUTION / SYNTHETIC FIXTURE"
            : "PARAMETERIZED WRITE SPECIFICATION / NOT EXECUTED"}
        </div>
        <Code value={code} />
        <div className="execution-result">
          {active === 0 ? (
            <>
              <div className="execution-logs mono" aria-live="polite">
                {logs.slice(0, visibleLogs).map((line) => (
                  <p key={line}>
                    <span>✓</span> {line}
                  </p>
                ))}
              </div>
              <button
                type="button"
                className="replay-control mono"
                onClick={() => setVisibleLogs(0)}
              >
                <RotateCcw size={13} /> REPLAY RECORDED TRACE
              </button>
            </>
          ) : (
            <>
              <div className="execution-logs mono">
                <p>
                  <span>→</span> expected Customer nodes: 447,000
                </p>
                <p>persistence: NOT CONNECTED</p>
                <p>write latency: NOT MEASURED</p>
              </div>
              <Link href="/benchmarks" className="text-link">
                Measurement scope <ArrowUpRight size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function CostModel() {
  const [rows, setRows] = useState(500000);
  const [tokens, setTokens] = useState(100);
  const [rate, setRate] = useState(8);
  const cost = ((rows * tokens) / 1000000) * rate;
  const fields = [
    {
      label: "Source rows",
      value: rows,
      set: setRows,
      max: 10000000,
      step: 1000,
    },
    {
      label: "Input tokens per row",
      value: tokens,
      set: setTokens,
      max: 10000,
      step: 10,
    },
    {
      label: "Assumed USD per 1M input tokens",
      value: rate,
      set: setRate,
      max: 1000,
      step: 0.1,
    },
  ];
  return (
    <div className="cost-model">
      <div className="cost-fields">
        {fields.map((field) => (
          <label key={field.label}>
            <span>{field.label}</span>
            <input
              type="number"
              min="0"
              max={field.max}
              step={field.step}
              value={field.value}
              onChange={(event) =>
                field.set(
                  Math.max(
                    0,
                    Math.min(field.max, Number(event.target.value) || 0),
                  ),
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="cost-result" aria-live="polite">
        <span className="mono">MODELED INPUT-ONLY API COST</span>
        <strong>
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
          }).format(cost)}
        </strong>
        <p>
          {number(rows * tokens)} input tokens × ${rate}/million
        </p>
      </div>
      <p className="cost-note">
        A hypothetical full-row LLM workload, not measured vendor pricing or a
        typical RAG ingestion bill. Output tokens, embeddings, retries, and
        infrastructure are excluded. The local DuckDB fixture makes zero model
        API calls.
      </p>
    </div>
  );
}

export function ProfileBoundary() {
  const [view, setView] = useState(0);
  const samples = [
    JSON.stringify(
      {
        customer_id: "C-001",
        email: "mira@example.test",
        ssn: "000-12-3456",
        name: "Example Person",
      },
      null,
      2,
    ),
    JSON.stringify(
      {
        table: "customers",
        rows: 500000,
        columns: [
          {
            name: "customer_id",
            type: "BIGINT",
            distinct: 447000,
            null_rate: 0,
          },
          { name: "email", type: "VARCHAR", pii: true, raw_values: "EXCLUDED" },
          { name: "ssn", type: "VARCHAR", pii: true, raw_values: "EXCLUDED" },
        ],
        cell_values_in_prompt: 0,
      },
      null,
      2,
    ),
  ];
  return (
    <div className="profile-boundary">
      <div
        className="profile-switch"
        role="tablist"
        aria-label="Data inspection boundary"
      >
        {["Local source example", "Model-visible profile"].map(
          (label, index) => (
            <button
              type="button"
              role="tab"
              key={label}
              id={`boundary-${index}`}
              aria-controls="boundary-panel"
              aria-selected={view === index}
              tabIndex={view === index ? 0 : -1}
              onClick={() => setView(index)}
              onKeyDown={(e) => moveTab(e, index, 2, setView)}
            >
              {label}
              <span>{index === 0 ? "LOCAL ONLY" : "METADATA ONLY"}</span>
            </button>
          ),
        )}
      </div>
      <div
        id="boundary-panel"
        role="tabpanel"
        aria-labelledby={`boundary-${view}`}
      >
        <div className="mono boundary-caption">
          {view === 0
            ? "SYNTHETIC VALUES / NEVER A PROMPT PAYLOAD"
            : "REFERENCE PROFILE CONTRACT / CELL VALUES OMITTED"}
        </div>
        <pre>
          <code>{samples[view]}</code>
        </pre>
      </div>
    </div>
  );
}
