/**
 * Lightweight markdown renderer for assistant messages.
 *
 * Supported syntax:
 *   **bold**         → <strong>
 *   *italic*         → <em>
 *   `code`           → <code>
 *   - list item      → bulleted list (consecutive lines starting with "-")
 *   blank lines      → paragraph breaks
 *   single \n        → line break within a paragraph
 *
 * No external dependencies. Designed for natural-language assistant replies,
 * not arbitrary markdown documents — keeps the parser small and predictable
 * so Bengali conjuncts and vowel marks render correctly.
 */
import type { ReactNode } from "react";

/** Escape user-controlled text before injecting into DOM as React children. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Render inline markdown tokens inside a single line of text.
 * Recursively splits by bold → italic → code, returning ReactNode fragments.
 */
function renderInlineLine(line: string, keyPrefix: string): ReactNode {
  // Bold first (**...**), then italic (*...*), then inline code (`...`)
  const boldSplit = line.split(/(\*\*[^*\n]+\*\*)/g);
  return boldSplit.map((part, i) => {
    if (/^\*\*[^*\n]+\*\*$/.test(part)) {
      const inner = part.slice(2, -2);
      return (
        <strong key={`${keyPrefix}-b-${i}`}>{renderInlineLine(inner, `${keyPrefix}-b-${i}`)}</strong>
      );
    }
    const italicSplit = part.split(/(\*[^*\n]+\*)/g);
    return italicSplit.map((sub, j) => {
      if (/^\*[^*\n]+\*$/.test(sub)) {
        const inner = sub.slice(1, -1);
        return (
          <em key={`${keyPrefix}-i-${i}-${j}`}>{renderInlineLine(inner, `${keyPrefix}-i-${j}`)}</em>
        );
      }
      const codeSplit = sub.split(/(`[^`\n]+`)/g);
      return codeSplit.map((frag, k) => {
        if (/^`[^`\n]+`$/.test(frag)) {
          const inner = frag.slice(1, -1);
          return (
            <code
              key={`${keyPrefix}-c-${i}-${j}-${k}`}
              className="rounded bg-surface px-1.5 py-0.5 text-xs font-mono"
            >
              {inner}
            </code>
          );
        }
        // Plain text fragment
        return <span key={`${keyPrefix}-t-${i}-${j}-${k}`}>{frag}</span>;
      });
    });
  });
}

interface Block {
  type: "paragraph" | "list";
  lines: string[];
}

/**
 * Split a multi-line string into blocks. Adjacent `- ` lines form a list;
 * everything else becomes paragraphs.
 */
function splitBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  const rawLines = text.split(/\n/);
  let current: Block | null = null;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (trimmed === "") {
      if (current) {
        blocks.push(current);
        current = null;
      }
      continue;
    }
    const isListItem = /^[-*]\s+/.test(trimmed);
    if (current && current.type === "list" && isListItem) {
      current.lines.push(trimmed.replace(/^[-*]\s+/, ""));
    } else if (isListItem) {
      if (current) blocks.push(current);
      current = { type: "list", lines: [trimmed.replace(/^[-*]\s+/, "")] };
    } else {
      if (current && current.type === "paragraph") {
        current.lines.push(trimmed);
      } else {
        if (current) blocks.push(current);
        current = { type: "paragraph", lines: [trimmed] };
      }
    }
  }
  if (current) blocks.push(current);
  return blocks;
}

/**
 * Render an assistant message body with light markdown support.
 * Returns React fragment with appropriate paragraph / list structure.
 */
export function renderInline(text: string): ReactNode {
  if (!text) return null;
  const blocks = splitBlocks(text);
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === "list") {
          return (
            <ul
              key={`block-${idx}`}
              className="my-2 ml-5 list-disc space-y-1 marker:text-foreground-subtle"
            >
              {block.lines.map((line, j) => (
                <li key={`li-${idx}-${j}`}>{renderInlineLine(line, `li-${idx}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={`block-${idx}`} className={idx > 0 ? "mt-2" : undefined}>
            {block.lines.map((line, j) => (
              <span key={`p-${idx}-${j}`} className="block">
                {renderInlineLine(line, `p-${idx}-${j}`)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

/**
 * Variant that returns an HTML string for environments where JSX is not
 * available (e.g. service-level mock generators). Not used by React
 * components but kept for parity with the JSX renderer.
 */
export function renderInlineToHtml(text: string): string {
  if (!text) return "";
  const blocks = splitBlocks(text);
  return blocks
    .map((block) => {
      if (block.type === "list") {
        return (
          "<ul>" +
          block.lines
            .map((line) => `<li>${escapeHtml(line).replace(/\n/g, "<br>")}</li>`)
            .join("") +
          "</ul>"
        );
      }
      const inner = block.lines
        .map((line) => escapeHtml(line).replace(/\n/g, "<br>"))
        .join("<br>");
      return `<p>${inner}</p>`;
    })
    .join("");
}