import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Heading } from "@/components/ui/heading";

const SECONDARY_PATHS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3v11M9 3 6 6M9 3l3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M9 14v3a4 4 0 0 0 4 4h3a4 4 0 0 0 4-4v-3a3 3 0 0 0-3-3h-1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "One click",
    body: (
      <>
        On the Jobs tab, click <span className="font-medium text-foreground">Create study guide</span> on
        any tracked application. Scaffolds a starter lesson instantly.
      </>
    ),
    link: { href: "/jobs", label: "Go to Jobs →" },
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m16.5 3.5 4 4L7 21H3v-4Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Write it yourself",
    body: (
      <>
        Add markdown under <code className="inline-code">content/&lt;company&gt;/</code> following{" "}
        <code className="inline-code">content/README.md</code>.
      </>
    ),
  },
];

const PROMPT_TIPS = [
  <>Mention the role, seniority, and anything distinctive about the team or stack.</>,
  <>
    Ask for follow-ups incrementally — &ldquo;add onsite prep lessons for Acme Corp&rdquo; — instead of one
    giant prompt.
  </>,
];

const TIPS = [
  <>
    Fill in <code className="inline-code">data/profile.md</code> so lessons match your background and
    learning style.
  </>,
  <>One topic per lesson file — two-digit prefixes control order.</>,
  <>Reuse the existing diagram classes instead of inventing new ones.</>,
  <>If a lesson misses the mark, ask Claude to regenerate just that file.</>,
];

export default function HowToPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-8 py-10 flex flex-col gap-7 animate-[rise-in_0.35s_ease-out]">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1">
          Guide
        </p>
        <Heading className="text-3xl">How to build your study guide</Heading>
        <p className="text-sm text-muted-foreground mt-1.5">
          Three ways to get lessons into a company&apos;s study guide — pick whichever fits.
        </p>
      </div>

      <Card className="p-6 flex flex-col gap-4 border-primary">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <rect x="4" y="7" width="16" height="12" rx="3" />
              <path d="M9 12h.01M15 12h.01M9 3v4M15 3v4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-semibold text-foreground text-lg">Ask Claude Code</p>
          </div>
          <Pill tone="brand-outline">Recommended</Pill>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          With this project open in Claude Code, ask it to run the{" "}
          <code className="inline-code">build-study-guide</code> skill.
        </p>

        <div className="flex flex-col gap-3 mt-1">
          <p className="text-sm text-muted-foreground">Paste the actual job posting, not just the company name:</p>
          <pre className="rounded-sm border border-border bg-background px-3.5 py-2.5 text-xs font-mono text-foreground whitespace-pre-wrap">
            Build a study guide for Acme Corp, Senior Frontend Engineer. Job posting: ...
          </pre>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {PROMPT_TIPS.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary shrink-0 mt-0.5" aria-hidden>
                  ✓
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SECONDARY_PATHS.map((path) => (
          <Card key={path.title} className="p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground" aria-hidden>
                {path.icon}
              </span>
              <p className="font-semibold text-foreground text-sm">{path.title}</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{path.body}</p>
            {path.link && (
              <Link
                href={path.link.href}
                className="text-sm font-medium text-primary underline underline-offset-2"
              >
                {path.link.label}
              </Link>
            )}
          </Card>
        ))}
      </div>

      <div className="rounded-md border border-border p-5">
        <p className="field-label mb-3">Tips &amp; best practices</p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {TIPS.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-0.5" aria-hidden>
                ✓
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
