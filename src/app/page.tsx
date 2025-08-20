"use client";

import { useEffect, useState } from "react";
import HeaderActions from "@/components/HeaderActions";

type Act = {
  id: number;
  name: string;
  show_time: string | null;
  stage?: { id: number; name: string | null } | null;
};

export default function Home() {
  const [acts, setActs] = useState<Act[]>([]);

  async function load() {
    const res = await fetch("/api/acts");
    if (!res.ok) {
      console.error("GET /api/acts failed", await res.text());
      setActs([]);
      return;
    }
    setActs(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("nl-NL", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "—";

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Acts</h1>
        <HeaderActions />
      </div>

      <ul className="space-y-2">
        {acts.map((a) => (
          <li key={a.id} className="border rounded p-3 bg-white shadow-sm">
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-gray-700">
              Showtime: {fmt(a.show_time)}{a.stage?.name ? ` • ${a.stage.name}` : ""}
            </div>
          </li>
        ))}
        {acts.length === 0 && (
          <li className="text-sm text-gray-500">No acts yet.</li>
        )}
      </ul>
    </main>
  );
}