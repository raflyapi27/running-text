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

    const response = await fetch(`${BACKEND_URL}/api/automation`, {
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
        message: "Terjadi kesalahan saat mengambil data otomatisasi",
      },
      { status: 500 },
    );
  }
}

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

    const response = await fetch(`${BACKEND_URL}/api/automation`, {
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
        message: "Terjadi kesalahan saat membuat otomatisasi",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const { id, ...rest } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "ID otomatisasi harus diisi",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/automation/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        Authorization: authHeader ?? "",
      },
      body: JSON.stringify(rest),
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengubah otomatisasi",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID otomatisasi harus diisi",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/automation/${id}`, {
      method: "DELETE",
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
        message: "Terjadi kesalahan saat menghapus otomatisasi",
      },
      { status: 500 },
    );
  }
}

