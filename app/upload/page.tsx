import { AppHeader } from "@/components/AppHeader";
import { UploadZone } from "@/components/UploadZone";

const steps = [
  {
    title: "Upload any PDF",
    text: "Insurance, credit card, contract, or government paper. No sign-in and no database required."
  },
  {
    title: "Get plain-language clarity",
    text: "DocSeva turns dense policy language into five clear bullets and three high-risk things to watch."
  },
  {
    title: "Track deadlines later",
    text: "Every key date is saved to your device so you can return to your vault and see what needs attention next."
  }
];

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(26,86,219,0.16),_transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
      <AppHeader current="upload" />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2rem] border border-slate-200 bg-[#0f172a] p-7 text-white shadow-2xl shadow-slate-300/50 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
              AI Intake Studio
            </p>
            <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl">
              Turn a confusing PDF into an action plan.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              The upload flow is designed to feel trustworthy and low-friction, especially for users who are unsure what
              the document even means.
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div key={step.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    Step {index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-white">{step.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <UploadZone />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Trust</p>
                <p className="mt-2 text-base font-semibold text-textPrimary">Private by default</p>
                <p className="mt-2 text-sm leading-6 text-textSecondary">
                  Files stay on your device except for the live Gemini analysis request.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Language</p>
                <p className="mt-2 text-base font-semibold text-textPrimary">Hindi ready</p>
                <p className="mt-2 text-sm leading-6 text-textSecondary">
                  English first, with Hindi summaries available on demand and cached locally.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">Output</p>
                <p className="mt-2 text-base font-semibold text-textPrimary">Dates and answers</p>
                <p className="mt-2 text-sm leading-6 text-textSecondary">
                  Extracted deadlines go straight into the vault, and each document gets its own Q&A workspace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
