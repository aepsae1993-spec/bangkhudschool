import Reveal from "./Reveal";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="aurora opacity-50" />
      <div className="container-x relative z-10 py-20 md:py-28 text-center">
        <Reveal>
          {eyebrow && (
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold-300/80 mb-4">
              {eyebrow}
            </div>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-tight">
            <span className="gold-text">{title}</span>
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-5 max-w-2xl text-cream-100/70 leading-relaxed">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
