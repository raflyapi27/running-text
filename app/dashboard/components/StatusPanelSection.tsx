type DeviceStatus = {
  connected: boolean;
  broker: string;
  lastStatusAt?: string | null;
  status?: {
    status?: string;
    ip?: string;
    text?: string;
    textTop?: string;
    textBottom?: string;
    running?: boolean;
    speed?: number;
    brightness?: number;
    animation?: string;
    animationTop?: string;
    animationBottom?: string;
    size?: number;
    timestamp?: number;
  } | null;
};

type Props = {
  deviceStatus: DeviceStatus | null;
  statusError: string | null;
  onSendControl: (action: "start" | "stop") => void;
  actionLoading?: string | null;
  actionMessage?: string | null;
};

export function StatusPanelSection({
  deviceStatus,
  statusError,
  onSendControl,
  actionLoading,
  actionMessage,
}: Props) {
  return (
    <div className="space-y-6">
      <div className=" p-6 rounded-xl shadow-md border-zinc-800 bg-zinc-900  font-sans">
        <h2 className="text-xl font-semibold text-zinc-50 mb-4">
          Status Panel
        </h2>

        {statusError && (
          <p className="mb-2 text-xs text-red-400">
            {statusError}
          </p>
        )}
        {deviceStatus?.status ? (
          <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            <p>
              <span className="font-medium">Koneksi MQTT:</span>{" "}
              {deviceStatus.connected ? "Terhubung" : "Terputus"}
            </p>
            <p>
              <span className="font-medium">IP Panel:</span>{" "}
              {deviceStatus.status.ip ?? "-"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium">Teks Atas:</span>{" "}
              {deviceStatus.status.textTop ?? deviceStatus.status.text ?? "-"}
            </p>
            <p className="sm:col-span-2">
              <span className="font-medium">Teks Bawah:</span>{" "}
              {deviceStatus.status.textBottom ?? "-"}
            </p>
            <p>
              <span className="font-medium">Running:</span>{" "}
              {deviceStatus.status.running ? "Ya" : "Tidak"}
            </p>
            <p>
              <span className="font-medium">Animasi Atas/Bawah:</span>{" "}
              {deviceStatus.status.animationTop ??
                deviceStatus.status.animation ??
                "-"}
              {" / "}
              {deviceStatus.status.animationBottom ??
                deviceStatus.status.animation ??
                "-"}
            </p>
            <p>
              <span className="font-medium">Kecepatan:</span>{" "}
              {deviceStatus.status.speed ?? "-"}
            </p>
            <p>
              <span className="font-medium">Brightness:</span>{" "}
              {deviceStatus.status.brightness ?? "-"}
            </p>
            <p>
              <span className="font-medium">Ukuran Teks:</span>{" "}
              {deviceStatus.status.size ?? "-"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-600 ">
            Menunggu status dari panel... running text belum terhubung.
          </p>
        )}
      </div>
      {onSendControl && (
        <div className=" p-6 rounded-xl shadow-md border-zinc-800 bg-zinc-900  font-sans">
          <h2 className="text-xl font-semibold text-zinc-50 mb-4">
            Kontrol Tampilan
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onSendControl("start")}
              disabled={actionLoading === "start"}
              className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400"
            >
              {actionLoading === "start" ? "Mengirim..." : "Start"}
            </button>
            <button
              type="button"
              onClick={() => onSendControl("stop")}
              disabled={actionLoading === "stop"}
              className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
            >
              {actionLoading === "stop" ? "Mengirim..." : "Stop"}
            </button>
          </div>
          {actionMessage && (
            <p className="text-xs text-zinc-400 mt-4">
              {actionMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
