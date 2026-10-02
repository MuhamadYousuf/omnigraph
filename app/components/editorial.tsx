import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { industries, type IndustryId } from "../../lib/showcase";

export function SectionTag({ children }: { children: ReactNode }) {
  return <div className="section-tag mono">[ {children} ]</div>;
}
export function ActionLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link className={`action-link${light ? " light" : ""}`} href={href}>
      {children}
      <ArrowUpRight size={19} />
    </Link>
  );
}
export function PageIntro({
  tag,
  title,
  description,
  aside,
}: {
  tag: string;
  title: ReactNode;
  description: string;
  aside?: string;
}) {
  return (
    <section className="page-intro page-width">
      <SectionTag>{tag}</SectionTag>
      <h1>{title}</h1>
      <div className="intro-bottom">
        <p>{description}</p>
        <span className="mono intro-aside">
          {aside ?? "BUILT FOR ENGINEERING.\nDESIGNED FOR SCRUTINY."}
          <ArrowDownRight size={27} />
        </span>
      </div>
    </section>
  );
}
export function NextSection({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href: string;
}) {
  return (
    <section className="next-section">
      <div className="page-width">
        <SectionTag>{label}</SectionTag>
        <Link href={href}>
          <h2>{title}</h2>
          <ArrowUpRight strokeWidth={1} />
        </Link>
      </div>
    </section>
  );
}

export function Topology({
  variant = "revenue",
  id = "topology",
  compact = false,
}: {
  variant?: IndustryId;
  id?: string;
  compact?: boolean;
}) {
  const domain = industries.find((item) => item.id === variant)!;
  const points = [
    [105, 125],
    [305, 80],
    [505, 125],
    [305, 285],
  ];
  const graphEdges: Record<IndustryId, { path: string; label: string; x: number; y: number }[]> = {
    aml: [
      { path: "M134 119 273 88", label: "SENT", x: 188, y: 91 },
      { path: "M337 87 472 118", label: "RECEIVED_BY", x: 374, y: 89 },
      { path: "M489 150 331 267", label: "CONTROLLED_BY", x: 403, y: 220 },
    ],
    revenue: [
      { path: "M134 119 273 88", label: "BILLED", x: 188, y: 91 },
      { path: "M337 87 472 118", label: "SETTLED_BY", x: 374, y: 89 },
      { path: "M134 131Q215 202 280 268", label: "HOLDS", x: 180, y: 218 },
      { path: "M305 262V105", label: "COVERS", x: 305, y: 194 },
    ],
    health: [
      { path: "M134 119 273 88", label: "GENERATES", x: 177, y: 91 },
      { path: "M337 87 472 118", label: "SUBMITTED_TO", x: 374, y: 89 },
      { path: "M489 150 331 267", label: "SENDS", x: 412, y: 219 },
      { path: "M305 262V105", label: "SETTLES", x: 305, y: 194 },
    ],
    supply: [
      { path: "M134 119 273 88", label: "SUPPLIES", x: 183, y: 91 },
      { path: "M337 87 472 118", label: "DISPATCHES", x: 374, y: 89 },
      { path: "M489 150 331 267", label: "DELIVERS_TO", x: 406, y: 219 },
    ],
  };
  const edges = graphEdges[variant];
  return (
    <svg
      className={`topology-svg${compact ? " compact" : ""}`}
      viewBox="0 0 610 380"
      role="img"
      aria-labelledby={`${id}-title`}
    >
      <title id={`${id}-title`}>{domain.entities.join(" connected to ")}</title>
      <defs>
        <marker
          id={`${id}-arrow`}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6" fill="none" stroke="currentColor" />
        </marker>
      </defs>
      <g className="topology-grid">
        <path d="M0 190H610M305 0V380" />
        <path d="M25 25h15m-7-7v15M570 25h15m-7-7v15M25 355h15m-7-7v15M570 355h15m-7-7v15" />
      </g>
      <g className="topology-edges" markerEnd={`url(#${id}-arrow)`}>
        {edges.map((edge) => <path key={edge.label} d={edge.path} />)}
      </g>
      <g className="topology-labels">
        {edges.map((edge) => (
          <text key={edge.label} x={edge.x} y={edge.y} textAnchor="middle">
            {edge.label}
          </text>
        ))}
      </g>
      {points.map(([x, y], index) => (
        <g key={domain.entities[index]}>
          <rect
            x={x - 23}
            y={y - 23}
            width="46"
            height="46"
            className={`topology-node node-${index}`}
          />
          <path
            d={`M${x - 7} ${y}h14M${x} ${y - 7}v14`}
            className="node-cross"
          />
          <text x={x} y={y + 49} textAnchor="middle" className="node-name">
            {domain.entities[index]}
          </text>
          <text x={x} y={y + 66} textAnchor="middle" className="node-key">
            {domain.entities[index].toLowerCase()}_id
          </text>
        </g>
      ))}
    </svg>
  );
}

export function SystemBlueprint() {
  return (
    <div className="system-blueprint">
      <div className="blueprint-top mono">
        <span>FIG 01 / THE EXECUTION BOUNDARY</span>
        <span>RAW RECORDS REMAIN LOCAL</span>
      </div>
      <svg
        viewBox="0 0 1240 345"
        role="img"
        aria-label="Source files feed local profiling and DuckDB execution. Only metadata reaches the AI compiler. Clean records are projected into Neo4j."
      >
        <g className="blueprint-guides">
          <path d="M20 172H1220M275 30V320M610 30V320M945 30V320" />
        </g>
        <g className="blueprint-path">
          <path d="M177 90H242V172H333M177 172H333M177 253H242V172" />
          <path d="M477 172H557V87H668M477 172H557V254H668M812 87H882V254H812M812 254H1000" />
        </g>
        <g className="blueprint-source">
          <rect x="42" y="65" width="135" height="50" />
          <rect x="42" y="147" width="135" height="50" />
          <rect x="42" y="228" width="135" height="50" />
          <text x="57" y="95">
            CRM / CSV
          </text>
          <text x="57" y="177">
            ERP / PARQUET
          </text>
          <text x="57" y="258">
            EVENTS / JSON
          </text>
        </g>
        <g className="blueprint-block">
          <rect x="333" y="137" width="144" height="70" />
          <text x="350" y="164">
            LOCAL PROFILE
          </text>
          <text x="350" y="187" className="blueprint-sub">
            STATISTICS ONLY
          </text>
          <rect x="668" y="52" width="144" height="70" />
          <text x="685" y="79">
            AI COMPILER
          </text>
          <text x="685" y="102" className="blueprint-sub">
            SCHEMA → RULES
          </text>
          <rect x="668" y="219" width="144" height="70" />
          <text x="685" y="246">
            DUCKDB
          </text>
          <text x="685" y="269" className="blueprint-sub">
            FULL DATASET
          </text>
        </g>
        <g className="blueprint-graph">
          <path d="M1018 252 1075 190 1150 226 1128 290 1018 252 1150 226M1075 190 1128 290" />
          {[
            [1018, 252],
            [1075, 190],
            [1150, 226],
            [1128, 290],
          ].map(([x, y]) => (
            <rect key={x} x={x - 7} y={y - 7} width="14" height="14" />
          ))}
          <text x="1020" y="156">
            NEO4J ONTOLOGY
          </text>
        </g>
        <g className="blueprint-annotations">
          <text x="512" y="69">
            METADATA
          </text>
          <text x="513" y="284">
            RAW ROWS
          </text>
          <text x="893" y="172">
            SQL / CYPHER
          </text>
          <text x="25" y="324">
            01 / SOURCE
          </text>
          <text x="293" y="324">
            02 / PROFILE
          </text>
          <text x="628" y="324">
            03 / EXECUTE
          </text>
          <text x="963" y="324">
            04 / PROJECT
          </text>
        </g>
      </svg>
    </div>
  );
}
