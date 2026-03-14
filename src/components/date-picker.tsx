"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function getMonthMeta(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  return {
    year,
    month,
    daysInMonth: last.getDate(),
    startDay: first.getDay(),
  };
}

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState(() => {
    return value ? new Date(value) : new Date();
  });

  const meta = useMemo(() => getMonthMeta(cursor), [cursor]);

  const days = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < meta.startDay; i += 1) cells.push(null);
    for (let i = 1; i <= meta.daysInMonth; i += 1) cells.push(i);
    return cells;
  }, [meta]);

  const selectDate = (day: number) => {
    const selected = new Date(meta.year, meta.month, day);
    onChange(formatDate(selected));
    setOpen(false);
  };

  const label = value ? value : placeholder ?? "Select date";

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="calendar-trigger w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-left text-base text-foreground shadow-sm transition hover:border-primary/60"
      >
        {label}
      </button>
      {open && (
        <div className="calendar-popover glass-card absolute left-0 top-[calc(100%+10px)] z-50 w-[280px] rounded-3xl p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.7)]">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(meta.year, meta.month - 1, 1))
              }
              className="calendar-nav inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold">
              {cursor.toLocaleString("en-US", { month: "long" })} {meta.year}
            </div>
            <button
              type="button"
              onClick={() =>
                setCursor(new Date(meta.year, meta.month + 1, 1))
              }
              className="calendar-nav inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-muted-foreground">
            {weekdays.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              const dayValue = formatDate(
                new Date(meta.year, meta.month, day)
              );
              const isSelected = value === dayValue;
              return (
                <button
                  key={dayValue}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`calendar-day rounded-lg py-2 text-center transition ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/60"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(formatDate(new Date()));
                setOpen(false);
              }}
              className="font-semibold text-primary"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
