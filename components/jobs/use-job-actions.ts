"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Job } from "@/lib/jobs";

export function useJobActions(job: Job, onChange: () => void) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [openingGuide, setOpeningGuide] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function requestDelete() {
    setConfirmDeleteOpen(true);
  }

  async function confirmDelete(): Promise<boolean> {
    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (res.ok) {
        setConfirmDeleteOpen(false);
        onChange();
        return true;
      }
      return false;
    } finally {
      setDeleting(false);
    }
  }

  async function handleStudyGuide() {
    setOpeningGuide(true);
    try {
      const res = await fetch(`/api/jobs/${job.id}/study-guide`, { method: "POST" });
      if (res.ok) router.push(`/study-guide/${job.id}`);
    } finally {
      setOpeningGuide(false);
    }
  }

  return {
    deleting,
    openingGuide,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    requestDelete,
    confirmDelete,
    handleStudyGuide,
  };
}
