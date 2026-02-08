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
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat menghubungi server login",
      },
      { status: 500 },
    );
  }
}

