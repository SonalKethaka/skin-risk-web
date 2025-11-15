import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_API_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const backendForm = new FormData();
    backendForm.append("file", file, "skin-photo.jpg");

    const res = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      body: backendForm,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend error:", text);
      return NextResponse.json(
        { error: "Backend analysis failed" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Predict API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}