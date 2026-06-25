import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles, Wand2, CalendarCheck, ListTree, MessageSquareText,
  ArrowRight, Check, Circle, Github, Zap,
} from "lucide-react";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  {
    icon: Wand2,
    title: "Natural-language capture",
    body: "Type “email Sam about the proposal tomorrow 9am, high priority” — Lumo turns it into a structured task with the right date and priority.",
  },
  {
    icon: ListTree,
    title: "Auto subtasks",
    body: "Stuck on something big? One click breaks any task into a clear, ordered checklist of steps to get moving.",
  },
  {
    icon: CalendarCheck,
    title: "Plan my day",
    body: "Lumo reads today’s tasks and lays out a focused, sensible order to work through them — so you always know what’s next.",
  },
  {
    icon: MessageSquareText,
    title: "AI assistant",
    body: "Chat with an assistant that knows your list. Ask it to prioritise, reschedule, or think through a project with you.",
  },
];

const STEPS = [
  { n: "01", title: "Capture", body: "Drop in tasks however they come to you — plain words, no fiddly forms." },
  { n: "02", title: "Let AI organise", body: "Dates, priorities and subtasks get sorted automatically." },
  { n: "03", title: "Focus & finish", body: "Work a clean, prioritised list and check things off." },
];

export default function Landing() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  async function tryDemo() {
    setDemoLoading(true);
    try {
      await login("demo@lumo.app", "demo123");
      navigate("/app/today");
    } catch {
      navigate("/login");
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo size={30} />
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-subtle hidden sm:inline-flex">Log in</Link>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(600px 300px at 50% -10%, rgba(45,212,191,0.10), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pt-20 pb-10 text-center">
          <span className="chip mx-auto mb-6 border-accent/30 bg-accent/10 text-accent">
            <Sparkles size={13} /> AI-powered to-do list
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            The to-do list that
            <br className="hidden sm:block" /> thinks <span className="text-accent">with you</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted sm:text-lg">
            Capture tasks in plain English, let AI sort dates, priorities and subtasks,
            and start every day with a focused plan.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-5 py-2.5 text-[15px]">
              Start for free <ArrowRight size={17} />
            </Link>
            <button onClick={tryDemo} disabled={demoLoading} className="btn-ghost px-5 py-2.5 text-[15px]">
              <Zap size={16} /> {demoLoading ? "Opening…" : "Try the live demo"}
            </button>
          </div>
          <p className="mt-3 text-xs text-faint">No credit card · demo loads instantly</p>
        </div>

        {/* Product preview */}
        <div className="relative mx-auto max-w-4xl px-5 pb-20">
          <HeroPreview />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-line/60 bg-elevated/40">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Less busywork, more done</h2>
            <p className="mt-3 text-muted">
              Four ways Lumo’s AI quietly takes the friction out of staying organised.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 transition-colors hover:border-line2">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <f.icon size={20} />
                </div>
                <h3 className="text-base font-medium">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">From brain-dump to done</h2>
          <p className="mt-3 text-muted">Three steps, and the AI handles the middle one.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <div className="text-sm font-medium text-accent">{s.n}</div>
              <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-line bg-elevated p-10 text-center sm:p-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Get your head clear today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Join in seconds and let Lumo turn the chaos in your head into a calm, doable list.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary px-5 py-2.5 text-[15px]">
              Create your account <ArrowRight size={17} />
            </Link>
            <button onClick={tryDemo} disabled={demoLoading} className="btn-ghost px-5 py-2.5 text-[15px]">
              Explore the demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 text-sm text-faint sm:flex-row">
          <Logo size={24} />
          <p>Built with Flask, React & a dash of AI.</p>
          <a href="#" className="flex items-center gap-1.5 hover:text-muted">
            <Github size={15} /> Source
          </a>
        </div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-line bg-elevated px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="h-2.5 w-2.5 rounded-full bg-line2" />
        <span className="ml-3 rounded-md border border-line bg-surface px-2 py-0.5 text-[11px] text-faint">
          lumo.app/app/today
        </span>
      </div>
      <div className="grid grid-cols-[150px_1fr] text-left">
        <div className="hidden border-r border-line p-3 sm:block">
          {[["Today", true], ["Upcoming", false], ["All tasks", false], ["Work", false], ["Personal", false]].map(
            ([l, on]) => (
              <div
                key={l}
                className={`mb-1 rounded-md px-2.5 py-1.5 text-[13px] ${
                  on ? "bg-surface2 text-ink" : "text-muted"
                }`}
              >
                {l}
              </div>
            )
          )}
        </div>
        <div className="p-5">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5">
            <Wand2 size={16} className="text-accent" />
            <span className="text-[13px] text-muted">email Sam about the proposal tomorrow 9am, high</span>
            <span className="ml-auto rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-ink">
              Add
            </span>
          </div>
          {[
            { t: "Plan the Q3 launch", done: false, due: "Today", p: "#F87171" },
            { t: "Review design mockups", done: false, due: "Tomorrow", p: "#FBBF24" },
            { t: "Buy groceries for the week", done: false, due: "Today", p: "transparent" },
            { t: "Morning workout", done: true, due: "", p: "transparent" },
          ].map((r) => (
            <div key={r.t} className="flex items-center gap-3 border-b border-line/60 py-2.5 last:border-0">
              {r.done ? (
                <Check size={18} className="text-accent" />
              ) : (
                <Circle size={18} className="text-faint" />
              )}
              <span className={`text-sm ${r.done ? "text-faint line-through" : "text-ink"}`}>{r.t}</span>
              {r.p !== "transparent" && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.p }} />
              )}
              {r.due && <span className="ml-auto text-xs text-muted">{r.due}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
