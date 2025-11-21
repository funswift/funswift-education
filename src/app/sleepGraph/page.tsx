"use client";

import SleepChart from "@/app/components/sleepGraph/chart";
import { DateTime, Duration } from "luxon";
import { DailyRecord } from "@/types/dailyRecord";
import { Goal } from "@/types/goal";
import React, { useState, useEffect } from "react"; 
import { loadLast14DaysRecords } from "@/app/records/recordStorage";

export default function SleepPage() {
  const [chartData, setChartData] = useState<ChartInput[]>([]);

  // マウント後に localStorage から14日分を読み込む
  useEffect(() => {
    const records = loadLast14DaysRecords();
    const converted: ChartInput[] = records.map((r) => ({
      bedTime: r.bedTime.toISOString(),
      wakeUpTime: r.wakeUpTime.toISOString(),
    }));
    setChartData(converted.reverse());
  }, []);

  // ② 目標（goal）
  const goal: Goal = {
    bedTimeGoal: new Date("2024-01-01T22:30:00"),
    wakeUpTimeGoal: new Date("2024-01-02T07:00:00"),
    studyTimeGoal: Duration.fromObject({ minutes: 60 }),
    mediaTimeGoal: Duration.fromObject({ minutes: 30 }),
    exerciseGoal: Duration.fromObject({ minutes: 20 }),
    readingGoal: Duration.fromObject({ minutes: 20 }),

    weekendBedTimeGoal: new Date("2024-01-01T22:30:00"),
    weekendWakeUpTimeGoal: new Date("2024-01-02T08:00:00"),
    weekendStudyTimeGoal: Duration.fromObject({ minutes: 30 }),
    weekendMediaTimeGoal: Duration.fromObject({ minutes: 60 }),
    weekendExerciseGoal: Duration.fromObject({ minutes: 15 }),
    weekendReadingGoal: Duration.fromObject({ minutes: 10 }),
  };

  // ③ ここで JSON 向けに変換（records → jsonRecords）
  // const jsonRecords = records.map((r) => ({
  //   bedTime: r.bedTime.toISOString(),
  //   wakeUpTime: r.wakeUpTime.toISOString(),
  //   studyMinutes: r.studyTime.as("minutes"),
  //   mediaMinutes: r.mediaTime.as("minutes"),
  //   exercise: r.exercise,
  //   reading: r.reading,
  //   breakfast: r.breakfast,
  //   assistance: r.assistance,
  // }));

  const jsonGoal = {
    bedTimeGoal: goal.bedTimeGoal.toISOString(),
    wakeUpTimeGoal: goal.wakeUpTimeGoal.toISOString(),
    studyMinutesGoal: goal.studyTimeGoal.as("minutes"),
    mediaMinutesGoal: goal.mediaTimeGoal.as("minutes"),
    exerciseGoal: goal.exerciseGoal.as("minutes"),
    readingGoal: goal.readingGoal.as("minutes"),
  };

  // ④ 描画
  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--background)]">
      <SleepChart data={chartData} goal={jsonGoal} />
    </main>
  );
}
