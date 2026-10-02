import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import { number, receipt } from "../../lib/showcase";

export function AuditReceipt() {
  return (
    <div className="audit-receipt">
      <div className="receipt-top mono">
        <span>INGESTION AUDIT RECEIPT / {receipt.run_id}</span>
        <span className="receipt-pass">COUNT_RECONCILED ✓</span>
      </div>
      <div className="receipt-equation">
        <div>
          <span className="mono">SOURCE ROWS</span>
          <strong>{number(receipt.reconciliation.input_rows)}</strong>
        </div>
        <ArrowDownRight strokeWidth={1} />
        <div>
          <span className="mono">PROJECTED CUSTOMER NODES</span>
          <strong>{number(receipt.reconciliation.canonical_entities)}</strong>
        </div>
      </div>
      <div className="receipt-ledger">
        <div>
          <span>Duplicate rows collapsed</span>
          <strong>53,000</strong>
        </div>
        <div>
          <span>Rejected rows in this fixture</span>
          <strong>0</strong>
        </div>
        <div>
          <span>Reconciliation</span>
          <strong>447,000 + 53,000 = 500,000</strong>
        </div>
        <div>
          <span>Output checksum, all three runs</span>
          <code>
            {receipt.benchmark.runs[0].result_checksum_md5.slice(0, 20)}…
          </code>
        </div>
      </div>
      <div className="receipt-foot">
        <p>
          Measured synthetic fixture. These are canonical entities ready for
          projection; Neo4j persistence was not executed. A graph may contain
          several node and edge types per source row.
        </p>
        <a
          href="/benchmarks/fixture-receipt.json"
          download
          className="text-link"
        >
          Download JSON <Download size={15} />
        </a>
        <Link href="/benchmarks" className="text-link">
          Full methodology <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}
