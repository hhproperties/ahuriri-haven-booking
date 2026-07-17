import React, { useEffect, useRef, useState } from "react";
import { Reveal, PullQuote, WoodDivider } from "./motion";

/* ── Text processing helpers ── */

type Block =
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "paragraph"; text: string }
  | { type: "pullquote"; text: string }
  | { type: "divider" }
  | { type: "numbered-section"; num: number; title: string; items: string[] };

function parseBlocks(raw: string, variant: number): Block[] {
  // Variant 6: numbered sections with wood numerals
  if (variant === 6) {
    return parseNumberedSections(raw);
  }
  // Variant 7: insert dividers every ~400 words worth of blocks
  if (variant === 7) {
    return insertDividers(parseGenericBlocks(raw), 3);
  }
  return parseGenericBlocks(raw);
}

function parseGenericBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const paras = raw.split("\n\n");
  for (const para of paras) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // Pull-quote: lines wrapped in []
    const pqMatch = trimmed.match(/^\[(.+)\]$/);
    if (pqMatch) {
      blocks.push({ type: "pullquote", text: pqMatch[1] });
      continue;
    }

    // Divider: --- or ***
    if (/^[-*]{3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      continue;
    }

    // Heading 2: ##
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading2", text: trimmed.slice(3) });
      continue;
    }

    // Heading 3: ###
    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "heading3", text: trimmed.slice(4) });
      continue;
    }

    // Unordered list: - or *
    if (/^[-*]\s/.test(trimmed)) {
      const items = trimmed.split("\n").map((l) => l.replace(/^[-*]\s*/, ""));
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    // Ordered list: 1.
    if (/^\d+\./.test(trimmed)) {
      const items = trimmed.split("\n").map((l) => l.replace(/^\d+\.\s*/, ""));
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    // Default paragraph
    blocks.push({ type: "paragraph", text: trimmed });
  }
  return blocks;
}

function parseNumberedSections(raw: string): Block[] {
  const blocks: Block[] = [];
  const paras = raw.split("\n\n");
  let sectionNum = 0;
  for (const para of paras) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // h3 with ### marks a new numbered section
    if (trimmed.startsWith("### ")) {
      sectionNum++;
      const items: string[] = [];
      blocks.push({ type: "numbered-section", num: sectionNum, title: trimmed.slice(4), items });
      continue;
    }

    // If we're in a numbered section, append bullets/items
    if (blocks.length > 0 && blocks[blocks.length - 1].type === "numbered-section") {
      const section = blocks[blocks.length - 1] as Extract<Block, { type: "numbered-section" }>;
      if (/^[-*]\s/.test(trimmed)) {
        section.items.push(...trimmed.split("\n").map((l) => l.replace(/^[-*]\s*/, "")));
        continue;
      }
      // Fall through to paragraph
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "heading2", text: trimmed.slice(3) });
      continue;
    }
    if (/^[-*]{3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      continue;
    }
    blocks.push({ type: "paragraph", text: trimmed });
  }
  return blocks;
}

function insertDividers(blocks: Block[], interval: number): Block[] {
  const result: Block[] = [];
  let count = 0;
  for (const b of blocks) {
    if (b.type === "paragraph" || b.type === "heading2" || b.type === "heading3") {
      count++;
    }
    result.push(b);
    if (count > 0 && count % interval === 0) {
      result.push({ type: "divider" });
    }
  }
  return result;
}

/* ── Render helpers ── */

/** Render inline Markdown: **bold**, *italic*, links */
function renderInline(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, [link text](url)
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    // Link
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    // Find the earliest
    const matches: { index: number; length: number; replace: React.ReactNode }[] = [];
    if (boldMatch) matches.push({ index: boldMatch.index!, length: boldMatch[0].length, replace: <strong key={key++}>{boldMatch[1]}</strong> });
    if (italicMatch) matches.push({ index: italicMatch.index!, length: italicMatch[0].length, replace: <em key={key++}>{italicMatch[1]}</em> });
    if (linkMatch) matches.push({ index: linkMatch.index!, length: linkMatch[0].length, replace: <a key={key++} href={linkMatch[2]} className="underline underline-offset-2 text-[#6B4630] hover:text-[#BD8A5E] transition-colors">{linkMatch[1]}</a> });

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }
    parts.push(first.replace);
    remaining = remaining.slice(first.index + first.length);
  }

  return parts;
}

/** Render a list of blocks with variant-specific layout */
function renderBlocks(
  blocks: Block[],
  variant: number,
  delayBase: number
): React.ReactNode[] {
  return blocks.map((block, i) => {
    const delay = delayBase + i * 80;
    switch (block.type) {
      case "heading2":
        return (
          <Reveal key={`h2-${i}`} delay={delay}>
            <h2 className="mt-10 sm:mt-14 font-[Fraunces] text-xl sm:text-2xl lg:text-3xl text-[#17181A] tracking-[-0.02em]">
              {renderInline(block.text)}
            </h2>
          </Reveal>
        );
      case "heading3":
        if (variant === 6) {
          // Variant 6 uses numbered headings with wood numerals in body renderer, not here
          return (
            <Reveal key={`h3-${i}`} delay={delay}>
              <h3 className="mt-8 sm:mt-10 font-[Fraunces] text-lg sm:text-xl lg:text-2xl text-[#17181A] tracking-[-0.02em]">
                {renderInline(block.text)}
              </h3>
            </Reveal>
          );
        }
        return (
          <Reveal key={`h3-${i}`} delay={delay}>
            <h3 className="mt-8 sm:mt-10 font-[Fraunces] text-lg sm:text-xl lg:text-2xl text-[#17181A] tracking-[-0.02em]">
              {renderInline(block.text)}
            </h3>
          </Reveal>
        );
      case "unordered-list":
        return (
          <Reveal key={`ul-${i}`} delay={delay}>
            <ul className="my-4 sm:my-6 space-y-1.5 sm:space-y-2 pl-4 sm:pl-5 list-disc">
              {block.items.map((li, k) => (
                <li key={k} className="text-[#6B4630] marker:text-[#6B4630]">
                  {renderInline(li)}
                </li>
              ))}
            </ul>
          </Reveal>
        );
      case "ordered-list":
        return (
          <Reveal key={`ol-${i}`} delay={delay}>
            <ol className="my-4 sm:my-6 space-y-1.5 sm:space-y-2 pl-4 sm:pl-5 list-decimal">
              {block.items.map((li, k) => (
                <li key={k}>{renderInline(li)}</li>
              ))}
            </ol>
          </Reveal>
        );
      case "pullquote":
        return <PullQuote key={`pq-${i}`} text={block.text} delay={delay} />;
      case "divider":
        return <WoodDivider key={`div-${i}`} delay={delay} />;
      case "numbered-section":
        return (
          <Reveal key={`ns-${i}`} delay={delay}>
            <div className="my-6 sm:my-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <span className="font-[Fraunces] font-black text-[2rem] sm:text-[3rem] leading-none text-[#6B4630]/30 mt-[-2px] select-none shrink-0">
                  {String(block.num).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-[Fraunces] text-lg sm:text-xl lg:text-2xl text-[#17181A] tracking-[-0.02em]">
                    {renderInline(block.title)}
                  </h3>
                  {block.items.length > 0 && (
                    <ul className="mt-3 space-y-1.5 sm:space-y-2 pl-4 sm:pl-5 list-disc">
                      {block.items.map((li, k) => (
                        <li key={k} className="text-[#6B4630] marker:text-[#6B4630]">
                          {renderInline(li)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        );
      default:
        return (
          <Reveal key={`p-${i}`} delay={delay}>
            <p className="my-4 sm:my-6">{renderInline(block.text)}</p>
          </Reveal>
        );
    }
  });
}

/* ── Column layout wrappers ── */

function SingleColumnBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[65ch] px-5 sm:px-6 lg:px-10">
      <div className="font-[Archivo] text-sm sm:text-base leading-relaxed sm:leading-[1.8] text-[#17181A] space-y-5 sm:space-y-6">
        {children}
      </div>
    </div>
  );
}

function NarrowBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[58ch] px-5 sm:px-6 lg:px-10">
      <div className="font-[Archivo] text-sm sm:text-base leading-relaxed sm:leading-[1.8] text-[#17181A] space-y-5 sm:space-y-6">
        {children}
      </div>
    </div>
  );
}

function TwoColumnBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
      <div className="columns-1 md:columns-2 gap-x-8 lg:gap-x-10 font-[Archivo] text-sm sm:text-base leading-relaxed sm:leading-[1.8] text-[#17181A] [column-rule:1px_solid_rgba(107,70,48,0.15)] space-y-5 sm:space-y-6">
        {children}
      </div>
    </div>
  );
}

/* ── Sticky section marker body (Variant 2) ── */

function StickyMarkerBody({ children, blocks }: { children: React.ReactNode; blocks: Block[] }) {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10">
      <div className="relative lg:grid lg:grid-cols-[120px_1fr] lg:gap-x-10">
        {/* Side markers */}
        <div className="hidden lg:block relative">
          {blocks.map((b, i) => {
            if (b.type === "heading2" || b.type === "heading3") {
              const headingText = "text" in b ? (b.text as string) : "";
              return (
                <div
                  key={`marker-${i}`}
                  className="sticky text-[9px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]"
                  style={{ top: `${100 + i * 120}px` }}
                >
                  {headingText.split(" ").slice(0, 2).join(" ")}
                </div>
              );
            }
            return null;
          })}
        </div>
        {/* Body column */}
        <div className="font-[Archivo] text-sm sm:text-base leading-relaxed sm:leading-[1.8] text-[#17181A] space-y-5 sm:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Dropped cap (Variant 1) ── */

function DroppedCap({ text }: { text: string }) {
  const firstChar = text.charAt(0);
  const rest = text.slice(1);
  return (
    <>
      <span className="float-left mr-2 sm:mr-3 mt-1 font-[Fraunces] font-black text-[3.5rem] sm:text-[5rem] leading-[0.8] text-[#6B4630] bg-clip-text bg-gradient-to-b from-[#6B4630] to-[#BD8A5E]">
        {firstChar}
      </span>
      {rest}
    </>
  );
}

/* ── Image reveal (Ken Burns replacement for non-BlogHeader images) ── */

function ImageReveal({
  src,
  alt,
  className = "",
  aspect = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return (
    <div
      className={`overflow-hidden ${aspect} ${className}`}
      style={{
        filter: "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)",
      }}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{
          opacity: reduceMotion ? 1 : loaded ? 1 : 0,
          filter: reduceMotion ? "none" : loaded ? "none" : "blur(20px)",
          transform: reduceMotion ? "none" : loaded ? "scale(1)" : "scale(1.08)",
          animation: reduceMotion ? "none" : loaded ? "ken-burns 20s ease-in-out infinite" : "none",
          transition: "opacity 1.4s cubic-bezier(0.22,1,0.36,1), transform 1.4s cubic-bezier(0.22,1,0.36,1), filter 1.4s cubic-bezier(0.22,1,0.36,1)",
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

/* ── Body processing per variant ── */

function BodyRenderer({
  rawBody,
  variant,
  accentWord,
}: {
  rawBody: string;
  variant: number;
  accentWord?: string;
}) {
  const blocks = parseBlocks(rawBody, variant);
  const firstParagraphBlock = blocks.find((b) => b.type === "paragraph") as Extract<Block, { type: "paragraph" }> | undefined;
  const bodyBlocks = variant === 1 && firstParagraphBlock
    ? blocks.map((b, i) => {
        if (b.type === "paragraph" && i === blocks.indexOf(firstParagraphBlock)) {
          // Splice the first paragraph text to inject dropped cap
          return {
            ...b,
            text: b.text,
            _dropped: true,
          } as Extract<Block, { type: "paragraph" }> & { _dropped: boolean };
        }
        return b;
      })
    : blocks;

  const rendered = renderBlocks(bodyBlocks, variant, 200);

  switch (variant) {
    case 2:
      return <StickyMarkerBody blocks={blocks}>{rendered}</StickyMarkerBody>;
    case 3:
    case 5:
      return <TwoColumnBody>{rendered}</TwoColumnBody>;
    case 6:
    case 7:
      return <NarrowBody>{rendered}</NarrowBody>;
    default:
      return <SingleColumnBody>{rendered}</SingleColumnBody>;
  }
}

/* ── Image header component for variants that need custom (non-BlogHeader) treatments ── */

export function ImageHeader({
  src,
  alt,
  variant,
  title,
  accentWord,
  standfirst,
  credit,
}: {
  src: string;
  alt: string;
  variant: number;
  title: string;
  accentWord?: string;
  standfirst: string;
  credit?: string;
}) {
  // Split title for accent word styling
  const titleParts = accentWord ? title.split(accentWord) : null;
  const titleEl = (
    <h1 className="font-display font-semibold leading-[1.1] text-cream text-wrap-balance">
      <span className="text-[clamp(1.8rem,7vw,5rem)]">
        {titleParts ? (
          <>
            {titleParts[0]}
            <span className="word-wood">{accentWord}</span>
            {titleParts[1]}
          </>
        ) : (
          // Word-by-word reveal for full title
          title.split(" ").map((word, i) => (
            <span
              key={i}
              className="inline-block text-[clamp(1.8rem,7vw,5rem)]"
            >
              {word}{i < title.split(" ").length - 1 ? "\u00A0" : ""}
            </span>
          ))
        )}
      </span>
    </h1>
  );

  switch (variant) {
    case 3: {
      // Framed Portrait — arched top, centered, max-width 520px
      return (
        <div className="pt-[calc(56px+clamp(12px,2vw,24px))] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[520px]">
            <div className="relative overflow-hidden rounded-t-[50%_20%] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <ImageReveal src={src} alt={alt} aspect="aspect-[4/5]" />
            </div>
            <div className="mt-6 sm:mt-8 text-center">
              {titleEl}
            </div>
          </div>
        </div>
      );
    }

    case 6: {
      // Field Notes — small square offset left, title right
      return (
        <div className="pt-[calc(56px+clamp(12px,2vw,24px))] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-10 items-start">
              <div className="md:w-[400px] shrink-0">
                <div className="relative shadow-[8px_8px_0px_0px_rgba(107,70,48,0.15)]">
                  <ImageReveal src={src} alt={alt} aspect="aspect-square" />
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-2">
                {titleEl}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 8: {
      // Postcard — cream inset with wood frame + caption
      return (
        <div className="pt-[calc(56px+clamp(12px,2vw,24px))] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="bg-[#EFE8DA] p-3 sm:p-4 lg:p-5 border border-[#6B4630]/30">
              <ImageReveal src={src} alt={alt} aspect="aspect-[4/3]" />
            </div>
            {credit && (
              <p className="mt-2 sm:mt-3 font-[Fraunces] italic text-sm text-[#6B4630]/60 text-right">
                {credit}
              </p>
            )}
            <div className="mt-8 sm:mt-10">
              {titleEl}
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ── Main blog body container — applies variant-specific column layout ── */

export function BlogBody({
  rawBody,
  variant,
  post,
  accentWord,
}: {
  rawBody: string;
  variant: number;
  post: { excerpt?: string | null; title?: string };
  accentWord?: string;
}) {
  return (
    <article className="bg-[#EFE8DA] pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
      {/* Intro paragraph (Variant 4) */}
      {variant === 4 && post?.excerpt && (
        <SingleColumnBody>
          <Reveal delay={100}>
            <p className="font-[Fraunces] text-xl sm:text-2xl lg:text-3xl italic leading-snug text-[#17181A]">
              {post.excerpt}
            </p>
          </Reveal>
        </SingleColumnBody>
      )}

      {/* Body content */}
      <BodyRenderer rawBody={rawBody} variant={variant} accentWord={accentWord} />

      {/* Footer */}
      <SingleColumnBody>
        <Reveal delay={400}>
          <WoodDivider className="my-14 sm:my-20" />
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            Written by Toulmin Projects
          </p>
        </Reveal>
      </SingleColumnBody>
    </article>
  );
}
