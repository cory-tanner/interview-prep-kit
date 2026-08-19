import { promises as fs } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Heading } from "@/components/ui/heading";
import { StagePipeline } from "@/components/jobs/stage-pipeline";
import { renderMarkdown } from "@/lib/markdown";
import type { Stage } from "@/lib/jobs";

export const dynamic = "force-dynamic";

const COLOR_TOKENS = [
  { name: "--bg", label: "Background" },
  { name: "--surface", label: "Surface" },
  { name: "--surface-raised", label: "Surface (raised)" },
  { name: "--border", label: "Border" },
  { name: "--text", label: "Text" },
  { name: "--text-muted", label: "Text (muted)" },
  { name: "--brand", label: "Brand" },
  { name: "--brand-hover", label: "Brand (hover)" },
  { name: "--brand-soft", label: "Brand (soft)" },
  { name: "--amber", label: "Amber (legacy)" },
  { name: "--red", label: "Red (destructive)" },
] as const;

const SAMPLE_STAGES: Stage[] = [
  { name: "Applied", date: "2026-01-06", status: "complete" },
  { name: "Recruiter Screen", date: "2026-01-10", status: "complete" },
  { name: "Technical Screen", date: "2026-01-17", status: "active" },
  { name: "Onsite", date: null, status: "pending" },
  { name: "Offer", date: null, status: "pending" },
];

async function getDesignSystemDoc(): Promise<string> {
  const filePath = path.join(process.cwd(), "docs", "design-system.md");
  const raw = await fs.readFile(filePath, "utf-8");
  return raw.replace(/^---\n[\s\S]*?\n---\n/, "");
}

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-14 rounded-sm border border-border"
        style={{ background: `var(${token})` }}
      />
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="font-mono text-[0.68rem] text-muted-foreground">{token}</p>
      </div>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
          {eyebrow}
        </p>
        <Heading className="text-xl">{title}</Heading>
      </div>
      {children}
    </section>
  );
}

export default async function StyleGuidePage() {
  const docHtml = renderMarkdown(await getDesignSystemDoc());

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-10 flex flex-col gap-12 animate-[rise-in_0.35s_ease-out]">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
          Living document
        </p>
        <Heading className="text-3xl">Style Guide</Heading>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
          The source of truth for this app&apos;s design system — every token and component below is
          rendered live from the actual code, not a static screenshot. Toggle the theme button in the
          header to see both variants. Ask Claude Code to run the{" "}
          <code className="inline-code">update-design-system</code> skill whenever a design decision
          changes, so this page and <code className="inline-code">docs/design-system.md</code> never drift
          from reality.
        </p>
      </div>

      <Section eyebrow="Tokens" title="Color">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {COLOR_TOKENS.map((token) => (
            <Swatch key={token.name} token={token.name} label={token.label} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Tokens" title="Typography">
        <Card className="p-6 flex flex-col gap-4">
          <div>
            <p className="font-(family-name:--font-display) text-3xl font-extrabold text-foreground">
              Acme Corp
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              font-(family-name:--font-display) text-3xl font-extrabold — company names, page headings
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-foreground">
              Senior Frontend Engineer
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              font-mono uppercase tracking-widest — roles, stage names, data labels
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground">
              Body copy uses Geist Sans at text-sm to text-base, with --text-muted for secondary content
              like notes and descriptions.
            </p>
            <p className="text-xs text-muted-foreground mt-1">font-sans text-sm</p>
          </div>
        </Card>
      </Section>

      <Section eyebrow="Components" title="Buttons">
        <Card className="p-6 flex flex-wrap items-center gap-3">
          <Button variant="primary">Primary / CTA</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </Card>
        <p className="text-xs text-muted-foreground">
          All flat — transparent background. Primary is brand-teal border + text (the CTA); secondary is a
          neutral border; ghost has no border, for low-emphasis or destructive actions.
        </p>
      </Section>

      <Section eyebrow="Components" title="Pills">
        <Card className="p-6 flex flex-wrap items-center gap-3">
          <Pill tone="brand">Brand (soft)</Pill>
          <Pill tone="brand-outline">Brand (outline)</Pill>
          <Pill tone="amber">Amber (legacy)</Pill>
          <Pill tone="muted">Muted</Pill>
        </Card>
        <p className="text-xs text-muted-foreground">
          <code className="inline-code">brand-outline</code> is used for the job-card status badge —
          matches the flat button treatment.
        </p>
      </Section>

      <Section eyebrow="Components" title="Stage pipeline (LED squares)">
        <Card className="p-6">
          <StagePipeline stages={SAMPLE_STAGES} />
        </Card>
        <p className="text-xs text-muted-foreground">
          Solid = complete, pulsing brand = active, outlined = pending. No visible text label by default —
          every square carries a <code className="inline-code">title</code> and{" "}
          <code className="inline-code">aria-label</code>.
        </p>
      </Section>

      <Section eyebrow="Components" title="Card">
        <Card className="p-5 max-w-sm">
          <p className="font-(family-name:--font-display) font-extrabold text-foreground">Card title</p>
          <p className="text-sm text-muted-foreground mt-1">
            Surface background, hairline border, rounded-lg, subtle shadow.
          </p>
        </Card>
      </Section>

      <section className="content-body border-t border-border pt-10">
        <article dangerouslySetInnerHTML={{ __html: docHtml }} />
      </section>
    </div>
  );
}
