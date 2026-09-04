import React, { useEffect, useState } from "react";
import { Reveal, WoodDivider } from "./motion";

/* ── Types ── */

type Block =
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "paragraph"; text: string }
  | { type: "callout"; text: string }
  | { type: "divider" };

/* ── Parser ── */

/**
 * Split body text into a list of typed blocks. The seed content uses blank
 * lines between sections and keeps a heading and its opening paragraph on
 * adjacent lines (`## Heading\nBody…`), so each section is parsed by its first
 * line and the remainder becomes body blocks.
 */
function parseBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  const sections = raw.split(/\n\s*\n/);
  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    // Divider: --- or ***
    if (/^[-*]{3,}$/.test(trimmed)) {
      blocks.push({ type: "divider" });
      continue;
    }

    // Pull quote: [text]
    const pq = trimmed.match(/^\[(.+)\]$/);
    if (pq) {
      blocks.push({ type: "paragraph", text: pq[1] });
      continue;
    }

    // Heading (## / ###), possibly followed by body on the next line
    const headingMatch = trimmed.match(/^(#{2,3})\s+([^\n]+)/);
    if (headingMatch) {
      const isH3 = headingMatch[1] === "###";
      blocks.push({ type: isH3 ? "heading3" : "heading2", text: headingMatch[2].trim() });
      const rest = trimmed.slice(headingMatch[0].length).trim();
      if (rest) blocks.push(...parseBodyText(rest));
      continue;
    }

    blocks.push(...parseBodyText(trimmed));
  }
  return blocks;
}

function parseBodyText(text: string): Block[] {
  // "Our tip:" callout
  if (/^Our tip:\s*/i.test(text)) {
    return [{ type: "callout", text: text.replace(/^Our tip:\s*/i, "") }];
  }

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Unordered list
  if (lines.length > 1 && lines.every((l) => /^[-*]\s/.test(l))) {
    return [{ type: "unordered-list", items: lines.map((l) => l.replace(/^[-*]\s*/, "")) }];
  }

  // Ordered list
  if (lines.length > 1 && lines.every((l) => /^\d+\.\s/.test(l))) {
    return [{ type: "ordered-list", items: lines.map((l) => l.replace(/^\d+\.\s*/, "")) }];
  }

  // Paragraph
  return [{ type: "paragraph", text }];
}

/* ── Inline markdown: **bold**, *italic*, [text](url) ── */

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

    const matches: { index: number; length: number; replace: React.ReactNode }[] = [];
    if (boldMatch) matches.push({ index: boldMatch.index!, length: boldMatch[0].length, replace: <strong key={key++}>{boldMatch[1]}</strong> });
    if (italicMatch) matches.push({ index: italicMatch.index!, length: italicMatch[0].length, replace: <em key={key++}>{italicMatch[1]}</em> });
    if (linkMatch) matches.push({ index: linkMatch.index!, length: linkMatch[0].length, replace: <a key={key++} href={linkMatch[2]} className="underline underline-offset-2 text-[#6B4630] hover:text-[#B9985A] transition-colors">{linkMatch[1]}</a> });

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) parts.push(remaining.slice(0, first.index));
    parts.push(first.replace);
    remaining = remaining.slice(first.index + first.length);
  }

  return parts;
}

/* ── Inline supporting image (Ken Burns + caption) ── */

function InlineImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <figure className="my-10 sm:my-14">
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-cover ${loaded && !reduceMotion ? "ken-burns" : ""}`}
          style={{
            opacity: reduceMotion ? 1 : loaded ? 1 : 0,
            filter: "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)",
            transition: "opacity 1.2s cubic-bezier(0.22,1,0.36,1)",
          }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 sm:mt-3 text-[11px] uppercase tracking-[0.16em] font-[Archivo] text-[#6B4630]/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* ── Block renderer ── */

function renderBlocks(
  blocks: Block[],
  supportingImage?: { src: string; alt: string; caption?: string },
): React.ReactNode[] {
  // Insert the supporting image after the first heading, or after the first
  // block if there is no heading — so no post is hero-image-then-wall-of-text.
  const firstHeadingIdx = blocks.findIndex((b) => b.type === "heading2" || b.type === "heading3");
  const insertAfter = firstHeadingIdx !== -1 ? firstHeadingIdx : Math.min(1, blocks.length - 1);

  const out: React.ReactNode[] = [];
  blocks.forEach((block, i) => {
    out.push(renderBlock(block, i));
    if (supportingImage && i === insertAfter) {
      out.push(
        <Reveal key={`img-${i}`}>
          <InlineImage src={supportingImage.src} alt={supportingImage.alt} caption={supportingImage.caption} />
        </Reveal>,
      );
    }
  });
  return out;
}

function renderBlock(block: Block, i: number): React.ReactNode {
  switch (block.type) {
    case "heading2":
      return (
        <Reveal key={`h2-${i}`}>
          <h2 className="mt-12 sm:mt-16 mb-4 sm:mb-5 flex items-center gap-3 font-[Fraunces] text-2xl sm:text-3xl font-semibold text-[#17181A] tracking-[-0.02em] leading-tight">
            <span className="inline-block h-px w-6 shrink-0 bg-[#B9985A]" aria-hidden="true" />
            <span>{renderInline(block.text)}</span>
          </h2>
        </Reveal>
      );
    case "heading3":
      return (
        <Reveal key={`h3-${i}`}>
          <h3 className="mt-10 sm:mt-12 mb-4 flex items-center gap-3 font-[Fraunces] text-xl sm:text-2xl font-semibold text-[#17181A] tracking-[-0.02em] leading-tight">
            <span className="inline-block h-px w-5 shrink-0 bg-[#B9985A]" aria-hidden="true" />
            <span>{renderInline(block.text)}</span>
          </h3>
        </Reveal>
      );
    case "unordered-list":
      return (
        <Reveal key={`ul-${i}`}>
          <ul className="my-6 space-y-2.5 pl-5 list-disc marker:text-[#B9985A]">
            {block.items.map((li, k) => (
              <li key={k}>{renderInline(li)}</li>
            ))}
          </ul>
        </Reveal>
      );
    case "ordered-list":
      return (
        <Reveal key={`ol-${i}`}>
          <ol className="my-6 space-y-2.5 pl-5 list-decimal marker:text-[#B9985A]">
            {block.items.map((li, k) => (
              <li key={k}>{renderInline(li)}</li>
            ))}
          </ol>
        </Reveal>
      );
    case "callout":
      return (
        <Reveal key={`callout-${i}`}>
          <aside className="my-8 sm:my-10 border-l-2 border-[#B9985A] bg-[#E8E0D0]/60 p-5 sm:p-7">
            <p className="text-[11px] uppercase tracking-[0.2em] font-[Archivo] font-semibold text-[#6B4630] mb-2">
              Our tip
            </p>
            <p>{renderInline(block.text)}</p>
          </aside>
        </Reveal>
      );
    case "divider":
      return <WoodDivider key={`div-${i}`} className="my-12 sm:my-16" />;
    case "paragraph":
    default:
      return (
        <Reveal key={`p-${i}`}>
          <p className="my-5 sm:my-6">{renderInline(block.text)}</p>
        </Reveal>
      );
  }
}

/* ── BlogBody — single consistent template across all posts ── */

export function BlogBody({
  rawBody,
  excerpt,
  supportingImage,
}: {
  rawBody: string;
  excerpt?: string | null;
  supportingImage?: { src: string; alt: string; caption?: string };
}) {
  const blocks = parseBlocks(rawBody);

  return (
    <article className="bg-[#EFE8DA]">
      {/* Reading column — centred, ~680–720px, balanced margins */}
      <div className="mx-auto max-w-[45rem] px-6 sm:px-8">
        <div className="pt-8 sm:pt-12 font-[Archivo] text-lg sm:text-[19px] leading-[1.7] text-[#17181A]">
          {excerpt && (
            <p className="font-[Fraunces] text-xl sm:text-2xl italic leading-snug text-[#6B4630] mb-8 sm:mb-10">
              {excerpt}
            </p>
          )}
          {renderBlocks(blocks, supportingImage)}
        </div>
      </div>
    </article>
  );
}
