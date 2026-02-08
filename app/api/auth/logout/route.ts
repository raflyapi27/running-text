import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

const API_KEY = process.env.API_KEY;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL environment variable is not set");
}

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        Authorization: authHeader ?? "",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat logout",
      },
      { status: 500 },
    );
  }
}

