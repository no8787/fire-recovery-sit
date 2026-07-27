import { Container } from "@/components/ui/Container";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-slate-200 bg-slate-900 py-12 text-white sm:py-16">
      <Container>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold tracking-wide text-slate-400 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
