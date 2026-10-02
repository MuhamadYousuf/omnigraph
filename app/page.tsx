import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  ActionLink,
  NextSection,
  SectionTag,
  SystemBlueprint,
} from "./components/editorial";
import {
  ExecutionCanvas,
  IndustryMatrix,
  PipelineTabs,
} from "./components/interactive";
import { AuditReceipt } from "./components/audit-receipt";
import { Reveal } from "./components/reveal";

const traps = [
  [
    "01",
    "Context is finite.",
    "A half-million-row source exceeds practical prompt budgets. Splitting the table into chunks removes the shared context that entity resolution depends on.",
  ],
  [
    "02",
    "Every token has a cost.",
    "Full-row prompting turns data volume into token spend and rate-limit pressure. Retries and output generation multiply the exposure.",
  ],
  [
    "03",
    "A ledger needs exact operations.",
    "A probabilistic answer cannot substitute for a declared join, a stable entity key, or a reconciled row count. Those operations belong in an execution engine.",
  ],
  [
    "04",
    "The perimeter matters.",
    "Sending source records to a hosted model creates another data boundary. In the local deployment pattern, records stay on the host and models receive statistical metadata.",
  ],
];

export default function Home() {
  return (
    <>
      <section className="home-hero page-width">
        <div className="hero-meta mono">
          <span>SOFTWARE / OMNIGRAPH</span>
          <span>{"{ DETERMINISTIC HYBRID PROCESSING }"}</span>
          <span>SPEC_01 / 2026</span>
        </div>
        <h1>
          From disjointed data
          <br />
          <span>to enterprise ontology.</span>
        </h1>
        <div className="hero-status mono">
          <span>LOCAL_EXECUTION: TRUE</span>
          <span>DETERMINISTIC: TRUE</span>
          <span>RAW_ROWS_TO_LLM: 0</span>
        </div>
        <div className="hero-bottom">
          <p>
            Let AI understand the structure.
            <br />
            Let SQL handle every record.
          </p>
          <div>
            <p>
              OmniGraph compiles a small metadata profile into explicit
              transformations, executes them locally with DuckDB, and projects
              the result into Neo4j.
            </p>
            <ActionLink href="/platform">Explore the platform</ActionLink>
          </div>
          <a
            href="#the-problem"
            className="hero-scroll"
            aria-label="Scroll to the core problem"
          >
            <ArrowDownRight size={35} strokeWidth={1} />
          </a>
        </div>
      </section>
      <section className="carbon blueprint-band">
        <div className="page-width">
          <SystemBlueprint />
          <div className="blueprint-caption">
            <span className="mono">SAMPLE → PROFILE → COMPILE → EXECUTE</span>
            <p>
              The full dataset stays in the execution layer. Model context
              contains the shape of the data.
            </p>
          </div>
        </div>
      </section>
      <section id="the-problem" className="section-space page-width">
        <Reveal>
          <div className="editorial-split">
            <div>
              <SectionTag>01 // THE CONTEXT WINDOW TRAP</SectionTag>
              <h2>
                Your database
                <br />
                doesn’t fit
                <br />
                in a prompt.
              </h2>
              <p className="left-caption">
                The failure begins when an inference system is asked to perform
                a data engine’s job.
              </p>
            </div>
            <div className="ruled-list">
              {traps.map(([n, title, body]) => (
                <article key={n}>
                  <span className="mono">{n}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
      <section id="pipeline" className="section-space pipeline-section">
        <div className="page-width">
          <Reveal>
            <div className="section-heading">
              <div>
                <SectionTag>02 // COMPILED DETERMINISM</SectionTag>
                <h2>
                  Three layers.
                  <br />
                  One accountable pipeline.
                </h2>
              </div>
              <p>
                Inference proposes the mapping. Typed operations execute it.
                Reconciliation makes the handoff explicit.
              </p>
            </div>
          </Reveal>
          <PipelineTabs />
          <div className="execution-section">
            <div>
              <SectionTag>EXECUTION / INSPECTABLE BY DESIGN</SectionTag>
              <h3>
                Read the query.
                <br />
                Follow the result.
              </h3>
              <p>
                Inspect the SQL executed by the local fixture and the
                corresponding Neo4j write specification. Recorded timings have a
                reproducible scope.
              </p>
              <Link className="text-link" href="/benchmarks">
                View the measurement record <ArrowUpRight size={16} />
              </Link>
            </div>
            <ExecutionCanvas />
          </div>
        </div>
      </section>
      <section className="section-space carbon industry-section">
        <div className="page-width">
          <Reveal>
            <div className="section-heading">
              <div>
                <SectionTag>03 // ENTERPRISE APPLICATIONS</SectionTag>
                <h2>
                  Different industries.
                  <br />
                  The same missing connections.
                </h2>
              </div>
              <p>
                Explore the domain model. Follow the entity keys. Start with a
                question your existing systems cannot answer together.
              </p>
            </div>
          </Reveal>
          <IndustryMatrix />
        </div>
      </section>
      <section className="section-space page-width">
        <Reveal>
          <div className="section-heading">
            <div>
              <SectionTag>04 // THE AUDIT RECEIPT</SectionTag>
              <h2>
                Every row
                <br />
                has a disposition.
              </h2>
            </div>
            <p>
              The run ends with a reconciliation, not a success animation.
              Source counts, duplicate resolution, rejected rows, and output
              checksums travel with the result.
            </p>
          </div>
          <AuditReceipt />
        </Reveal>
      </section>
      <NextSection
        label="CONTINUE / PLATFORM ARCHITECTURE"
        title="Understand the system behind the graph."
        href="/platform"
      />
    </>
  );
}
