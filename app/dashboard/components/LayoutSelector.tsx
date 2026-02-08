import React from "react";

export type LayoutType =
  | "default"
  | "split-h"
  | "split-v"
  | "left-big"
  | "right-big";

export const LAYOUTS: { id: LayoutType; name: string; zones: number }[] = [
  { id: "default", name: "Full Screen", zones: 1 },
  { id: "split-h", name: "Split Horizontal", zones: 2 },
  { id: "split-v", name: "Split Vertical", zones: 2 },
  { id: "left-big", name: "Left Big (1+2)", zones: 3 },
  { id: "right-big", name: "Right Big (2+1)", zones: 3 },
];

type Props = {
  selectedLayout: LayoutType;
  onSelect: (layout: LayoutType) => void;
};

export function LayoutSelector({ selectedLayout, onSelect }: Props) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-xs font-medium text-zinc-300">
        Pilih Layout
      </label>
      <div className="grid grid-cols-5 gap-2">
        {LAYOUTS.map((layout) => (
          <button
            key={layout.id}
            onClick={() => onSelect(layout.id)}
            className={`group relative flex aspect-video w-full flex-col overflow-hidden rounded-md border-2 transition-all ${
              selectedLayout === layout.id
                ? "border-emerald-500 bg-zinc-800"
                : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
            }`}
            title={layout.name}
          >
            {/* Visual representation of the layout */}
            {layout.id === "default" && (
              <div className="h-full w-full bg-zinc-700/50" />
            )}
            {layout.id === "split-h" && (
              <div className="flex h-full flex-col gap-px bg-zinc-800">
                <div className="flex-1 bg-zinc-700/50" />
                <div className="flex-1 bg-zinc-700/50" />
              </div>
            )}
            {layout.id === "split-v" && (
              <div className="flex h-full gap-px bg-zinc-800">
                <div className="flex-1 bg-zinc-700/50" />
                <div className="flex-1 bg-zinc-700/50" />
              </div>
            )}
            {layout.id === "left-big" && (
              <div className="flex h-full gap-px bg-zinc-800">
                <div className="flex-[2] bg-zinc-700/50" />
                <div className="flex flex-1 flex-col gap-px bg-zinc-800">
                  <div className="flex-1 bg-zinc-700/50" />
                  <div className="flex-1 bg-zinc-700/50" />
                </div>
              </div>
            )}
            {layout.id === "right-big" && (
              <div className="flex h-full gap-px bg-zinc-800">
                <div className="flex flex-1 flex-col gap-px bg-zinc-800">
                  <div className="flex-1 bg-zinc-700/50" />
                  <div className="flex-1 bg-zinc-700/50" />
                </div>
                <div className="flex-[2] bg-zinc-700/50" />
              </div>
            )}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {LAYOUTS.find((l) => l.id === selectedLayout)?.name}
      </p>
    </div>
  );
}
