import { Heading } from "@/components/ui/heading";

export default function StudyGuideIndexPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-8 py-20 text-center flex flex-col items-center gap-3 animate-[rise-in_0.35s_ease-out]">
      <span className="text-3xl" aria-hidden>
        📖
      </span>
      <Heading className="text-2xl">No lesson selected</Heading>
      <p className="text-sm text-muted-foreground max-w-sm">
        Pick a lesson from the sidebar, or click &ldquo;How to add content&rdquo; for how to build one.
      </p>
    </div>
  );
}
