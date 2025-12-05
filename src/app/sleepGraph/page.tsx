"use client";

import SleepChart from "@/app/components/sleepGraph/chart";
import StudyMediaChart from "@/components/linegraph/linegraph";
import { DateTime, Duration } from "luxon";
import { DailyRecord } from "@/types/dailyRecord";

import React, { useState, useEffect } from "react"; 
import { loadLast14Days } from "@/app/records/recordStorage";
import { ChartData } from "chart.js";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type StoredGoal = {
  bedTimeGoal: string | null;
  wakeUpTimeGoal: string | null;
  studyTimeGoalMinutes?: number;
  mediaTimeGoalMinutes?: number;
  exerciseGoalMinutes?: number;
  readingGoalMinutes?: number;
};

type ChartInput = {
  bedTime: string;
  wakeUpTime: string;
};

export default function SleepPage() {
  const router = useRouter(); 
  const [chartData, setChartData] = useState<ChartInput[]>([]);
  const [goal, setGoal] = useState<StoredGoal | null>(null);
  const [lineData, setLineData] = useState<ChartData<"line"> | null>(null);

  // ---- ① 睡眠記録を読み込む ----
  useEffect(() => {
  const list = loadLast14Days();  // ← これは { date, record }[]

  const converted: ChartInput[] = list
    .filter(item => item.record !== null)  // null レコードは除外
    .map((item) => {
      const rec = item.record!;
      return {
        bedTime: rec.bedTime!.toISOString(),
        wakeUpTime: rec.wakeUpTime!.toISOString(),
      };
    });

  setChartData(converted.reverse());
}, []);


useEffect(() => {
  const list = loadLast14Days();
  const valid = list.filter(item => item.record !== null);
  if (valid.length === 0) return;

  const labels: string[] = [];
  const studyTimes: number[] = [];
  const mediaTimes: number[] = [];

  valid.forEach(({ record, date }) => {
    const rec = record!;
    const d = rec.bedTime!;
    const label = `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;

    labels.push(label);
    studyTimes.push(rec.studyTime!.as("minutes"));
    mediaTimes.push(rec.mediaTime!.as("minutes"));
  });

  setLineData({
    labels: labels.reverse(),
    datasets: [
      {
        label: "勉強時間（分）",
        data: studyTimes.reverse(),
        borderColor: "#90C0FF",
        backgroundColor: "rgba(144, 192, 255, 0.2)",
        fill: false,
        tension: 0.2,
      },
      {
        label: "メディア時間（分）",
        data: mediaTimes.reverse(),
        borderColor: "#FA8072",
        backgroundColor: "rgba(250, 128, 114, 0.2)",
        fill: false,
        tension: 0.2,
      },
    ],
  });
}, []);

  // ---- ② 目標を localStorage から読み込む（これが欠けていた）----
  useEffect(() => {
    try {
      const raw = localStorage.getItem("goal");
      if (raw) {
        const parsed = JSON.parse(raw) as StoredGoal;
        setGoal(parsed);
      }
    } catch (e) {
      console.error("Failed to load goal", e);
    }
  }, []);

  // ---- ③ SleepChart に渡す JSON 用データへ変換 ----
  const jsonGoal = goal
    ? {
        bedTimeGoal: goal.bedTimeGoal,
        wakeUpTimeGoal: goal.wakeUpTimeGoal,
      }
    : null; // 目標が未設定の場合は null

 // ---- ④ SleepChart + StudyMediaChart を表示 ----
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col">

      {/* ----------------------- */}
      {/* 🌟 ホームと同じヘッダー */}
      {/* ----------------------- */}
      <header className="w-full bg-[var(--lightBlue)] p-4 flex items-center justify-between">
        {/* 左（アイコン＋名前） */}
        <div className="flex items-center space-x-3">
          <Image
            src="/kotori-icon.png"
            alt="コトリ"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              函館　花子
            </h1>
            <span className="text-sm text-white">ノートの魔法使い ✨</span>
          </div>
        </div>

        {/* 右（ボタン） */}
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => router.push("/")}>
            ホームに戻る
          </Button>
          <Button variant="outline">設定</Button>
        </div>
      </header>

      {/* ----------------------- */}
      {/* 🌟 グラフを中央寄せで表示 */}
      {/* ----------------------- */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full justify-center items-center">

          {/* 睡眠グラフ */}
          <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow min-w-0 ">
            <SleepChart data={chartData} goal={jsonGoal} />
          </div>

          {/* 勉強・メディア折れ線グラフ */}
          <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow min-w-0">
            {lineData ? (
              <StudyMediaChart data={lineData} />
            ) : (
              <p>Loading...</p>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
