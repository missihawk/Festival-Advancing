"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  value?: string | null;            // ISO string of null
  onChange: (iso: string | null) => void;
};

export default function DateTimeField({ value, onChange }: Props) {
  const initial = value ? new Date(value) : null;

  const [date, setDate] = useState<Date | null>(initial);
  const [time, setTime] = useState<string>(() => {
    if (!initial) return "";
    const hh = String(initial.getHours()).padStart(2, "0");
    const mm = String(initial.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  // combineer date + time -> ISO
  useEffect(() => {
    if (!date || !time) { onChange(null); return; }
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh ?? 0, mm ?? 0, 0, 0);
    onChange(d.toISOString());
  }, [date, time, onChange]);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            {date ? format(date, "dd-MM-yyyy", { locale: nl }) : "Kies datum"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={(d) => setDate(d ?? null)}
            weekStartsOn={1}
            locale={nl}
          />
        </PopoverContent>
      </Popover>

      <div className="w-24">
        <Input
          type="time"
          step={60}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
    </div>
  );
}
