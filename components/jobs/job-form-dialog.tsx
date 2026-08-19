"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

interface JobFormDialogProps {
  onClose: () => void;
  onCreated: () => void;
}

export function JobFormDialog({ onClose, onCreated }: JobFormDialogProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!company.trim() || !role.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), role: role.trim(), notes: notes.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.error ?? "Something went wrong.");
        return;
      }
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-[color-mix(in_srgb,var(--text)_45%,transparent)] backdrop-blur-sm p-4 animate-[rise-in_0.2s_ease-out]"
      onClick={onClose}
    >
      <form
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-(--shadow-lg) flex flex-col gap-4"
      >
        <h3 className="font-(family-name:--font-display) text-xl font-semibold text-foreground">
          Add an application
        </h3>
        <label className="flex flex-col gap-1.5">
          <span className="field-label">Company</span>
          <input
            autoFocus
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className="field"
            placeholder="Acme Corp"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="field-label">Role</span>
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="field"
            placeholder="Senior Frontend Engineer"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="field-label">Notes</span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="field resize-none"
            placeholder="How you found the role, warm contacts, anything load-bearing."
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 mt-1">
          <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={saving || !company.trim() || !role.trim()}>
            {saving ? "Adding…" : "Add application"}
          </Button>
        </div>
      </form>
    </div>
  );
}
