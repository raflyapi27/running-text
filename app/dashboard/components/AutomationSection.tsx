type AutomationItem = {
  id: string;
  text: string;
  speed: number;
  brightness: number;
  animation: string;
  size?: number;
  hour: number;
  minute: number;
  repeat: "daily" | "once";
  date: string | null;
  durationMinutes?: number | null;
  enabled: boolean;
};

type Props = {
  automations: AutomationItem[];
  loading: boolean;
  error: string | null;
  success: string | null;
  autoText: string;
  autoSpeed: number;
  autoBrightness: number;
  autoAnimation: string;
  autoHour: number;
  autoMinute: number;
  autoRepeat: "daily" | "once";
  autoDurationMinutes: number;
  setAutoText: (value: string) => void;
  setAutoSpeed: (value: number) => void;
  setAutoBrightness: (value: number) => void;
  setAutoAnimation: (value: string) => void;
  setAutoHour: (value: number) => void;
  setAutoMinute: (value: number) => void;
  setAutoRepeat: (value: "daily" | "once") => void;
  setAutoDurationMinutes: (value: number) => void;
  onSubmit: () => void;
  onToggle: (item: AutomationItem) => void;
  onDelete: (id: string) => void;
};

export function AutomationSection({
  automations,
  loading,
  error,
  success,
  autoText,
  autoSpeed,
  autoBrightness,
  autoAnimation,
  autoHour,
  autoMinute,
  autoRepeat,
  autoDurationMinutes,
  setAutoText,
  setAutoSpeed,
  setAutoBrightness,
  setAutoAnimation,
  setAutoHour,
  setAutoMinute,
  setAutoRepeat,
  setAutoDurationMinutes,
  onSubmit,
  onToggle,
  onDelete,
}: Props) {
  const timeValue = `${String(autoHour).padStart(2, "0")}:${String(
    autoMinute,
  ).padStart(2, "0")}`;

  const handleTimeChange = (value: string) => {
    const [hourPart, minutePart] = value.split(":");
    const hour = Number(hourPart);
    const minute = Number(minutePart);

    if (!Number.isNaN(hour) && hour >= 0 && hour <= 23) {
      setAutoHour(hour);
    }

    if (!Number.isNaN(minute) && minute >= 0 && minute <= 59) {
      setAutoMinute(minute);
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900 p-6 text-sm text-zinc-400 font-sans">
      <div className="mt-5 mb-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-200">
        <ul className="list-disc list-inside space-y-1">
          <li>Masukkan jam pengiriman (contoh: 06:00 PM).</li>
          <li>Pilih pengulangan: setiap hari atau hanya satu kali.</li>
          <li>
            Contoh: pesan <b>“Selamat pagi”</b> dikirim otomatis setiap hari jam
            06:00 PM, atau satu kali hari ini jam 02:00 PM.
          </li>
        </ul>
      </div>

      {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
      {success && <p className="mb-2 text-xs text-emerald-400">{success}</p>}

      <div className="mb-3">
        <label
          htmlFor="auto-text"
          className="mb-1 block text-xs font-medium text-zinc-200"
        >
          Masukkan Teks Disini :
        </label>
        <textarea
          id="auto-text"
          value={autoText}
          onChange={(event) => setAutoText(event.target.value.toUpperCase())}
          className="h-20 w-full resize-none rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 border-zinc-700 bg-zinc-800 text-zinc-50"
        />
      </div>

      <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="auto-hour"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Waktu Pesan Ditampilkan :
          </label>
          <input
            id="auto-hour"
            type="time"
            value={timeValue}
            onChange={(event) => handleTimeChange(event.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 border-zinc-700 bg-zinc-800 text-zinc-50"
          />
        </div>
        <div>
          <label
            htmlFor="auto-repeat"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Tipe Jadwal
          </label>
          <select
            id="auto-repeat"
            value={autoRepeat}
            onChange={(event) =>
              setAutoRepeat(event.target.value as "daily" | "once")
            }
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-90 border-zinc-700 bg-zinc-800 text-zinc-50"
          >
            <option value="daily">Setiap hari</option>
            <option value="once">Hanya sekali (hari ini)</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="auto-duration"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Masa Aktif Pesan (menit)
          </label>
          <input
            id="auto-duration"
            type="number"
            min={1}
            max={1440}
            value={autoDurationMinutes}
            onChange={(event) =>
              setAutoDurationMinutes(
                Math.max(1, Math.min(1440, Number(event.target.value) || 1)),
              )
            }
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-90 border-zinc-700 bg-zinc-800 text-zinc-50"
          />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="auto-speed"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Kecepatan ({autoSpeed})
          </label>
          <input
            id="auto-speed"
            type="range"
            min={10}
            max={100}
            value={autoSpeed}
            onChange={(event) => setAutoSpeed(Number(event.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-90 border-zinc-700 bg-zinc-800 text-zinc-50"
          />
        </div>
        <div>
          <label
            htmlFor="auto-brightness"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Kecerahan ({autoBrightness})
          </label>
          <input
            id="auto-brightness"
            type="range"
            min={0}
            max={255}
            value={autoBrightness}
            onChange={(event) => setAutoBrightness(Number(event.target.value))}
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-90 border-zinc-700 bg-zinc-800 text-zinc-50"
          />
        </div>
        <div>
          <label
            htmlFor="auto-animation"
            className="mb-1 block text-xs font-medium text-zinc-300"
          >
            Animasi
          </label>
          <select
            id="auto-animation"
            value={autoAnimation}
            onChange={(event) => setAutoAnimation(event.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm  shadow-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-90 border-zinc-700 bg-zinc-800 text-zinc-50"
          >
            <option value="none">No Animasi</option>
            <option value="slide">Slide</option>
            <option value="bounce">Bounce</option>
            <option value="typing">Typing</option>
            <option value="blink">Blink</option>
            <option value="curtain">Curtain</option>
            <option value="snake">Snake</option>
            <option value="checker">Checker</option>
            <option value="glitch">Glitch (Hacker)</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="mt-2 inline-flex items-center rounded-md bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500"
      >
        {loading ? "Menyimpan..." : "Simpan Jadwal Otomatis"}
      </button>

      <div className="mt-4 border-t border-dashed pt-4 border-zinc-800">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-200">
          Jadwal Aktif
        </h3>
        {loading && automations.length === 0 ? (
          <p className="text-xs">Memuat data...</p>
        ) : automations.length === 0 ? (
          <p className="text-xs">
            Belum ada jadwal otomatisasi teks yang tersimpan.
          </p>
        ) : (
          <ul className="space-y-2 text-xs">
            {automations.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-md border p-2 border-zinc-800"
              >
                <div className="flex-1">
                  <p className="font-medium text-zinc-100">{item.text}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    Jam {String(item.hour).padStart(2, "0")}:
                    {String(item.minute).padStart(2, "0")} •{" "}
                    {item.repeat === "daily"
                      ? "Setiap hari"
                      : item.date
                        ? `Sekali pada ${item.date}`
                        : "Sekali"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    Speed {item.speed} • Brightness {item.brightness} • Animasi{" "}
                    {item.animation} • Ukuran {item.size ?? 1}
                  </p>
                  {typeof item.durationMinutes === "number" &&
                    item.durationMinutes > 0 && (
                      <p className="mt-0.5 text-[11px] text-zinc-400">
                        Masa aktif {item.durationMinutes} menit
                      </p>
                    )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    onClick={() => onToggle(item)}
                    className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                      item.enabled
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-zinc-700 text-zinc-50 hover:bg-zinc-600"
                    }`}
                  >
                    {item.enabled ? "Aktif" : "Nonaktif"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-red-500"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
