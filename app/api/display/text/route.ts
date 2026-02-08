import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const API_KEY = process.env.API_KEY;

export async function POST(request: NextRequest) {
  if (!BACKEND_URL || !API_KEY) {
    return NextResponse.json(
      {
        success: false,
        message: "Server configuration error: Missing environment variables",
      },
      { status: 500 },
    );
  }
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/display/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        Authorization: authHeader ?? "",
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
        message: "Terjadi kesalahan saat mengirim teks ke PxMatrix",
      },
      { status: 500 },
    );
  }
}

