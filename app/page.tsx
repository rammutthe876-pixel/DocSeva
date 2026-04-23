import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

const featureCards = [
  {
    title: "Plain-language summaries",
    text: "Five sharp bullets instead of forty-seven pages of legal wording."
  },
  {
    title: "Deadline dashboard",
    text: "Renewals, premium due dates, and claim windows rise to the top automatically."
  },
  {
    title: "Hindi on demand",
    text: "Switch from English to Hindi without re-uploading your document."
  },
  {
    title: "Ask your document",
    text: "Get direct answers grounded in the PDF instead of a generic chatbot reply."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(26,86,219,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <AppHeader current="home" />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
              Built for India. Grounded in PDFs. Designed for trust.
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] text-textPrimary sm:text-7xl">
              Your documents, finally explained.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-textSecondary sm:text-xl">
              Upload any insurance policy, credit card agreement, or contract. DocSeva turns it into a clear summary,
              deadline tracker, and question-ready workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand/90"
              >
                Start with a PDF
              </Link>
              <Link
                href="/vault"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-textPrimary transition hover:border-brand hover:text-brand"
              >
                Explore the Vault
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {featureCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-5 shadow-sm shadow-slate-200/60"
                >
                  <p className="text-lg font-semibold text-textPrimary">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-textSecondary">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[#0f172a] p-6 text-white shadow-2xl shadow-slate-300/60 sm:p-7">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Start Page</p>
              <h2 className="mt-3 font-display text-4xl">A calmer command center for document life.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                The redesign follows the strongest document-workspace patterns: one clear starting point, focused feature
                pages, and visible next actions instead of one long wall of content.
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Document view</p>
                  <p className="mt-2 text-xl font-semibold">Overview, deadlines, and Q&A each get their own page.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-brand/90 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Hindi ready</p>
                  <p className="mt-2 text-xl font-semibold text-white">A bilingual flow without re-uploading files.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display">5</p>
                  <p className="mt-2 text-sm text-slate-300">clear bullets per summary</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display">3</p>
                  <p className="mt-2 text-sm text-slate-300">must-know risk flags</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-display">1</p>
                  <p className="mt-2 text-sm text-slate-300">vault sorted by urgency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Trust signal</p>
            <p className="mt-3 text-xl font-semibold text-textPrimary">Private and device-first</p>
            <p className="mt-2 text-base leading-7 text-textSecondary">
              Local storage keeps the experience simple. The interface says what happens to your PDF in plain language.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Why this layout</p>
            <p className="mt-3 text-xl font-semibold text-textPrimary">Focused screens beat overloaded dashboards</p>
            <p className="mt-2 text-base leading-7 text-textSecondary">
              Each feature has its own page, but the app still feels like one connected workspace from upload to action.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Audience fit</p>
            <p className="mt-3 text-xl font-semibold text-textPrimary">Government-adjacent, but warmer</p>
            <p className="mt-2 text-base leading-7 text-textSecondary">
              Aadhaar blue keeps the trust signal; softer surfaces and bigger type keep the app approachable.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
