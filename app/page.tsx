"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type User = {
  id: number;
  username: string;
  name: string;
};

type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
};

type StoredAuth = {
  token: string;
  user: User;
  expiresAt: number;
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
    if (
      !parsed.token ||
      !parsed.user ||
      typeof parsed.expiresAt !== "number"
    ) {
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

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const existing = getStoredAuth();
    if (existing) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as LoginResponse;

      if (!response.ok || !data.success || !data.token || !data.user) {
        setError(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      const expiresAt = Date.now() + 60 * 60 * 1000;

      const stored: StoredAuth = {
        token: data.token,
        user: data.user,
        expiresAt,
      };

      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));

      router.push("/dashboard");
    } catch (err) {
      setError("Gagal terhubung ke server, coba lagi.");
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <main className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 flex justify-center">
          <Image
            src="/logoo.png"
            alt="Logo PxMatrix"
            width={120}
            height={120}
            className="h-40 w-40 object-contain"
            priority
          />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-zinc-900"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black shado-sm outline-none "
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-900"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black shadow-sm outline-none "
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </main>
    </div>
  );
}
