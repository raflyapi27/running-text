import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;
const API_KEY = process.env.API_KEY;

export async function GET(request: NextRequest) {
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

    const response = await fetch(`${BACKEND_URL}/api/display/status`, {
      method: "GET",
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
        message: "Terjadi kesalahan saat mengambil status PxMatrix",
      },
      { status: 500 },
    );
  }
}

