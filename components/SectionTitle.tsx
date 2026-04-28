import Reveal from "./Reveal";

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const alignCls =
    align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <Reveal>
      <div className={`flex flex-col gap-4 ${alignCls}`}>
        {eyebrow && (
          <span className="text-[11px] tracking-[0.4em] uppercase text-gold-300/80">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
          <span className="gold-text">{title}</span>
        </h2>
        {subtitle && (
          <p className="max-w-2xl text-cream-100/70 leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="divider-gold" />
      </div>
    </Reveal>
  );
}
