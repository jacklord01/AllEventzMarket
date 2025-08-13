import React, { useState } from "react";
import { colors } from "@/styles/tokens";
// You can replace this with your preferred tooltip library/component
function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", left: "100%", top: 0, background: colors.primary, color: "#fff", padding: 4, borderRadius: 4, fontSize: 12, marginLeft: 8, zIndex: 10
        }}>{content}</span>
      )}
    </span>
  );
}

const NUMBERS = Array.from({ length: 47 }, (_, i) => i + 1);

export function LottoPicker({
  selected = [],
  alwaysInclude = [],
  onChange,
  onAlwaysIncludeChange,
}: {
  selected: number[];
  alwaysInclude: number[];
  onChange: (nums: number[]) => void;
  onAlwaysIncludeChange: (nums: number[]) => void;
}) {
  function toggleNumber(n: number) {
    onChange(selected.includes(n) ? selected.filter(x => x !== n) : [...selected, n]);
  }
  function toggleAlwaysInclude(n: number) {
    onAlwaysIncludeChange(alwaysInclude.includes(n) ? alwaysInclude.filter(x => x !== n) : [...alwaysInclude, n]);
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="font-semibold">Lucky Numbers</span>
        <Tooltip content="Numbers you always want included in quick pick.">
          <button
            aria-label="What is always include?"
            className="text-xs text-accent underline"
          >
            ?
          </button>
        </Tooltip>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {NUMBERS.map(n => (
          <button
            key={n}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-base font-bold transition
              ${selected.includes(n)
                ? "bg-primary text-white border-primary scale-105"
                : alwaysInclude.includes(n)
                  ? "bg-accent text-white border-accent"
                  : "bg-background text-text border-border hover:bg-secondary hover:text-white"}
            `}
            style={{
              outline: alwaysInclude.includes(n) ? `2px solid ${colors.accent}` : undefined,
            }}
            onClick={() => toggleNumber(n)}
            onContextMenu={e => {
              e.preventDefault();
              toggleAlwaysInclude(n);
            }}
            aria-pressed={selected.includes(n)}
            tabIndex={0}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-muted">
        <span>Right-click a number to always include it in quick pick.</span>
      </div>
    </div>
  );
}
