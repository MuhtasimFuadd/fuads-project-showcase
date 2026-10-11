"use client";

import { BLOCK_KINDS, type BlockKind } from "@/lib/content";
import MediaUploader from "./MediaUploader";

export type EditorBlock = {
  key: string;
  kind: BlockKind;
  content: string;
  url: string;
  caption: string;
};

export function newKey() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const KIND_LABEL = Object.fromEntries(BLOCK_KINDS.map((b) => [b.kind, b.label])) as Record<BlockKind, string>;

export default function BlockEditor({
  blocks,
  onChange
}: {
  blocks: EditorBlock[];
  onChange: (b: EditorBlock[]) => void;
}) {
  function update(key: string, patch: Partial<EditorBlock>) {
    onChange(blocks.map((b) => (b.key === key ? { ...b, ...patch } : b)));
  }
  function move(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  }
  function remove(key: string) {
    onChange(blocks.filter((b) => b.key !== key));
  }
  function add(kind: BlockKind) {
    onChange([...blocks, { key: newKey(), kind, content: "", url: "", caption: "" }]);
  }

  return (
    <div>
      {blocks.length === 0 && (
        <p className="rounded-lg border border-dashed border-line p-6 text-center text-sm text-paper/45">
          No content blocks yet. Add text, images, videos and more below — they appear on the project
          page in this order.
        </p>
      )}

      <ol className="space-y-3">
        {blocks.map((b, i) => (
          <li key={b.key} className="rounded-xl border border-line bg-ink/60 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-accent-light">
                {i + 1}. {KIND_LABEL[b.kind]}
              </span>
              <div className="flex items-center gap-1 text-xs">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0}
                  className="rounded border border-line px-2 py-1 text-paper/60 hover:text-paper disabled:opacity-30" aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === blocks.length - 1}
                  className="rounded border border-line px-2 py-1 text-paper/60 hover:text-paper disabled:opacity-30" aria-label="Move down">↓</button>
                <button type="button" onClick={() => remove(b.key)}
                  className="rounded border border-line px-2 py-1 text-paper/60 hover:border-red-500/60 hover:text-red-400">Delete</button>
              </div>
            </div>

            {b.kind === "heading" && (
              <input value={b.content} onChange={(e) => update(b.key, { content: e.target.value })}
                placeholder="Section heading" className="field" />
            )}

            {b.kind === "text" && (
              <>
                <textarea value={b.content} onChange={(e) => update(b.key, { content: e.target.value })}
                  rows={6} placeholder="Write your text…" className="field" />
                <p className="mt-1 text-xs text-paper/35">
                  Blank line = new paragraph · <code>- item</code> = bullet · <code>**bold**</code> · <code>*italic*</code> · <code>`code`</code> · <code>[label](https://link)</code>
                </p>
              </>
            )}

            {b.kind === "image" && (
              <div className="space-y-3">
                <MediaUploader label="Image" kind="image" value={b.url} onChange={(url) => update(b.key, { url })} />
                <input value={b.caption} onChange={(e) => update(b.key, { caption: e.target.value })}
                  placeholder="Caption (optional)" className="field" />
              </div>
            )}

            {b.kind === "video" && (
              <div className="space-y-3">
                <MediaUploader label="Video" kind="video"
                  hint="Upload an MP4/WebM/MOV (max 50 MB), or paste a YouTube / Vimeo / Loom link."
                  value={b.url} onChange={(url) => update(b.key, { url })} />
                <input value={b.caption} onChange={(e) => update(b.key, { caption: e.target.value })}
                  placeholder="Caption (optional)" className="field" />
              </div>
            )}

            {b.kind === "embed" && (
              <div className="space-y-3">
                <input value={b.url} onChange={(e) => update(b.key, { url: e.target.value })}
                  placeholder="https://… YouTube, Vimeo, Loom, CodePen, CodeSandbox or Figma link" className="field" />
                <input value={b.caption} onChange={(e) => update(b.key, { caption: e.target.value })}
                  placeholder="Caption (optional)" className="field" />
              </div>
            )}

            {b.kind === "code" && (
              <div className="space-y-3">
                <textarea value={b.content} onChange={(e) => update(b.key, { content: e.target.value })}
                  rows={6} placeholder="Paste code…" className="field font-mono !text-xs" spellCheck={false} />
                <input value={b.caption} onChange={(e) => update(b.key, { caption: e.target.value })}
                  placeholder="Caption (optional)" className="field" />
              </div>
            )}

            {b.kind === "quote" && (
              <div className="space-y-3">
                <textarea value={b.content} onChange={(e) => update(b.key, { content: e.target.value })}
                  rows={3} placeholder="Quote or key takeaway" className="field" />
                <input value={b.caption} onChange={(e) => update(b.key, { caption: e.target.value })}
                  placeholder="Attribution (optional)" className="field" />
              </div>
            )}

            {b.kind === "link" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={b.content} onChange={(e) => update(b.key, { content: e.target.value })}
                  placeholder="Button label, e.g. Read the write-up" className="field" />
                <input value={b.url} onChange={(e) => update(b.key, { url: e.target.value })}
                  placeholder="https://…" className="field" />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-wider text-paper/40">Add block:</span>
        {BLOCK_KINDS.map((k) => (
          <button key={k.kind} type="button" onClick={() => add(k.kind)}
            className="rounded-full border border-line px-3 py-1 text-xs text-paper/75 hover:border-accent/60 hover:text-accent-light">
            + {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
