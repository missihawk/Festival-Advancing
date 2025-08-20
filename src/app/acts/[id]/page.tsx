"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import DateTimeField from "@/components/DateTimeField";

type Stage = { id: number; name: string };
type Act = { id: number; name: string; show_time: string | null; stageId: number | null };

export default function ActDetail() {
  const { id: idParam } = useParams<{ id: string }>();
  const id = Number(idParam);
  const router = useRouter();

  const [act, setAct] = useState<Act | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [name, setName] = useState("");
  const [showTime, setShowTime] = useState<string | null>(null);
  const [stageId, setStageId] = useState<string>("");

  useEffect(() => {
    (async () => {
      const [aRes, sRes] = await Promise.all([
        fetch(`/api/acts/${id}`, { cache: "no-store" }),
        fetch("/api/stages", { cache: "no-store" }),
      ]);

      if (!aRes.ok) {
        console.error("GET /api/acts/:id failed", await aRes.text());
        return;
      }
      if (!sRes.ok) {
        console.error("GET /api/stages failed", await sRes.text());
        return;
      }

      const a = await aRes.json();
      const s = await sRes.json();

      setAct(a);
      setStages(s);
      setName(a.name ?? "");
      setStageId(a.stageId != null ? String(a.stageId) : "");
      setShowTime(a.show_time ?? null);
    })();
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/acts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        show_time: showTime,
        stageId: stageId ? Number(stageId) : null,
      }),
    });
    router.push("/");
    router.refresh();
  }

  if (!act) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit act</h1>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Name</label>
          <input
            className="border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Show time</label>
            <DateTimeField value={showTime} onChange={setShowTime} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Stage</label>
            <select
              className="border rounded px-2 py-1"
              value={stageId}
              onChange={(e) => setStageId(e.target.value)}
            >
              <option value="">—</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="border rounded px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
            Save
          </button>
        </div>
      </form>
    </main>
  );
}
