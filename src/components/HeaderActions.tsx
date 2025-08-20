"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import DateTimeField from "@/components/DateTimeField";

type Stage = { id: number; name: string };

export default function HeaderActions() {
  const router = useRouter();

  // dropdown -> welke modal open
  const [openAct, setOpenAct] = useState(false);
  const [openStage, setOpenStage] = useState(false);

  // --- Act form state
  const [actName, setActName] = useState("");
  const [showTime, setShowTime] = useState<string | null>(null);
  const [stageId, setStageId] = useState<string>("");      // "" = none
  const [stages, setStages] = useState<Stage[]>([]);

  // --- Stage form state
  const [stageName, setStageName] = useState("");
  const [stageOrder, setStageOrder] = useState<string>("20");
  const [stageColor, setStageColor] = useState<string>("#2563eb");

  useEffect(() => {
    // preload stages voor de Act-modal
    fetch("/api/stages").then(r => r.json()).then(setStages).catch(() => setStages([]));
  }, []);

  async function createAct(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/acts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: actName,
        show_time: showTime,
        stageId: stageId ? Number(stageId) : null,
      }),
    });
    setOpenAct(false);
    setActName(""); setShowTime(null); setStageId("");
    router.refresh();
  }

  async function createStage(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/stages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: stageName,
        order: Number(stageOrder),
        color: stageColor,
      }),
    });
    setOpenStage(false);
    setStageName(""); setStageOrder("10");
    // color laten staan of resetten, jouw keuze
    fetch("/api/stages").then(r => r.json()).then(setStages);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenAct(true)}>Add act</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenStage(true)}>Add stage</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Act modal */}
      <Dialog open={openAct} onOpenChange={setOpenAct}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add act</DialogTitle>
            <DialogDescription>Basic fields to create a new act.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createAct} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="act-name">Name</Label>
              <Input id="act-name" value={actName} onChange={(e) => setActName(e.target.value)} required />
            </div>

            {/* showtime + stage naast elkaar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="show-time">Show time</Label>
                <DateTimeField value={showTime} onChange={setShowTime} />
              </div>
              <div className="grid gap-2">
                <Label>Stage</Label>
                <Select value={stageId} onValueChange={setStageId}>
                  <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                  <SelectContent>
                    {stages.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Stage modal */}
      <Dialog open={openStage} onOpenChange={setOpenStage}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add stage</DialogTitle>
            <DialogDescription>Define name, sort order and optional color.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createStage} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="stage-name">Name</Label>
              <Input id="stage-name" value={stageName} onChange={(e) => setStageName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stage-order">Sort order</Label>
                <Input id="stage-order" type="number" value={stageOrder} onChange={(e) => setStageOrder(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stage-color">Color</Label>
                <input
                  id="stage-color"
                  type="color"
                  value={stageColor}
                  onChange={(e) => setStageColor(e.target.value)}
                  className="h-10 w-full border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}