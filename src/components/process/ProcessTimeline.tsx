import { processSteps } from "@/lib/mock/process";

export function ProcessTimeline() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {processSteps.map((item) => (
        <li
          key={item.step}
          className="relative rounded-xl border border-slate-200 bg-white p-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
            {item.step}
          </span>
          <p className="mt-3 text-sm font-bold text-slate-900">{item.title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            {item.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
