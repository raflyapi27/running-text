"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RunningTextSection, ZoneData } from "./components/RunningTextSection";
import { AutomationSection } from "./components/AutomationSection";
import { StatusPanelSection } from "./components/StatusPanelSection";
import { Sidebar } from "./components/Sidebar";
import { LayoutType } from "./components/LayoutSelector";


type User = {
  id: number;
  username: string;
  name: string;
};

type VerifyResponse =
  | {
      success: true;
      user: User;
    }
  | {
      success: false;
      message: string;
    };

type DisplayResponse = {
  success: boolean;
  message: string;
};

type DeviceStatusResponse = {
  success: boolean;
  message: string;
  mqtt: {
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
      size?: number;
      timestamp?: number;
    } | null;
  };
};

type StoredAuth = {
  token: string;
  user: User;
  expiresAt: number;
};

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

const AUTH_STORAGE_KEY = "pxmatrix_auth";

function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuth;
    if (!parsed.token || !parsed.user || typeof parsed.expiresAt !== "number") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    if (parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New State for Layouts
  const [layout, setLayout] = useState<LayoutType>("default");
  const [zones, setZones] = useState<ZoneData[]>([
    { text: "-", animation: "slide" },
    { text: "", animation: "slide" }, // Pre-allocate for potential zones
    { text: "", animation: "slide" }
  ]);
  
  const [isEdited, setIsEdited] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [brightness, setBrightness] = useState(128);
  const [actionLoading, setActionLoading] = useState<
    null | "text" | "start" | "stop"
  >(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<
    DeviceStatusResponse["mqtt"] | null
  >(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [automations, setAutomations] = useState<AutomationItem[]>([]);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [automationError, setAutomationError] = useState<string | null>(null);
  const [automationSuccess, setAutomationSuccess] = useState<string | null>(
    null,
  );
  const [autoText, setAutoText] = useState("SELAMAT PAGI");
  const [autoSpeed, setAutoSpeed] = useState(50);
  const [autoBrightness, setAutoBrightness] = useState(128);
  const [autoAnimation, setAutoAnimation] = useState("slide");
  const [autoHour, setAutoHour] = useState(6);
  const [autoMinute, setAutoMinute] = useState(0);
  const [autoRepeat, setAutoRepeat] = useState<"daily" | "once">("daily");
  const [activeMenu, setActiveMenu] = useState("running-text");
  const [autoDurationMinutes, setAutoDurationMinutes] = useState(5);

  useEffect(() => {
    if (!isEdited && deviceStatus?.status) {
      const s = deviceStatus.status as any;
      
      // Check if new layout format
      if (s.layout && Array.isArray(s.zones)) {
        setLayout(s.layout as LayoutType);
        setZones(s.zones);
      } else {
        // Fallback to legacy format
        const statusTextTop = s.textTop ?? s.text ?? "-";
        const statusTextBottom = s.textBottom ?? "";
        const statusAnimationTop = s.animationTop ?? s.animation ?? "slide";
        const statusAnimationBottom = s.animationBottom ?? statusAnimationTop;
        
        const hasBottom = statusTextBottom && statusTextBottom.length > 0;
        
        setLayout(hasBottom ? "split-h" : "default");
        setZones([
            { text: statusTextTop, animation: statusAnimationTop },
            { text: statusTextBottom, animation: statusAnimationBottom },
            { text: "", animation: "slide" }
        ]);
      }
      
      if (s.speed !== undefined) setSpeed(Number(s.speed));
      if (s.brightness !== undefined) setBrightness(Number(s.brightness));
    }
  }, [deviceStatus, isEdited]);


  const handleLogout = useCallback(async () => {
    const auth = getStoredAuth();
    clearStoredAuth();

    try {
      if (auth) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });
      }
    } catch {
    } finally {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth) {
      router.replace("/");
      return;
    }

    const remaining = auth.expiresAt - Date.now();
    if (remaining <= 0) {
      handleLogout();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      handleLogout();
    }, remaining);

    async function verify() {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = (await response.json()) as VerifyResponse;

        if (!response.ok || !data.success) {
          setError("Sesi sudah berakhir, silakan login ulang.");
          clearStoredAuth();
          router.replace("/");
          return;
        }

        setUser(data.user);
      } catch {
        setError("Gagal memuat data user.");
      } finally {
        setLoading(false);
      }
    }

    verify();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [handleLogout, router]);

  const fetchAutomations = useCallback(async () => {
    const auth = getStoredAuth();
    if (!auth) {
      return;
    }

    setAutomationLoading(true);
    setAutomationError(null);

    try {
      const response = await fetch("/api/automation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = (await response.json()) as {
        success: boolean;
        data?: AutomationItem[];
        message?: string;
      };

      if (!response.ok || !data.success || !data.data) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setAutomationError(
          data.message || "Gagal memuat data otomatisasi teks",
        );
        return;
      }

      setAutomations(data.data);
    } catch {
      setAutomationError("Gagal terhubung ke server untuk otomatisasi");
    } finally {
      setAutomationLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const auth = getStoredAuth();
    if (!auth) {
      return;
    }

    let intervalId: number | undefined;

    async function fetchStatusOnce() {
      try {
        const response = await fetch("/api/display/status", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        });

        const data = (await response.json()) as DeviceStatusResponse;

        if (!response.ok || !data.success) {
          if (response.status === 401) {
            await handleLogout();
            return;
          }
          setStatusError(data.message || "Gagal memuat status perangkat");
          return;
        }

        setDeviceStatus(data.mqtt);
        setStatusError(null);
      } catch {
        setStatusError("Gagal terhubung untuk status perangkat");
      }
    }

    fetchStatusOnce();
    intervalId = window.setInterval(fetchStatusOnce, 3000);

    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [handleLogout]);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  const sendText = async () => {
    setActionMessage(null);
    setActionLoading("text");
    
    const auth = getStoredAuth();
    if (!auth) {
      await handleLogout();
      return;
    }

    try {
      const response = await fetch("/api/display/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          layout,
          zones,
          speed,
          brightness,
          // Backward compatibility fields
          text: zones[0]?.text || "",
          textTop: zones[0]?.text || "",
          textBottom: zones[1]?.text || "",
          animation: zones[0]?.animation || "slide",
          animationBottom: zones[1]?.animation || "slide",
          mode: layout === "split-h" ? "double" : "single"
        }),
      });

      const data = (await response.json()) as DisplayResponse;

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setActionMessage(data.message || "Gagal mengirim teks");
      } else {
        setActionMessage(data.message || "Berhasil mengirim teks");
      }
    } catch {
      setActionMessage("Gagal terhubung ke server");
    } finally {
      setActionLoading(null);
    }
  };

  const sendControl = async (action: "start" | "stop") => {
    setActionMessage(null);
    setActionLoading(action);

    const auth = getStoredAuth();
    if (!auth) {
      await handleLogout();
      return;
    }

    try {
      const response = await fetch("/api/display/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          action,
        }),
      });

      const data = (await response.json()) as DisplayResponse;

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setActionMessage(data.message || "Gagal mengirim perintah");
      } else {
        setActionMessage(data.message || "Berhasil mengirim perintah");
      }
    } catch {
      setActionMessage("Gagal terhubung ke server");
    } finally {
      setActionLoading(null);
    }
  };

  const submitAutomation = async () => {
    setAutomationError(null);
    setAutomationSuccess(null);
    setAutomationLoading(true);

    const auth = getStoredAuth();
    if (!auth) {
      await handleLogout();
      return;
    }

    try {
      const body = {
        text: autoText,
        speed: autoSpeed,
        brightness: autoBrightness,
        animation: autoAnimation,
        size: autoSize,
        hour: autoHour,
        minute: autoMinute,
        repeat: autoRepeat,
        durationMinutes: autoDurationMinutes,
        enabled: true,
      };

      const response = await fetch("/api/automation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setAutomationError(
          data.message || "Gagal menyimpan otomatisasi teks",
        );
      } else {
        setAutomationSuccess(
          data.message || "Otomatisasi teks berhasil disimpan",
        );
        setAutoText("SELAMAT PAGI");
        setAutoSpeed(50);
        setAutoBrightness(128);
        setAutoAnimation("slide");
        setAutoHour(6);
        setAutoMinute(0);
        setAutoRepeat("daily");
        setAutoDurationMinutes(5);
        await fetchAutomations();
      }
    } catch {
      setAutomationError("Gagal terhubung ke server untuk otomatisasi");
    } finally {
      setAutomationLoading(false);
    }
  };

  const toggleAutomation = async (item: AutomationItem) => {
    setAutomationError(null);
    setAutomationSuccess(null);

    const auth = getStoredAuth();
    if (!auth) {
      await handleLogout();
      return;
    }

    try {
      const response = await fetch("/api/automation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          id: item.id,
          enabled: !item.enabled,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setAutomationError(
          data.message || "Gagal mengubah status otomatisasi",
        );
      } else {
        setAutomationSuccess(
          data.message || "Status otomatisasi berhasil diubah",
        );
        await fetchAutomations();
      }
    } catch {
      setAutomationError("Gagal terhubung ke server untuk otomatisasi");
    }
  };

  const deleteAutomation = async (id: string) => {
    setAutomationError(null);
    setAutomationSuccess(null);

    const auth = getStoredAuth();
    if (!auth) {
      await handleLogout();
      return;
    }

    try {
      const url = `/api/automation?id=${encodeURIComponent(id)}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        if (response.status === 401) {
          await handleLogout();
          return;
        }
        setAutomationError(
          data.message || "Gagal menghapus otomatisasi teks",
        );
      } else {
        setAutomationSuccess(
          data.message || "Otomatisasi teks berhasil dihapus",
        );
        await fetchAutomations();
      }
    } catch {
      setAutomationError("Gagal terhubung ke server untuk otomatisasi");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-md dark:bg-zinc-900">
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="mt-2 flex w-full items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Kembali ke login
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-700 ">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      />
      <main className="flex-1 p-2 md:p-8 overflow-y-auto">
        {activeMenu === "running-text" && (
          <div className="space-y-6">
            <RunningTextSection
              layout={layout}
              zones={zones}
              speed={speed}
              brightness={brightness}
              actionLoading={actionLoading}
              onChangeLayout={(val) => {
                setLayout(val);
                setIsEdited(true);
              }}
              onChangeZone={(index, data) => {
                const newZones = [...zones];
                if (!newZones[index]) {
                  newZones[index] = { text: "", animation: "slide" };
                }
                newZones[index] = { ...newZones[index], ...data };
                setZones(newZones);
                setIsEdited(true);
              }}
              onChangeSpeed={setSpeed}
              onChangeBrightness={setBrightness}
              onSend={sendText}
            />
            <div className="rounded-lg border border-dashed dark:border-zinc-800 dark:bg-zinc-900 p-6 text-sm text-zinc-600 dark:text-zinc-400 font-sans">
              <h2 className="mb-4 text-base font-semibold text-black dark:text-zinc-50">
                Kontrol Tampilan
              </h2>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => sendControl("start")}
                  disabled={actionLoading === "start"}
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400"
                >
                  {actionLoading === "start" ? "Mengirim..." : "Start"}
                </button>
                <button
                  type="button"
                  onClick={() => sendControl("stop")}
                  disabled={actionLoading === "stop"}
                  className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {actionLoading === "stop" ? "Mengirim..." : "Stop"}
                </button>
              </div>
            </div>
            {actionMessage && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {actionMessage}
              </p>
            )}
          </div>
        )}

        {activeMenu === "automation" && (
          <AutomationSection
            automations={automations}
            loading={automationLoading}
            error={automationError}
            success={automationSuccess}
            autoText={autoText}
            autoSpeed={autoSpeed}
            autoBrightness={autoBrightness}
            autoAnimation={autoAnimation}
              autoHour={autoHour}
            autoMinute={autoMinute}
            autoRepeat={autoRepeat}
            autoDurationMinutes={autoDurationMinutes}
            setAutoText={setAutoText}
            setAutoSpeed={setAutoSpeed}
            setAutoBrightness={setAutoBrightness}
            setAutoAnimation={setAutoAnimation}
              setAutoHour={setAutoHour}
            setAutoMinute={setAutoMinute}
            setAutoRepeat={setAutoRepeat}
            setAutoDurationMinutes={setAutoDurationMinutes}
            onSubmit={submitAutomation}
            onToggle={toggleAutomation}
            onDelete={deleteAutomation}
          />
        )}

        {activeMenu === "status" && (
          <StatusPanelSection
            deviceStatus={deviceStatus}
            statusError={statusError}
          />
        )}
      </main>
    </div>
  );
}
