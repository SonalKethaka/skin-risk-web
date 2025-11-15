// src/app/History/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

type HistoryItem = {
  id: string;
  user_id: string;
  image_url: string | null;
  label: string;
  confidence: number | null;
  created_at: string;
};

const History: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("history")
          .select("id, user_id, image_url, label, confidence, created_at")
          .eq("user_id", user.uid)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setItems((data || []) as HistoryItem[]);
      } catch (err: any) {
        console.error("Failed to load history:", err);
        setError(err.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <p className="text-sm text-neutral-600">Checking your session…</p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-white">
        <section className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
            History
          </h1>
          <p className="text-sm text-neutral-700">
            Please log in to view your previous screenings.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-6 text-3xl font-semibold text-neutral-900">
          My Screening History
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-neutral-600">Loading your history…</p>
        )}

        {!loading && items.length === 0 && !error && (
          <p className="text-sm text-neutral-700">
            You haven&apos;t saved any screenings yet. Run a detection and save
            it to your history to see it here.
          </p>
        )}

        <div className="mt-4 space-y-4">
          {items.map((item) => {
            const isBenign = item.label.toLowerCase().includes("benign");
            const confidencePercent =
              typeof item.confidence === "number"
                ? (item.confidence * 100).toFixed(1)
                : null;
            const created = new Date(item.created_at);

            return (
              <article
                key={item.id}
                className={`rounded-2xl border p-4 shadow-sm md:p-5 ${
                  isBenign
                    ? "border-emerald-100 bg-emerald-50/40"
                    : "border-red-200 bg-red-50/40"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* Image preview */}
                  {item.image_url && (
                    <div className="md:w-48">
                      {/* using img tag so you don't have to configure next/image domains */}
                      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-black">
                        <img
                          src={item.image_url}
                          alt="Skin screening"
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Text content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p
                          className={`text-xs font-semibold uppercase ${
                            isBenign ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          AI Screening Result
                        </p>
                        <p
                          className={`text-lg font-semibold ${
                            isBenign ? "text-emerald-900" : "text-red-900"
                          }`}
                        >
                          {item.label}
                        </p>
                      </div>

                      <div className="text-right text-xs text-neutral-500">
                        <p>{created.toLocaleDateString()}</p>
                        <p>{created.toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {confidencePercent && (
                      <p className="text-sm text-neutral-700">
                        Confidence:{" "}
                        <span
                          className={
                            isBenign ? "font-semibold text-emerald-800" : "font-semibold text-red-800"
                          }
                        >
                          {confidencePercent}%
                        </span>
                      </p>
                    )}

                    <p className="text-xs text-neutral-600">
                      This record is based on an AI screening you previously
                      ran. It does not replace professional medical advice.
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default History;