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

type Stage = { id: number; name: string };

export default function HeaderActions() {
  const router = useRouter();

  // dropdown -> welke modal open
  const [openAct, setOpenAct] = useState(false);
  const [openStage, setOpenStage] = useState(false);

  // --- Act form state
  const [actName, setActName] = useState("");
  const [showTime, setShowTime] = useState("");            // datetime-local string
  const [stageId, setStageId] = useState<string>("");      // "" = none
  const [stages, setStages] = useState<Stage[]>([]);

  // --- Stage form state
  const [stageName, setStageName] = useState("");
  const [stageOrder, setStageOrder] = useState<string>("100");
  const [stageColor, setStageColor] = useState<string>("");

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
        date: showTime || new Date().toISOString(), // je Act model heet 'date' in jouw eerdere demo; vervang evt. door show_time op Act
        // Voor je echte schema: stuur show_time en (optioneel) stageId naar een dedicated endpoint
      }),
    });
    setOpenAct(false);
    setActName(""); setShowTime(""); setStageId("");
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
        color: stageColor || null,
      }),
    });
    setOpenStage(false);
    setStageName(""); setStageOrder("100"); setStageColor("");
    // refresh ook de stages in de Act-modal
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

            <div className="grid gap-2">
              <Label htmlFor="show-time">Show time</Label>
              <Input id="show-time" type="datetime-local" value={showTime} onChange={(e) => setShowTime(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Stage (optional)</Label>
              <Select value={stageId} onValueChange={setStageId}>
                <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {stages.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogDescription>Define name, order and optional color.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createStage} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="stage-name">Name</Label>
              <Input id="stage-name" value={stageName} onChange={(e) => setStageName(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage-order">Order</Label>
              <Input id="stage-order" type="number" value={stageOrder} onChange={(e) => setStageOrder(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stage-color">Color (hex or name, optional)</Label>
              <Input id="stage-color" placeholder="#2563eb" value={stageColor} onChange={(e) => setStageColor(e.target.value)} />
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
