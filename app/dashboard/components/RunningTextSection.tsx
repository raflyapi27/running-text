import { LayoutSelector, LayoutType, LAYOUTS } from "./LayoutSelector";
import { MatrixPreview } from "./MatrixPreview";

export type ZoneData = {
  text: string;
  animation: string;
  border?: boolean;
};

type Props = {
  layout: LayoutType;
  zones: ZoneData[];
  speed: number;
  brightness: number;
  actionLoading: null | "text" | "start" | "stop";
  onChangeLayout: (layout: LayoutType) => void;
  onChangeZone: (index: number, data: Partial<ZoneData>) => void;
  onChangeSpeed: (value: number) => void;
  onChangeBrightness: (value: number) => void;
  onSend: () => void;
};

export function RunningTextSection({
  layout,
  zones,
  speed,
  brightness,
  actionLoading,
  onChangeLayout,
  onChangeZone,
  onChangeSpeed,
  onChangeBrightness,
  onSend,
}: Props) {
  const currentLayout = LAYOUTS.find((l) => l.id === layout) || LAYOUTS[0];
  const zoneCount = currentLayout.zones;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 shadow-sm  font-sans">
      <h2 className="text-lg font-semibold text-zinc-50 mb-4">Running Text</h2>

      <MatrixPreview
        layout={layout}
        zones={zones}
        speed={speed}
        brightness={brightness}
      />

      <LayoutSelector selectedLayout={layout} onSelect={onChangeLayout} />

      <div className="space-y-4 mb-4">
        {Array.from({ length: zoneCount }).map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-md border border-zinc-800 bg-zinc-800/50"
          >
            <h3 className="text-xs font-medium text-zinc-400 mb-2">
              Zona {index + 1}
            </h3>
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-zinc-300">
                Teks
              </label>
              <textarea
                value={zones[index]?.text || ""}
                onChange={(e) =>
                  onChangeZone(index, { text: e.target.value.toUpperCase() })
                }
                className="h-20 w-full resize-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 shadow-sm outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                placeholder="Masukkan teks..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-300">
                Animasi
              </label>
              <select
                value={zones[index]?.animation || "slide"}
                onChange={(e) =>
                  onChangeZone(index, { animation: e.target.value })
                }
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 shadow-sm outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
              >
                <option value="none">No Animasi</option>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
                <option value="typing">Typing</option>
                <option value="blink">Blink</option>
                <option value="snake">Snake</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 mt-3">
              <input
                type="checkbox"
                id={`border-${index}`}
                checked={zones[index]?.border || false}
                onChange={(e) =>
                  onChangeZone(index, { border: e.target.checked })
                }
                className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-50 focus:ring-zinc-700"
              />
              <label
                htmlFor={`border-${index}`}
                className="text-xs font-medium text-zinc-300 select-none"
              >
                Tampilkan Bingkai
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="speed"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Kecepatan ({speed})
          </label>
          <input
            id="speed"
            type="range"
            min={10}
            max={200}
            value={speed}
            onChange={(event) => onChangeSpeed(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label
            htmlFor="brightness"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Kecerahan ({brightness})
          </label>
          <input
            id="brightness"
            type="range"
            min={0}
            max={255}
            value={brightness}
            onChange={(event) => onChangeBrightness(Number(event.target.value))}
            className="w-full"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onSend}
        disabled={actionLoading === "text"}
        className="mt-2 inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {actionLoading === "text" ? "Mengirim..." : "Kirim Text"}
      </button>
    </div>
  );
}
