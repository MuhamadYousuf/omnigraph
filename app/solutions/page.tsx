import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  NextSection,
  PageIntro,
  SectionTag,
  Topology,
} from "../components/editorial";
import { Reveal } from "../components/reveal";

export const metadata: Metadata = {
  title: "Enterprise solutions",
  description:
    "Connected data models for financial crime investigations, SaaS revenue reconciliation, and multi-tier supply chain dependencies.",
};

const domains = [
  {
    id: "financial-services",
    variant: "aml" as const,
    index: "01",
    name: "Financial services & AML",
    headline: (
      <>
        Follow the money.
        <br />
        Keep the evidence.
      </>
    ),
    intro:
      "A payment ring is a relationship problem. Its accounts can look ordinary when viewed one ledger at a time.",
    body: "Bring account registries, beneficiary records, and transfer ledgers into a common entity model. Normalize identifiers locally, preserve source references, and separate exact matches from candidate matches requiring review.",
    question:
      "Which short transfer cycles return funds to an account controlled by the originating entity?",
    sources: "ACCOUNT LEDGERS / BENEFICIARIES / TRANSFERS",
    controls:
      "Stable account keys · transfer timestamps · currency-aware amounts",
    result:
      "An investigator can inspect the path, transaction IDs, and source records behind a flagged pattern. A graph signal supports review; it is not a finding of wrongdoing.",
    query:
      "MATCH p = (a:Account)-[:TRANSFER_TO*2..4]->(a)\nWHERE all(t IN relationships(p) WHERE t.amount >= $minimum)\nRETURN p LIMIT 25;",
  },
  {
    id: "revenue-operations",
    variant: "revenue" as const,
    index: "02",
    name: "B2B SaaS revenue operations",
    headline: (
      <>
        Your revenue has
        <br />
        more than one source.
      </>
    ),
    intro:
      "Salesforce knows the account. The ERP knows the invoice. Stripe knows the payment. Retention needs all three to agree.",
    body: "Resolve external account IDs to a canonical customer key. Connect invoices to payment events and subscription periods, while preserving credits, refunds, currency, and event time. Compute the financial measures in SQL at a declared reporting grain.",
    question:
      "How much recurring revenue did the opening customer cohort retain after expansion, contraction, and churn?",
    sources: "SALESFORCE / ERP INVOICES / STRIPE EVENTS",
    controls:
      "Customer × month grain · event-time cutoff · consistent currency basis",
    result:
      "Net retention uses the opening cohort: opening recurring revenue plus expansion, less contraction and churn, divided by opening recurring revenue. New customers are excluded from that cohort measure.",
    query:
      "MATCH (c:Customer)-[:BILLED]->(i:Invoice)\nOPTIONAL MATCH (i)-[:SETTLED_BY]->(p:Payment)\nRETURN c.customer_id, i.invoice_id, collect(p.payment_id);",
  },
  {
    id: "supply-chain",
    variant: "supply" as const,
    index: "03",
    name: "Supply chain & logistics",
    headline: (
      <>
        See the dependency
        <br />
        before the disruption.
      </>
    ),
    intro:
      "A shipment delay becomes a business risk when it shares a constrained supplier, facility, or route with everything else you need.",
    body: "Connect supplier master data, facility inventories, shipment events, and customer commitments. Preserve effective dates so current and historical dependency paths can be examined separately. Model alternate supply relationships explicitly.",
    question:
      "Which customer commitments share a multi-tier supplier or shipment chokepoint?",
    sources: "SUPPLIER MASTER / WMS / TMS / CUSTOMER ORDERS",
    controls:
      "Effective dates · facility identifiers · declared dependency direction",
    result:
      "Traverse from a constrained supplier through facilities and shipments to affected customers. Inspect where alternate paths exist, then bring the connected record into operational review.",
    query:
      "MATCH p = (s:Supplier {supplier_id: $supplierId})\n-[:SUPPLIES]->(:Facility)-[:DISPATCHES]->(:Shipment)\n-[:DELIVERS_TO]->(:Customer)\nRETURN p LIMIT 100;",
  },
];

export default function Solutions() {
  return (
    <>
      <PageIntro
        tag="SOLUTIONS // DOMAIN MODELS"
        title={
          <>
            The question crosses systems.
            <br />
            <span>Your data should, too.</span>
          </>
        }
        description="Start with a concrete operational question. Resolve its entities, preserve the source evidence, and make the relationships queryable across the systems that hold them."
        aside={"REFERENCE USE CASES\nNO CUSTOMER OUTCOMES IMPLIED"}
      />
      <nav className="domain-jump page-width" aria-label="Industry sections">
        {domains.map((d) => (
          <a href={`#${d.id}`} key={d.id}>
            <span className="mono">{d.index}</span>
            {d.name}
            <ArrowUpRight size={17} />
          </a>
        ))}
      </nav>
      {domains.map((domain, index) => (
        <section
          id={domain.id}
          key={domain.id}
          className={`solution-domain section-space ${index === 1 ? "carbon" : ""}`}
        >
          <div className="page-width">
            <Reveal>
              <div className="solution-heading">
                <SectionTag>
                  {`${domain.index} // ${domain.name.toUpperCase()}`}
                </SectionTag>
                <h2>{domain.headline}</h2>
                <p>{domain.intro}</p>
              </div>
            </Reveal>
            <div className="solution-body">
              <div className="solution-diagram">
                <div className="mono">ONTOLOGY_VIEW / REFERENCE MODEL</div>
                <Topology
                  variant={domain.variant}
                  id={`solution-${domain.id}`}
                />
                <div className="mono diagram-sources">{domain.sources}</div>
              </div>
              <div className="solution-narrative">
                <h3>{domain.question}</h3>
                <p>{domain.body}</p>
                <dl>
                  <div>
                    <dt>Control points</dt>
                    <dd>{domain.controls}</dd>
                  </div>
                  <div>
                    <dt>The connected outcome</dt>
                    <dd>{domain.result}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="solution-query">
              <span className="mono">
                REFERENCE CYPHER / ADAPT TO YOUR SCHEMA
              </span>
              <pre>
                <code>{domain.query}</code>
              </pre>
            </div>
          </div>
        </section>
      ))}
      <section id="healthcare" className="healthcare-note section-space">
        <div className="page-width editorial-split">
          <div>
            <SectionTag>04 // HEALTHCARE REVENUE CYCLE</SectionTag>
            <h2>
              Follow the claim.
              <br />
              Protect the patient.
            </h2>
          </div>
          <div>
            <p>
              Connect encounters, claims, payers, and remittances to locate
              exceptions in the revenue cycle. Keep patient-level records local,
              apply identifier redaction before metadata inspection, and
              restrict graph access to the authorized workflow.
            </p>
            <p>
              This is a reference data model for administrative reconciliation.
              A local deployment still needs access policies, retention rules,
              and the organization’s own compliance review.
            </p>
            <Link href="/security" className="text-link">
              Inspect the security architecture <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <NextSection
        label="CONTINUE / SECURITY & GOVERNANCE"
        title="Keep the perimeter in your control."
        href="/security"
      />
    </>
  );
}
