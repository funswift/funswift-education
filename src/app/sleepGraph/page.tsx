"use client";

import SleepChart from "@/app/components/sleepGraph/chart";
import { DateTime, Duration } from "luxon";
import { DailyRecord } from "@/types/dailyRecord";
import { Goal } from "@/types/goal";
import React, { useState, useEffect } from "react"; 
import { loadLast14DaysRecords } from "@/app/records/recordStorage";

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
  const [chartData, setChartData] = useState<ChartInput[]>([]);
  const [goal, setGoal] = useState<StoredGoal | null>(null);

  // ---- ① 睡眠記録を読み込む ----
  useEffect(() => {
    const records = loadLast14DaysRecords();
    const converted: ChartInput[] = records.map((r) => ({
      bedTime: r.bedTime.toISOString(),
      wakeUpTime: r.wakeUpTime.toISOString(),
    }));
    setChartData(converted.reverse());
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

  // ---- ④ 描画 ----
  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--background)]">
      <SleepChart data={chartData} goal={jsonGoal} />
    </main>
  );
}
