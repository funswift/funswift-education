"use client";

import { useEffect, useState } from "react";
import { loadLast14Days } from "@/app/records/recordStorage";
import DailyRow from "@/components/records/dailyRecords";
import { DailyRecord } from "@/types/dailyRecord";

type RecordWithDate = {
  date: string;
  record: DailyRecord | null;
};

export default function DailyList() {
  const [days, setDays] = useState<RecordWithDate[]>([]);

  useEffect(() => {
    // recordStorage.ts から 14 日分をロード
    const data = loadLast14Days();
    // 左上に「日付で一番若い（= 古い日付）」が来るように昇順にソートしてからセット
    const sorted = data.slice().sort((a, b) => a.date.localeCompare(b.date));
    setDays(sorted);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {days.map((item, index) => (
        <DailyRow key={index} date={item.date} record={item.record} />
      ))}
    </div>
  );
}
