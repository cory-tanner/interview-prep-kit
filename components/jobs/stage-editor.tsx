"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StageCombobox } from "./stage-combobox";
import { statusLabel } from "./stage-pipeline";
import type { Stage, StageStatus } from "@/lib/jobs";

const STATUS_OPTIONS: StageStatus[] = ["pending", "active", "complete"];

interface StageEditorProps {
  jobId: string;
  initial?: Stage;
  stageNames: string[];
  onSaved: () => void;
  onCancel: () => void;
}

export function StageEditor({ jobId, initial, stageNames, onSaved, onCancel }: StageEditorProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [status, setStatus] = useState<StageStatus>(initial?.status ?? "active");
  const [date, setDate] = useState(initial?.date ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/stages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), status, date: date || null }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative z-10 flex flex-wrap items-end gap-3 rounded-md border border-border bg-background p-3.5">
      <label className="flex flex-col gap-1.5 min-w-[11rem]">
        <span className="field-label">Stage</span>
        <StageCombobox value={name} onChange={setName} names={stageNames} disabled={!!initial} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="field-label">Status</span>
        <Select value={status} onValueChange={(v) => setStatus(v as StageStatus)}>
          <SelectTrigger className="field">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {statusLabel(option)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="field-label">Date</span>
        <input
          type="date"
          value={date ?? ""}
          onChange={(e) => setDate(e.target.value)}
          className="field"
        />
      </label>
      <div className="flex gap-2">
        <Button variant="primary" onClick={handleSave} disabled={saving || !name.trim()}>
          Save
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
