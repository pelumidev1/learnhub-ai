"use client";

import { useTransition } from "react";
import { createRoadmap } from "@/app/(app)/roadmap/actions";
import { Spinner } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function GenerateRoadmapButton({ careerResultId }: { careerResultId: string }) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() => start(() => createRoadmap(careerResultId))}
      disabled={pending}
      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Spinner /> Building your path…
        </>
      ) : (
        <>
          Recommend a learning path
          <Icons.arrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
