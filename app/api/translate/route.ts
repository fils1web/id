import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://libretranslate.com/translate";

export async function POST(req: NextRequest) {
  try {
    const { q, source, target } = await req.json();
    if (!q || !target) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q,
        source: source || "auto",
        target,
        format: "text",
      }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Translation service unavailable" }, { status: 500 });
  }
}
