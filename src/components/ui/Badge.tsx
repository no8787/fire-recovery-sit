export function Badge({
  children,
  tone = "default",
}: {
  children: string;
  tone?: "default" | "sample" | "orange" | "violet";
}) {
  const toneClasses = {
    default: "bg-slate-100 text-slate-700",
    sample: "bg-amber-100 text-amber-800",
    orange: "bg-orange-100 text-orange-700",
    violet: "bg-violet-100 text-violet-800",
  }[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses}`}
    >
      {children}
    </span>
  );
}

export function SampleBadge() {
  return <Badge tone="sample">SAMPLE</Badge>;
}
