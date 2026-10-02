import type { Metadata } from "next";
import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { agents } from "../../lib/showcase";
import {
  NextSection,
  PageIntro,
  SectionTag,
  SystemBlueprint,
} from "../components/editorial";
import { ExecutionCanvas } from "../components/interactive";
import { Reveal } from "../components/reveal";

export const metadata: Metadata = {
  title: "Platform architecture",
  description:
    "Inside the Sample–Profile–Compile pattern: local metadata profiling, deterministic DuckDB transformations, and Neo4j graph projection.",
};

export default function Platform() {
  return (
    <>
      <PageIntro
        tag="PLATFORM // ARCHITECTURE_SPEC"
        title={
          <>
            Intelligence at the edge.
            <br />
            <span>Determinism at the core.</span>
          </>
        }
        description="Separate the decision about how to transform data from the execution of that transformation. OmniGraph’s architecture makes the boundary between model inference and exact computation explicit."
        aside={"SAMPLE / PROFILE / COMPILE\nEXECUTE / VALIDATE / PROJECT"}
      />
      <section className="carbon section-space">
        <div className="page-width">
          <SectionTag>01 // THE LOCAL RUNTIME</SectionTag>
          <SystemBlueprint />
          <div className="architecture-notes">
            <p>
              <strong>Control plane</strong>The AI Swarm compiles rules from an
              approved metadata profile. Its output is a versioned mapping
              contract.
            </p>
            <p>
              <strong>Execution plane</strong>DuckDB applies the contract to
              source records. Validators reconcile the result before a Neo4j
              write batch is released.
            </p>
          </div>
        </div>
      </section>
      <section className="section-space page-width">
        <Reveal>
          <div className="section-heading">
            <div>
              <SectionTag>02 // SAMPLE–PROFILE–COMPILE</SectionTag>
              <h2>
                Bound the inference.
                <br />
                Make the plan inspectable.
              </h2>
            </div>
            <p>
              The model is involved when the mapping changes. Repeated source
              batches execute the accepted mapping without asking a model to
              reason over every row.
            </p>
          </div>
        </Reveal>
        <div className="method-sequence">
          <article>
            <span className="mono">01 / SAMPLE</span>
            <h3>Inspect locally.</h3>
            <p>
              Read a bounded source sample to establish parsing rules and
              candidate types. Keep sampled values in the local profiling
              process. Escalate ambiguous types instead of silently coercing
              identifiers or amounts.
            </p>
          </article>
          <article>
            <span className="mono">02 / PROFILE</span>
            <h3>Describe the shape.</h3>
            <p>
              Produce column metadata, null rates, cardinalities, and key
              statistics. Strip source values and sensitive examples from the
              model payload. Local aggregates can validate a sampled hypothesis
              across the full dataset.
            </p>
          </article>
          <article>
            <span className="mono">03 / COMPILE</span>
            <h3>Freeze the mapping.</h3>
            <p>
              Convert the accepted ontology into SQL and parameterized Cypher.
              Validate syntax and invariants against fixtures. Bind the source
              fingerprint, profile version, and rule version to the run receipt.
            </p>
          </article>
        </div>
      </section>
      <section className="engine-section carbon">
        <div className="page-width">
          <div className="engine-heading">
            <SectionTag>03 // EXECUTION ENGINES</SectionTag>
            <h2>
              Two engines.
              <br />
              Clear responsibilities.
            </h2>
          </div>
          <div className="engine-columns">
            <article>
              <span className="mono">LAYER_01 / DUCKDB</span>
              <h3>
                Columnar execution.
                <br />
                Local data.
              </h3>
              <p>
                DuckDB uses vectorized operators, processing typed batches
                rather than invoking application logic for each row. The default
                vector size is 2,048 tuples.
              </p>
              <dl>
                <div>
                  <dt>Direct file scans</dt>
                  <dd>
                    Query Parquet or CSV without a separate application-side
                    staging copy. Parquet supports column projection and filter
                    pushdown; CSV still requires parsing.
                  </dd>
                </div>
                <div>
                  <dt>Controlled transforms</dt>
                  <dd>
                    Use explicit casts, normalization rules, stable ordering,
                    and deterministic tie-breaks. Track rejected values instead
                    of allowing silent data loss.
                  </dd>
                </div>
                <div>
                  <dt>Memory and scale</dt>
                  <dd>
                    Set a workload memory budget. Larger-than-memory operations
                    may spill to local disk; in-memory performance depends on
                    the query and source layout.
                  </dd>
                </div>
              </dl>
              <a
                className="source-link"
                href="https://duckdb.org/docs/current/internals/vector"
                target="_blank"
                rel="noreferrer"
              >
                DuckDB execution format <ArrowUpRight size={14} />
              </a>
              <a
                className="source-link"
                href="https://duckdb.org/docs/current/data/parquet/overview"
                target="_blank"
                rel="noreferrer"
              >
                Parquet scan behavior <ArrowUpRight size={14} />
              </a>
            </article>
            <article>
              <span className="mono">LAYER_02 / NEO4J</span>
              <h3>
                Stable identities.
                <br />
                Traversable relationships.
              </h3>
              <p>
                Project canonical entities with stable keys. Relationships
                describe the business connection between validated endpoints,
                giving every traversal an explicit meaning.
              </p>
              <dl>
                <div>
                  <dt>Identity constraints</dt>
                  <dd>
                    A uniqueness constraint prevents duplicate keys for a label.
                    Validate missing keys separately: uniqueness alone does not
                    require a property to exist.
                  </dd>
                </div>
                <div>
                  <dt>Parameterized writes</dt>
                  <dd>
                    Use driver parameters and bounded batches. MERGE on the
                    stable key, then set mutable attributes. Avoid generating
                    query text from raw cell values.
                  </dd>
                </div>
                <div>
                  <dt>Query discipline</dt>
                  <dd>
                    Start from indexed identities, bound traversal depth, and
                    inspect plans with EXPLAIN or PROFILE. Write and traversal
                    latency need their own measured workload.
                  </dd>
                </div>
              </dl>
              <a
                className="source-link"
                href="https://neo4j.com/docs/cypher-manual/current/schema/constraints/create-constraints/"
                target="_blank"
                rel="noreferrer"
              >
                Neo4j constraint semantics <ArrowUpRight size={14} />
              </a>
            </article>
          </div>
          <ExecutionCanvas />
        </div>
      </section>
      <section className="section-space page-width">
        <Reveal>
          <div className="section-heading">
            <div>
              <SectionTag>04 // AGENT SPECIFICATIONS</SectionTag>
              <h2>
                A swarm with
                <br />
                defined boundaries.
              </h2>
            </div>
            <p>
              Each agent has a narrow contract: approved inputs, inspectable
              outputs, and a failure path. The specification below describes the
              intended deployment workflow.
            </p>
          </div>
        </Reveal>
        <div className="agent-specs">
          {agents.map((agent, index) => (
            <details key={agent.id} open={index === 0}>
              <summary>
                <span className="mono">AGENT_{agent.id}</span>
                <h3>{agent.title}</h3>
                <span>{agent.role}</span>
                <Plus size={23} strokeWidth={1} />
              </summary>
              <div className="agent-detail">
                <dl>
                  <div>
                    <dt>Input contract</dt>
                    <dd>{agent.input}</dd>
                  </div>
                  <div>
                    <dt>Output contract</dt>
                    <dd>{agent.output}</dd>
                  </div>
                  <div>
                    <dt>Failure behavior</dt>
                    <dd>{agent.failure}</dd>
                  </div>
                </dl>
                <div className="agent-code">
                  <span className="mono">CONTRACT EXCERPT / REFERENCE</span>
                  <pre>
                    <code>{agent.code}</code>
                  </pre>
                </div>
              </div>
            </details>
          ))}
        </div>
        <div className="editorial-note">
          <span className="mono">ENGINEERING NOTE</span>
          <p>
            Deterministic execution makes a fixed transformation repeatable. It
            does not prove that an inferred relationship is semantically
            correct. Mapping review, type checks, and reconciliation remain part
            of the contract.
          </p>
          <Link href="/security">
            Inspect the governance boundary <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <NextSection
        label="CONTINUE / ENTERPRISE SOLUTIONS"
        title="Follow the connections that matter to your business."
        href="/solutions"
      />
    </>
  );
}
