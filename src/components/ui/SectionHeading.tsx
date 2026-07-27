export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const eyebrowClass = tone === "dark" ? "text-slate-400" : "text-slate-500";
  const titleClass = tone === "dark" ? "text-white" : "text-slate-900";
  const descriptionClass = tone === "dark" ? "text-slate-300" : "text-slate-600";

  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p className={`mb-2 text-sm font-semibold tracking-wide uppercase ${eyebrowClass}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl font-bold sm:text-3xl md:text-4xl ${titleClass}`}>{title}</h2>
      {description && (
        <p
          className={`mt-3 text-base sm:text-lg ${descriptionClass} ${
            align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
