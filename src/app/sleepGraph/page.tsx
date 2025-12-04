"use client";

import SleepChart from "@/app/components/sleepGraph/chart";
import StudyMediaChart from "@/components/linegraph/linegraph";
import { DateTime, Duration } from "luxon";
import { DailyRecord } from "@/types/dailyRecord";

import React, { useState, useEffect } from "react"; 
import { loadLast14DaysRecords } from "@/app/records/recordStorage";
import { ChartData } from "chart.js";

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
  const [lineData, setLineData] = useState<ChartData<"line"> | null>(null);

  // ---- ① 睡眠記録を読み込む ----
  useEffect(() => {
    const records = loadLast14DaysRecords();
    const converted: ChartInput[] = records.map((r) => ({
      bedTime: r.bedTime.toISOString(),
      wakeUpTime: r.wakeUpTime.toISOString(),
    }));
    setChartData(converted.reverse());
  }, []);

// ---- ② 14日分の勉強・メディアデータ（折れ線グラフ用）----
  useEffect(() => {
    const records = loadLast14DaysRecords();

    if (records.length === 0) return;

    const labels: string[] = [];
    const studyTimes: number[] = [];
    const mediaTimes: number[] = [];

    records.forEach((record) => {
      const d = record.bedTime;
      const label = `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
      labels.push(label);
      studyTimes.push(record.studyTime.as("minutes"));
      mediaTimes.push(record.mediaTime.as("minutes"));
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
    <main className="min-h-screen bg-[var(--background)] p-6">
      <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
        {/* 左：睡眠グラフ */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow">
          <SleepChart data={chartData} goal={goal} />
        </div>

        {/* 右：勉強・メディア折れ線グラフ */}
        <div className="w-full md:w-1/2 bg-white p-4 rounded-xl shadow">
          {lineData ? <StudyMediaChart data={lineData} /> : <p>Loading...</p>}
        </div>
      </div>
    </main>
  );
}
