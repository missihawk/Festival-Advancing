"use client";

import { useEffect, useState } from "react";

type Act = { id: number; name: string; date: string };

export default function Home() {
  const [acts, setActs] = useState<Act[]>([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  async function load() {
    const res = await fetch("/api/acts");
    setActs(await res.json());
  }

  async function addAct(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/acts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, date }),
    });
    setName("");
    setDate("");
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Acts</h1>

      <form onSubmit={addAct} className="flex gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-sm">Name</label>
          <input className="border rounded px-2 py-1" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Date</label>
          <input type="datetime-local" className="border rounded px-2 py-1" value={date} onChange={e=>setDate(e.target.value)} required />
        </div>
        <button className="border rounded px-3 py-2 hover:bg-gray-50" type="submit">Add</button>
      </form>

      <ul className="space-y-2">
        {acts.map(a => (
          <li key={a.id} className="border rounded p-2">
            <div className="font-medium">{a.name}</div>
            <div className="text-sm text-gray-600">{new Date(a.date).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
