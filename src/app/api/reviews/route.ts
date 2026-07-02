import { NextResponse } from "next/server";
import { getSupabaseService } from "@/lib/supabase/server";

/** Submits a verified-buyer review via a magic-link token (single use). */
export async function POST(request: Request) {
  let body: { token?: string; rating?: number; author?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { token, rating, author, body: reviewBody } = body ?? {};
  if (
    !token ||
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5 ||
    !author ||
    author.trim().length < 2 ||
    !reviewBody ||
    reviewBody.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Please add your name, a rating, and at least a sentence about your experience." },
      { status: 400 }
    );
  }

  const { error } = await getSupabaseService().rpc("submit_review", {
    p_token: token,
    p_rating: Math.round(rating),
    p_author: author.trim(),
    p_body: reviewBody.trim(),
  });

  if (error) {
    if (error.message.includes("invalid_or_used_token")) {
      return NextResponse.json(
        { error: "This review link has already been used or is no longer valid." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Could not submit review. Try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
