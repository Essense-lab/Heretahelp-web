"use client"

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5">
      <header className="space-y-1">
        <h3 className="text-sm font-semibold text-[#0D1B2A]">{title}</h3>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
