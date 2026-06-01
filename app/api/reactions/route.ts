import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id");
    const fingerprint = searchParams.get("fingerprint");

    if (!projectId) {
      return NextResponse.json({ error: "project_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reactions")
      .select("emoji, fingerprint")
      .eq("project_id", projectId);

    if (error) throw error;

    const counts: Record<string, { count: number; reacted: boolean }> = {};
    (data || []).forEach((r: { emoji: string; fingerprint: string }) => {
      if (!counts[r.emoji]) {
        counts[r.emoji] = { count: 0, reacted: false };
      }
      counts[r.emoji].count++;
      if (fingerprint && r.fingerprint === fingerprint) {
        counts[r.emoji].reacted = true;
      }
    });

    return NextResponse.json({ reactions: counts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load reactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { project_id, fingerprint, emoji } = await request.json();
    if (!project_id || !fingerprint || !emoji) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { error } = await supabase.from("reactions").insert({
      project_id,
      fingerprint,
      emoji,
    } as never);

    if (error) {
      if (error.code === "23505") {
        const { error: deleteError } = await supabase
          .from("reactions")
          .delete()
          .eq("project_id", project_id)
          .eq("fingerprint", fingerprint)
          .eq("emoji", emoji);
        if (deleteError) throw deleteError;
        return NextResponse.json({ removed: true });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
  }
}
