"use client";

import { calcSleepDuration } from "@/utils/calcSleepDuration";
import { DailyRecord } from "@/types/dailyRecord";
import { Duration } from "luxon";

type Props = {
  date: string; // YYYY-MM-DD
  record: DailyRecord | null;
};

function formatDuration(d: Duration | null) {
  if (!d) return "-";
  const totalMinutes = Math.max(0, Math.floor(d.as("minutes") || 0));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0) return `${h}h${m}m`;
  return `${m}m`;
}

export default function DailyRow({ date, record }: Props) {
  // 日付表示（例: 2025-01-03 -> 3日）
  const dayNum = (() => {
    try {
      const d = new Date(date);
      return d.getDate();
    } catch {
      return date.slice(-2).replace(/^0/, "");
    }
  })();

  const media = record?.mediaTime ? formatDuration(record.mediaTime) : "-";
  const study = record?.studyTime ? formatDuration(record.studyTime) : "-";
  const sleep = calcSleepDuration(
    record?.bedTime ?? null,
    record?.wakeUpTime ?? null
  );
  const breakfast = record?.breakfast ? "◯" : "✕";
  const assistance = record?.assistance ? "◯" : "✕";
  const reading = record?.reading ? "◯" : "✕";
  const exercise = record?.exercise ? "◯" : "✕";

  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm">
      {/* 左側：日付 */}
      <div className="text-2xl font-semibold text-gray-800 w-16">
        {dayNum}日
      </div>

      {/* 中央：項目一覧 */}
      <div className="flex gap-8 flex-1 text-gray-700 text-center">
        <div>
          <div className="text-sm">メディア</div>
          <div className="font-semibold">{media}</div>
        </div>

        <div>
          <div className="text-sm">勉強</div>
          <div className="font-semibold">{study}</div>
        </div>

        <div>
          <div className="text-sm">睡眠</div>
          <div className="font-semibold">{sleep}</div>
        </div>

        <div>
          <div className="text-sm">朝ご飯</div>
          <div className="font-semibold">{record ? breakfast : "-"}</div>
        </div>

        <div>
          <div className="text-sm">お手伝い</div>
          <div className="font-semibold">{record ? assistance : "-"}</div>
        </div>

        <div>
          <div className="text-sm">読書</div>
          <div className="font-semibold">{record ? reading : "-"}</div>
        </div>

        <div>
          <div className="text-sm">運動</div>
          <div className="font-semibold">{record ? exercise : "-"}</div>
        </div>
      </div>

      {/* 右側：入力リンク */}
      <button className="text-[var(--darkBlue)] font-semibold hover:underline ml-4">
        入力
      </button>
    </div>
  );
}
