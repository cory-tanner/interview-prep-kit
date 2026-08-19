"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface StageComboboxProps {
  value: string;
  onChange: (name: string) => void;
  names: string[];
  disabled?: boolean;
}

export function StageCombobox({ value, onChange, names, disabled }: StageComboboxProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);

  if (disabled) {
    return <div className="field opacity-70">{value}</div>;
  }

  const filtered = names.filter((name) => name.toLowerCase().includes(filter.trim().toLowerCase()));
  const hasExactMatch = names.some((name) => name.toLowerCase() === filter.trim().toLowerCase());

  function select(name: string) {
    onChange(name);
    setFilter("");
    setOpen(false);
  }

  async function handleCreate() {
    const trimmed = filter.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/stages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (res.ok) {
        select(trimmed);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(name: string, event: ReactMouseEvent) {
    event.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/stages/${encodeURIComponent(name)}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="field flex items-center justify-between gap-2 cursor-pointer text-left">
          <span className={cn(!value && "text-muted-foreground")}>{value || "Select a stage…"}</span>
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={filter}
            onValueChange={setFilter}
            placeholder="Filter or create a stage…"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !hasExactMatch && filter.trim()) handleCreate();
            }}
          />
          <CommandList className="max-h-48">
            <CommandEmpty>No matching stages.</CommandEmpty>
            <CommandGroup>
              {filtered.map((name) => (
                <CommandItem key={name} value={name} onSelect={() => select(name)} className="group justify-between">
                  <span className="truncate">{name}</span>
                  <button
                    type="button"
                    onClick={(event) => handleRemove(name, event)}
                    aria-label={`Remove ${name} from stage list`}
                    disabled={busy}
                    className="shrink-0 p-1 rounded-sm text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-popover transition-opacity cursor-pointer"
                  >
                    <Trash2 aria-hidden className="size-3" />
                  </button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {filter.trim() && !hasExactMatch && (
            <button
              type="button"
              onClick={handleCreate}
              disabled={busy}
              className="w-full text-left px-3 py-2 text-sm border-t border-border text-primary hover:bg-accent cursor-pointer"
            >
              {busy ? "Adding…" : `+ Add "${filter.trim()}"`}
            </button>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
