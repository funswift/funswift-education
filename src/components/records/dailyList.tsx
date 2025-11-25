"use client";

import { useEffect, useState } from "react";
import { loadLast14DaysRecords } from "@/app/records/recordStorage";
import DailyRow from "@/components/records/dailyRecords";
import { DailyRecord } from "@/types/dailyRecord";

// 日付も保存するための型
type RecordWithDate = {
  date: string;
  record: DailyRecord;
};

export default function DailyList() {
  const [records, setRecords] = useState<RecordWithDate[]>([]);

  useEffect(() => {
    const today = new Date();
    const loaded: RecordWithDate[] = [];

    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const raw = loadLast14DaysRecords().find(
        (r) => r.bedTime.toISOString().slice(0, 10) === dateStr
      );

      if (raw) {
        loaded.push({ date: dateStr, record: raw });
      }
    }

    setRecords(loaded);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {records.map((item, idx) => (
        <DailyRow key={idx} date={item.date} record={item.record} />
      ))}
    </div>
  );
}
