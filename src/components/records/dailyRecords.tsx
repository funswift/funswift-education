"use client";

import { DailyRecord } from "@/types/dailyRecord";

type Props = {
  record: DailyRecord; // localStorage から読み込んだ1日分
  date: string; // "2025-11-21" などの日付
};

export default function DailyRow({ record, date }: Props) {
  return (
    <div className="border rounded-2xl p-5 shadow-md bg-white flex flex-col space-y-3">
      {/* 日付 */}
      <div className="text-lg font-semibold text-gray-700">{date}</div>

      {/* 寝た時間 */}
      <div className="text-gray-600">
        <span className="font-medium">寝た時間：</span>
        {record.bedTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* 起きた時間 */}
      <div className="text-gray-600">
        <span className="font-medium">起きた時間：</span>
        {record.wakeUpTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* 勉強時間 */}
      <div className="text-gray-600">
        <span className="font-medium">勉強時間：</span>
        {record.studyTime.as("minutes")}分
      </div>

      {/* メディア */}
      <div className="text-gray-600">
        <span className="font-medium">メディア時間：</span>
        {record.mediaTime.as("minutes")}分
      </div>

      {/* チェックボックス項目（◯ / ×） */}
      <div className="grid grid-cols-2 gap-2 text-gray-700 pt-2">
        <div>運動：{record.exercise ? "◯" : "×"}</div>
        <div>読書：{record.reading ? "◯" : "×"}</div>
        <div>朝食：{record.breakfast ? "◯" : "×"}</div>
        <div>お手伝い：{record.assistance ? "◯" : "×"}</div>
      </div>
    </div>
  );
}
