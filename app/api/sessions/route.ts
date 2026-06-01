import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fingerprint, name, is_online } = body;

    if (!fingerprint) {
      return NextResponse.json({ error: "fingerprint is required" }, { status: 400 });
    }

    const online = is_online !== undefined ? is_online : true;
    const now = new Date().toISOString();

    const { data: existing, error: selectError } = await supabaseAdmin
      .from("user_sessions")
      .select("id")
      .eq("fingerprint", fingerprint)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const updates: Record<string, unknown> = { last_seen: now, is_online: online };
      if (name) updates.name = name;
      const { error: updateError } = await supabaseAdmin
        .from("user_sessions")
        .update(updates as never)
        .eq("fingerprint", fingerprint);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("user_sessions")
        .insert({ fingerprint, name: name || null, last_seen: now, is_online: online } as never);
      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true, last_seen: now });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fingerprint = searchParams.get("fingerprint");

    if (!fingerprint) {
      return NextResponse.json({ error: "fingerprint is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_sessions")
      .select("*")
      .eq("fingerprint", fingerprint)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ session: data || null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
  }
}
