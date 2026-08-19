import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { NavLinks } from "@/components/layout/nav-links";
import { BreadcrumbProvider } from "@/components/layout/breadcrumb-context";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "interview-prep-kit",
  description: "A local job-search companion: application tracker + study guides.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="h-full flex flex-col">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="interview-prep-kit-theme"
        >
          <BreadcrumbProvider>
            <div className="flex-1 flex flex-col m-3 border border-border rounded-md overflow-hidden print:m-0 print:border-none print:rounded-none print:overflow-visible">
              <header className="no-print h-9 flex items-center gap-6 px-5 rounded-t-md border-b border-border bg-[color-mix(in_srgb,var(--brand)_6%,var(--surface))]">
                <Link href="/jobs" className="flex items-center gap-2 shrink-0">
                  <span className="inline-block w-2 h-2 bg-primary" aria-hidden />
                  <span className="font-mono text-[0.7rem] font-medium uppercase tracking-wide text-foreground">
                    interview-prep-kit
                  </span>
                </Link>
                <nav className="flex items-center gap-5 flex-1 min-w-0">
                  <NavLinks />
                </nav>
                <ThemeToggle />
              </header>
              <main className="app-shell flex-1 flex flex-col overflow-y-auto rounded-b-md print:overflow-visible">
                {children}
              </main>
            </div>
          </BreadcrumbProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
