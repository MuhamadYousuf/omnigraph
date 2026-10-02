import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { NextSection, PageIntro, SectionTag } from "../components/editorial";
import { ProfileBoundary } from "../components/interactive";
import { AuditReceipt } from "../components/audit-receipt";
import { Reveal } from "../components/reveal";

export const metadata: Metadata = {
  title: "Security & governance",
  description:
    "The local deployment boundary: metadata-only model context, PII redaction, controlled execution, and verifiable run receipts.",
};

const controls = [
  [
    "01",
    "Deny egress at the perimeter.",
    "An air-gapped configuration hosts profiling, model inference, DuckDB, and Neo4j inside the client environment. Stage dependencies and model weights before deployment, then enforce outbound network policy and test it with observed traffic.",
  ],
  [
    "02",
    "Scope identities to the operation.",
    "Use distinct service identities for source reads, graph writes, and interactive queries. A reasoning session should not inherit the loader’s write privileges. Source access and graph access need separate authorization decisions.",
  ],
  [
    "03",
    "Keep sensitive values out of context.",
    "Allowlist the statistical fields permitted in a model payload. Block raw samples, value examples, minimum/maximum values that expose identifiers, and unredacted failure messages. Log policy decisions without logging source records.",
  ],
  [
    "04",
    "Fail closed on invalid mappings.",
    "Check the accepted schema, query operations, key constraints, and count invariants before projection. Quarantine missing relationship endpoints and rejected rows. Make reruns reference the same versioned mapping and source fingerprint.",
  ],
];

export default function Security() {
  return (
    <>
      <PageIntro
        tag="SECURITY // DEPLOYMENT CONTROLS"
        title={
          <>
            Keep the perimeter.
            <br />
            <span>Keep the proof.</span>
          </>
        }
        description="Local execution is a design decision. An air gap is an enforced deployment control. OmniGraph’s reference architecture gives security teams a concrete boundary to review and an explicit data contract to test."
        aside={"REFERENCE SECURITY ARCHITECTURE\nNO CERTIFICATION CLAIMED"}
      />
      <section className="carbon section-space">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <SectionTag>01 // CLIENT-CONTROLLED PERIMETER</SectionTag>
              <h2>
                The records stay
                <br />
                where you put them.
              </h2>
            </div>
            <p>
              For a fully air-gapped deployment, use a local model endpoint and
              local storage throughout the pipeline. Metadata-only prompts
              reduce exposure; network controls enforce the boundary.
            </p>
          </div>
          <div className="perimeter-diagram">
            <div className="perimeter-title mono">
              <span>CLIENT NETWORK / OUTBOUND ACCESS DENIED</span>
              <span>{"{ LOCAL_ONLY }"}</span>
            </div>
            <div className="perimeter-flow">
              <div>
                <span className="mono">01 / SOURCE</span>
                <strong>Raw records</strong>
                <p>Files, ledgers, identifiers</p>
              </div>
              <ArrowDown />
              <div>
                <span className="mono">02 / INSPECTION</span>
                <strong>Local profile</strong>
                <p>Redaction + statistics</p>
              </div>
              <ArrowDown />
              <div>
                <span className="mono">03 / COMPUTE</span>
                <strong>Local model + engines</strong>
                <p>Compiled SQL → graph</p>
              </div>
            </div>
            <div className="perimeter-foot mono">
              NO RAW DATA EXPORT / LOCAL MODEL REQUIRED FOR AIR-GAP OPERATION
            </div>
          </div>
        </div>
      </section>
      <section className="section-space page-width">
        <Reveal>
          <div className="editorial-split">
            <div>
              <SectionTag>02 // ZERO RAW VALUES IN MODEL CONTEXT</SectionTag>
              <h2>
                Expose structure.
                <br />
                Exclude identity.
              </h2>
              <p className="left-caption">
                A field’s type and cardinality help plan a transformation. Its
                actual email addresses and sensitive identifiers do not belong
                in that planning payload.
              </p>
            </div>
            <div>
              <ProfileBoundary />
              <p className="small-note">
                The toggle demonstrates the reference payload contract using
                synthetic values. It is not a security test of an attached
                production deployment.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="redaction-steps">
          <article>
            <span className="mono">DETECT</span>
            <h3>Classify locally.</h3>
            <p>
              Identify sensitive fields with schema policies and local pattern
              checks: SSNs, emails, phone numbers, and organization-specific
              identifiers.
            </p>
          </article>
          <article>
            <span className="mono">REMOVE</span>
            <h3>Build an allowlisted profile.</h3>
            <p>
              Exclude source values from inspection payloads. Use local tokens
              where joins require a surrogate identifier, and protect any
              reversal map separately.
            </p>
          </article>
          <article>
            <span className="mono">VERIFY</span>
            <h3>Inspect the exact payload.</h3>
            <p>
              Test the serialized model request for disallowed keys and value
              leakage. Redaction rules need coverage and review; pattern
              matching alone is not proof.
            </p>
          </article>
        </div>
      </section>
      <section className="governance-section section-space">
        <div className="page-width">
          <div className="section-heading">
            <div>
              <SectionTag>03 // ENFORCEABLE CONTROLS</SectionTag>
              <h2>
                Govern the handoffs.
                <br />
                Not just the endpoint.
              </h2>
            </div>
            <p>
              Turn the deployment design into acceptance criteria. Every control
              should have an owner, a test, and an observable result.
            </p>
          </div>
          <div className="governance-list">
            {controls.map(([index, title, body]) => (
              <article key={index}>
                <span className="mono">CONTROL_{index}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space page-width">
        <Reveal>
          <div className="section-heading">
            <div>
              <SectionTag>04 // DETERMINISTIC AUDIT TRAIL</SectionTag>
              <h2>
                A receipt you can
                <br />
                preserve and verify.
              </h2>
            </div>
            <p>
              Counts explain what happened. Fingerprints bind the result to its
              source and rule version. Retention controls determine whether that
              evidence can later be replaced.
            </p>
          </div>
          <AuditReceipt />
        </Reveal>
        <div className="audit-policy">
          <div>
            <h3>Integrity is verifiable.</h3>
            <p>
              The fixture includes a SHA-256 sidecar for its exact JSON bytes.
              Store the expected digest in an independently protected record to
              detect later replacement.
            </p>
            <a
              className="text-link"
              href="/benchmarks/fixture-receipt.sha256"
              download
            >
              Download receipt digest <Download size={16} />
            </a>
          </div>
          <div>
            <h3>Immutability is enforced.</h3>
            <p>
              A JSON file is not inherently immutable. Production receipts
              belong in append-only or WORM storage with retention policy,
              access controls, and an external audit anchor.
            </p>
            <a className="text-link" href="/benchmarks">
              Inspect the reproducible fixture <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <NextSection
        label="CONTINUE / BENCHMARKS & METHODOLOGY"
        title="Inspect the numbers. Reproduce the run."
        href="/benchmarks"
      />
    </>
  );
}
