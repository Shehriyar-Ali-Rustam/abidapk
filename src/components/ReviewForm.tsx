"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { Loader2, Send } from "lucide-react";

export function ReviewForm({ appId }: { appId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rating) return setError("Please select a rating");
    if (!comment.trim()) return setError("Please write a comment");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit");
      } else {
        setSubmitted(true);
        setComment("");
        setRating(0);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <div className="bg-blue-50 rounded-xl p-4 text-center text-sm">
        <p className="text-gray-600 mb-2">Sign in to leave a review</p>
        <Link href="/auth/login" className="text-blue-600 font-medium hover:underline">
          Login →
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 rounded-xl p-4 text-center text-sm text-green-700">
        ✓ Thanks for your review! It may take a moment to appear.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-700">Write a Review</p>

      <div className="flex items-center gap-2">
        <StarRating value={rating} onChange={setRating} />
        <span className="text-xs text-gray-400">{rating ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}</span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-end bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2 transition-colors"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
        Submit Review
      </button>
    </form>
  );
}
