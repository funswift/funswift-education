"use client";

import { calcSleepDuration } from "@/utils/calcSleepDuration";
import { DailyRecord } from "@/types/dailyRecord";

export default function DailyRow({
  date,
  record,
}: {
  date: string;
  record: DailyRecord | null;
}) {
  if (!record) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div>{date}</div>
        <div>睡眠時間：-</div>
        <div>運動：-</div>
        <div>読書：-</div>
        <div>朝食：-</div>
        <div>お手伝い：-</div>
      </div>
    );
  }

  const sleep = calcSleepDuration(record.bedTime, record.wakeUpTime);

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div>{date}</div>
      <div>睡眠時間：{sleep}</div>
      <div>運動：{record.exercise ? "◯" : "-"}</div>
      <div>読書：{record.reading ? "◯" : "-"}</div>
      <div>朝食：{record.breakfast ? "◯" : "-"}</div>
      <div>お手伝い：{record.assistance ? "◯" : "-"}</div>
    </div>
  );
}
