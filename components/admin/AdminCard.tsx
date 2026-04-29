type AdminCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function AdminCard({ children, className = "", ...rest }: AdminCardProps) {
  return (
    <div {...rest} className={`glass rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminPageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-display font-semibold gold-text">{title}</h1>
      {sub && <p className="mt-1 text-sm text-cream-100/60">{sub}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export function FormInput({ label, hint, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="block text-sm text-cream-100/80 mb-1.5">{label}</span>
      <input
        {...props}
        className={`w-full rounded-xl bg-ink-800/60 border ${
          error ? "border-red-400/60" : "border-white/10"
        } px-4 py-2.5 text-sm text-cream-100 placeholder-cream-100/30
          focus:outline-none focus:border-gold-300/60 focus:bg-ink-800 transition ${className}`}
      />
      {hint && <span className="mt-1 text-xs text-cream-100/50">{hint}</span>}
      {error && <span className="mt-1 text-xs text-red-400">{error}</span>}
    </label>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export function FormTextarea({ label, hint, className = "", ...props }: TextAreaProps) {
  return (
    <label className="block">
      <span className="block text-sm text-cream-100/80 mb-1.5">{label}</span>
      <textarea
        {...props}
        className={`w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-2.5 text-sm text-cream-100
          placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60 focus:bg-ink-800
          transition resize-y ${className}`}
      />
      {hint && <span className="mt-1 text-xs text-cream-100/50">{hint}</span>}
    </label>
  );
}

export function BtnPrimary({
  children,
  loading = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium
        text-ink-950 bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300
        hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 ${props.className ?? ""}`}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function BtnDanger({
  children,
  loading = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium
        text-red-300 border border-red-400/30 hover:bg-red-400/10 active:scale-95 transition-all
        disabled:opacity-50"
    >
      {loading && (
        <span className="h-3 w-3 border border-red-300/40 border-t-red-300 rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

export function BtnGhost({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-cream-100/80
        border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] px-5 py-3 rounded-2xl text-sm shadow-soft
        border ${type === "ok" ? "bg-green-900/80 border-green-400/30 text-green-200" : "bg-red-900/80 border-red-400/30 text-red-200"}
        backdrop-blur-xl`}
    >
      {msg}
    </div>
  );
}
