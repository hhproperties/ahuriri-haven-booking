import { useEffect, useRef, useState, type ReactNode } from "react";

/* ── Types ── */
interface TimelineNode {
  label: string;
  detail: string;
}

interface Section {
  number: string;
  title: string;
  /** Plain-language lead paragraph (Fraunces italic, wood-brown) */
  lead: string;
  /** Body blocks */
  body: Block[];
}

type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; text: string };

interface PolicyPageProps {
  /** Route path for canonical link */
  path: string;
  /** Meta */
  title: string;
  description: string;
  /** Header band */
  eyebrow: string;
  headline: string;
  /** Word inside headline to get .word-wood-light treatment */
  accentWord: string;
  standfirst: string;
  lastUpdated: string;
  /** Plain English summary card bullets (3-5 max) */
  summaryBullets: string[];
  /** Sections */
  sections: Section[];
  /** Optional timeline for cancellation page */
  timeline?: TimelineNode[];
  /** Date for JSON-LD (ISO string or "2026-07-17") */
  datePublished?: string;
  dateModified?: string;
}

/* ── Helper: render a block ── */
function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "paragraph":
      return (
        <p key={i} className="my-4 sm:my-6 font-sans text-[0.9375rem] sm:text-[1.0625rem] leading-[1.6] sm:leading-[1.75] text-[#17181A]/92"
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case "subheading":
      return (
        <h3 key={i} className="mt-6 sm:mt-10 mb-2 sm:mb-3 font-sans text-[1rem] sm:text-[1.125rem] font-semibold tracking-[0.02em] text-[#17181A]"
          dangerouslySetInnerHTML={{ __html: b.text }}
        />
      );
    case "list":
      if (b.ordered) {
        return (
          <ol key={i} className="my-6 space-y-2 pl-6">
            {b.items.map((item, k) => (
              <li key={k} className="pl-2 font-sans text-[1.0625rem] leading-[1.75] text-[#17181A]/92" style={{ listStyle: "none" }}>
                <span className="font-[Fraunces] tabular-nums text-[#6B4630]">{k + 1}.</span> {item}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul key={i} className="my-6 space-y-2 pl-6">
          {b.items.map((item, k) => (
            <li key={k} className="pl-0 font-sans text-[1.0625rem] leading-[1.75] text-[#17181A]/92" style={{ listStyle: "none" }}>
              <span className="mr-2 text-[#6B4630]">•</span> {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <blockquote key={i} className="my-6 sm:my-10 border-l-[3px] border-[#6B4630] bg-[#EFE8DA] px-4 sm:px-6 py-4 sm:py-6 font-[Fraunces] text-base sm:text-lg italic leading-relaxed text-[#6B4630]">
          {b.text}
        </blockquote>
      );
    default:
      return null;
  }
}

/* ── Section numerals animation ── */
function Numeral({ n, active }: { n: string; active: boolean }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => { setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  return (
    <span
      className="font-[Fraunces] text-[2rem] font-[350] text-[#17181A] tabular-nums"
      style={{
        opacity: reduceMotion || active ? 1 : 0,
        transform: reduceMotion || active ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {n}
    </span>
  );
}

/* ── TOC item ── */
function TocItem({ num, title, active }: { num: string; title: string; active: boolean }) {
  return (
    <div className="mb-6 last:mb-0">
      <Numeral n={num} active={active} />
      <p className={`mt-1 text-[10px] uppercase tracking-[0.22em] font-[Archivo] font-medium transition-all duration-500 ${
        active ? "text-[#17181A]" : "text-[#17181A]/40"
      }`}>
        {title}
      </p>
      {active && (
        <div className="mt-1.5 h-px w-full bg-gradient-to-r from-[#6B4630] to-transparent" />
      )}
    </div>
  );
}

/* ── Timeline ── */
function CancellationTimeline({ nodes }: { nodes: TimelineNode[] }) {
  return (
    <div className="my-16">
      {/* Desktop horizontal */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Wood-grain hairline */}
        <div
          className="absolute top-[18px] left-[5%] right-[5%] h-px"
          style={{
            background: "linear-gradient(90deg, #7a5236 0%, #6b4630 28%, #4c3120 52%, #8a5c3c 78%, #6b4630 100%)",
          }}
        />
        {nodes.map((n, i) => (
          <div key={i} className="relative flex flex-col items-center z-10" style={{ width: "22%" }}>
            <div className="w-9 h-9 rounded-full bg-[#EFE8DA] border-2 border-[#6B4630] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B4630]" />
            </div>
            <p className="mt-4 font-[Fraunces] text-[1.2rem] tabular-nums text-[#6B4630] font-[500]">{n.detail}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-[Archivo] text-[#17181A]/60 text-center leading-relaxed">
              {n.label}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile vertical */}
      <div className="flex md:hidden flex-col gap-0 relative pl-10">
        <div
          className="absolute left-[17px] top-3 bottom-3 w-px"
          style={{
            background: "linear-gradient(180deg, #7a5236 0%, #6b4630 28%, #4c3120 52%, #8a5c3c 78%, #6b4630 100%)",
          }}
        />
        {nodes.map((n, i) => (
          <div key={i} className="relative pb-10 last:pb-0">
            <div className="absolute left-[-26px] top-1 w-9 h-9 rounded-full bg-[#EFE8DA] border-2 border-[#6B4630] flex items-center justify-center z-10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B4630]" />
            </div>
            <p className="font-[Fraunces] text-[1.2rem] tabular-nums text-[#6B4630] font-[500]">{n.detail}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] font-[Archivo] text-[#17181A]/60">{n.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export function PolicyPage({
  path,
  title,
  description,
  eyebrow,
  headline,
  accentWord,
  standfirst,
  lastUpdated,
  summaryBullets,
  sections,
  timeline,
  datePublished,
  dateModified,
}: PolicyPageProps) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* ── Track active section via IntersectionObserver ── */
  useEffect(() => {
    if (reduceMotion) return;
    const refs = sectionRefs.current.filter(Boolean) as HTMLElement[];
    if (refs.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = refs.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        }
      },
      { threshold: 0.4 }
    );
    refs.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [reduceMotion]);

  /* ── Scroll reveals ── */
  useEffect(() => {
    if (reduceMotion) return;
    const els = document.querySelectorAll(".policy-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [reduceMotion]);

  /* ── Split headline on accent word ── */
  const hlParts = (() => {
    const idx = headline.indexOf(accentWord);
    if (idx === -1) return [headline];
    const before = headline.slice(0, idx);
    const after = headline.slice(idx + accentWord.length);
    const parts: (string | { word: string })[] = [];
    if (before) parts.push(before);
    parts.push({ word: accentWord });
    if (after) parts.push(after);
    return parts;
  })();

  /* ── JSON-LD ── */
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `https://ahuriri-haven-booking.vercel.app${path}`,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      {/* ── Editorial Header Band ── */}
      <section className="relative min-h-[35vh] min-h-half-screen-safe bg-[#17181A] flex flex-col justify-end px-5 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-10 lg:pb-14 lg:pt-32">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">{eyebrow}</p>

          <h1 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em] max-w-[14ch]">
            {hlParts.map((p, i) =>
              typeof p === "string" ? (
                <span key={i}>{p}</span>
              ) : (
                <span key={i} className="word-wood-light">{p.word}</span>
              )
            )}
          </h1>

          <p className="mt-4 sm:mt-5 max-w-[60ch] font-[Archivo] text-sm sm:text-base leading-relaxed text-[#EFE8DA]/70">
            {standfirst}
          </p>

          <p className="mt-5 sm:mt-8 text-[10px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">
            Last updated · {lastUpdated}
          </p>
        </div>
      </section>

      {/* ── Summary Card ── */}
      <section className="bg-[#EFE8DA] px-5 pt-8 pb-3 sm:px-8 sm:pt-12 sm:pb-4 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="border border-[#6B4630]/20 bg-[#EFE8DA] p-5 sm:p-8 md:p-10">
            <ul className="space-y-2 sm:space-y-3">
              {summaryBullets.map((bullet, i) => (
                <li key={i} className="font-[Fraunces] text-sm sm:text-lg italic leading-snug text-[#6B4630]" style={{ listStyle: "none" }}>
                  <span className="mr-3 text-[#6B4630] opacity-50">—</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Timeline (cancellation only) ── */}
      {timeline && timeline.length > 0 && (
        <section className="bg-[#EFE8DA] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <CancellationTimeline nodes={timeline} />
          </div>
        </section>
      )}

      {/* ── Two-Column Reading Layout ── */}
      <section className="bg-[#EFE8DA] px-5 pb-16 sm:px-8 sm:pb-20 lg:pb-32 lg:px-10">
        <div className="mx-auto w-full max-w-7xl flex flex-col md:flex-row md:gap-16 lg:gap-24">

          {/* ─── Left: Sticky TOC (desktop) ─── */}
          <aside className="hidden md:block md:w-[30%] md:flex-shrink-0">
            <div className="md:sticky md:top-32">
              {sections.map((s, i) => (
                <a
                  key={s.number}
                  href={`#section-${s.number}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`section-${s.number}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="block no-underline"
                >
                  <TocItem num={s.number} title={s.title} active={activeSection === i} />
                </a>
              ))}
            </div>
          </aside>

          {/* ─── Right: Reading Column ─── */}
          <div className="mt-6 sm:mt-10 md:mt-0 md:w-[60%] md:max-w-[68ch]">
            {/* Mobile: horizontal chip scroller */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-5 px-5 mb-6" style={{ scrollbarWidth: "none" }}>
              <div className="flex gap-2 min-w-max">
                {sections.map((s, i) => (
                  <a
                    key={s.number}
                    href={`#section-${s.number}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`section-${s.number}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`inline-block whitespace-nowrap px-4 py-2 border text-[10px] uppercase tracking-[0.2em] font-[Archivo] transition-colors ${
                      activeSection === i
                        ? "border-[#6B4630] bg-[#6B4630]/10 text-[#17181A]"
                        : "border-[#6B4630]/20 text-[#17181A]/50 hover:border-[#6B4630]/40"
                    }`}
                  >
                    {s.number} {s.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Sections */}
            {sections.map((s, i) => (
              <section
                key={s.number}
                id={`section-${s.number}`}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className={`policy-reveal ${i > 0 ? "mt-14 md:mt-20 lg:mt-24" : ""}`}
                style={{
                  opacity: reduceMotion ? 1 : 0,
                  transform: reduceMotion ? "none" : "translateY(24px)",
                  transition: "opacity 850ms cubic-bezier(0.22,1,0.36,1), transform 850ms cubic-bezier(0.22,1,0.36,1)",
                  transitionDelay: reduceMotion ? "0ms" : `${i * 80}ms`,
                }}
              >
                {/* Section heading with numeral */}
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="font-[Fraunces] text-[clamp(1.5rem,4vw,2rem)] tabular-nums text-[#6B4630] font-[350] hidden md:inline" style={{ minWidth: "3ch" }}>
                    {s.number} —
                  </span>
                  <span className="font-[Fraunces] text-[clamp(1.5rem,4vw,2rem)] tabular-nums text-[#6B4630] font-[350] md:hidden">{s.number}</span>
                  <h2 className="font-[Fraunces] text-[clamp(1.4rem,3vw,2.5rem)] leading-[1.1] text-[#17181A] tracking-[-0.01em]">
                    {s.title}
                  </h2>
                </div>

                {/* Lead paragraph */}
                <p className="mt-4 sm:mt-6 font-[Fraunces] text-[clamp(1rem,2vw,1.25rem)] italic leading-snug text-[#6B4630]">
                  {s.lead}
                </p>

                {/* Body blocks */}
                <div className="mt-4 sm:mt-6">
                  {s.body.map((b, bi) => renderBlock(b, bi))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Band ── */}
      <section className="bg-[#EFE8DA] px-5 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="wood-divider" />
          <div className="pt-10 pb-14 sm:pt-16 sm:pb-20 lg:pb-32">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">Questions?</p>
            <p className="mt-4 font-[Fraunces] text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1] text-[#17181A] max-w-[30ch]">
              Email us at{" "}
              <a href="mailto:admin@hhproperties.co.nz" className="word-wood no-underline">
                admin@hhproperties.co.nz
              </a>
            </p>
            <div className="mt-8">
              <a
                href="/contact"
                className="inline-flex border border-[#17181A] px-6 py-3 text-[10px] uppercase tracking-[0.22em] font-[Archivo] text-[#17181A] hover:bg-[#17181A] hover:text-[#EFE8DA] transition-colors"
              >
                Contact us →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          .site-nav, .site-footer, .btn-outline, .btn-outline-light,
          aside, .md\\:hidden, .policy-reveal { opacity: 1 !important; transform: none !important; }
          body { background: #fff !important; color: #000 !important; }
          .policy-reveal { page-break-inside: avoid; }
        }
      `}</style>
    </>
  );
}
