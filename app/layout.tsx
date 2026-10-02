import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Breadcrumbs, SiteFooter, SiteHeader } from "./components/site-chrome";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OmniGraph | From disjointed data to enterprise ontology",
    template: "%s | OmniGraph",
  },
  description:
    "Reconcile 500,000+ rows locally. OmniGraph uses AI to compile mapping rules, DuckDB to execute them, and Neo4j to connect the result.",
  applicationName: "OmniGraph",
  keywords: [
    "knowledge graph",
    "DuckDB",
    "Neo4j",
    "data engineering",
    "local-first data pipeline",
  ],
  openGraph: {
    title: "OmniGraph | One connected graph from scattered data",
    description:
      "AI writes the mapping rules. DuckDB processes every row locally. Neo4j connects the result.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <Breadcrumbs />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
