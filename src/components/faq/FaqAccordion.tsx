"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
