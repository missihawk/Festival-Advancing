"use client";

import { useEffect, useState } from "react";
import HeaderActions from "@/components/HeaderActions";
import Link from "next/link";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

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
  iso ? format(new Date(iso), "dd-MM-yyyy HH:mm", { locale: nl }) : "—";

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Acts</h1>
        <HeaderActions />
      </div>

      <ul className="space-y-2">
        {acts.map((a) => (
          <li key={a.id} className="border rounded p-3 bg-white shadow-sm">
            <Link href={`/acts/${a.id}`} className="block">
              <div className="font-medium">{a.name}</div>
              <div className="text-sm text-gray-700">
                Showtime: {fmt(a.show_time)}{a.stage?.name ? ` • ${a.stage.name}` : ""}
              </div>
            </Link>
          </li>
        ))}
        {acts.length === 0 && (
          <li className="text-sm text-gray-500">No acts yet.</li>
        )}
      </ul>
    </main>
  );
}