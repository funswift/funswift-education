"use client";

import React, { useEffect, useState } from "react";

type Props = {
  value: string; // "HH:MM" or ""
  onChange: (v: string) => void;
  step?: number; // minute step
  ariaLabel?: string;
};

export default function TimePicker({
  value,
  onChange,
  step = 1,
  ariaLabel,
}: Props) {
  const parse = (v: string) => {
    if (!v) return { h: "", m: "" };
    const [hh, mm] = v.split(":");
    return { h: hh ?? "", m: mm ?? "" };
  };

  const [hour, setHour] = useState<string>(parse(value).h);
  const [minute, setMinute] = useState<string>(parse(value).m);

  useEffect(() => {
    const p = parse(value);
    setHour(p.h);
    setMinute(p.m);
  }, [value]);

  useEffect(() => {
    if (hour === "" && minute === "") {
      onChange("");
      return;
    }
    if (hour !== "" && minute !== "") {
      const hh = hour.padStart(2, "0");
      const mm = minute.padStart(2, "0");
      onChange(`${hh}:${mm}`);
    }
  }, [hour, minute]);

  const hourOptions = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minuteOptions = Array.from({ length: Math.ceil(60 / step) }, (_, i) =>
    String((i * step) % 60).padStart(2, "0")
  );

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label={ariaLabel ?? "hour"}
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">--</option>
        {hourOptions.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>

      <span className="text-sm">:</span>

      <select
        aria-label={ariaLabel ?? "minute"}
        value={minute}
        onChange={(e) => setMinute(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="">--</option>
        {minuteOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
