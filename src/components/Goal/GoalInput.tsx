"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Duration } from "luxon";

// Helpers
function parseTimeToDate(time: string): Date | null {
  if (!time) return null;
  const [hhStr, mmStr] = time.split(":");
  const hh = Number(hhStr || 0);
  const mm = Number(mmStr || 0);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
  // support either "HH:mm" or plain minutes string
  if (time.includes(":")) {
    const [hhStr, mmStr] = time.split(":");
    const hh = Number(hhStr || 0);
    const mm = Number(mmStr || 0);
    return hh * 60 + mm;
  }
  const asNum = Number(time);
  return Number.isFinite(asNum) ? Math.max(0, Math.floor(asNum)) : 0;
}

export default function GoalInput() {
  // 4つの目標時刻を管理する配列
  const [times, setTimes] = useState<string[]>(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    setTimes(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 360, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>目標時刻を入力</h2>

          {(() => {
            const labels = ["寝る時間", "起きる時間", "メディア時間", "勉強時間"];
            // preset slots in minutes for duration selects (1-minute increments)
            // maxMinutes chosen as 240 (4 hours) — change if you want a different max
            const maxMinutes = 240;
            const durationSlots = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

            return times.map((t, i) => {
              const isDuration = i === 2 || i === 3; // メディア時間・勉強時間 はスロット選択
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <label htmlFor={`time-input-${i}`} style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                    {labels[i]}
                  </label>
                  {isDuration ? (
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        id={`time-input-${i}`}
                        value={t}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange(i, e.target.value)}
                        style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}
                      >
                        <option value="">選択してください</option>
                        {durationSlots.map((m) => (
                          <option key={m} value={String(m)}>{m} 分</option>
                        ))}
                      </select>
                      <div style={{ alignSelf: "center", color: "#666" }}>分</div>
                    </div>
                  ) : (
                    <input
                      id={`time-input-${i}`}
                      type="time"
                      value={t}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
                      style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  )}
                </div>
              );
            });
          })()}

        <div style={{ marginTop: 12, color: "#333" }}>
          <strong>選択:</strong>
            <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
              {(() => {
                const labels = ["寝る時間", "起きる時間", "メディア時間", "勉強時間"];
                return times.map((t, i) => {
                  const isDuration = i === 2 || i === 3;
                  const display = t ? (isDuration ? `${t}分` : t) : "未選択";
                  return <li key={i} style={{ listStyle: "decimal" }}>{`${labels[i]}: ${display}`}</li>;
                });
              })()}
            </ul>

          {/* 完了ボタンをボックス内に配置 */}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link
              href="/"
              onClick={() => {
                // build typed Goal-like object (Date and luxon.Duration in memory)
                const bed = parseTimeToDate(times[0]);
                const wake = parseTimeToDate(times[1]);
                const mediaMin = parseTimeToMinutes(times[2]);
                const studyMin = parseTimeToMinutes(times[3]);

                const studyDuration = Duration.fromObject({ minutes: studyMin });
                const mediaDuration = Duration.fromObject({ minutes: mediaMin });
                const zeroDuration = Duration.fromObject({ minutes: 0 });

                const typedGoal = {
                  bedTimeGoal: bed,
                  wakeUpTimeGoal: wake,
                  studyTimeGoal: studyDuration,
                  mediaTimeGoal: mediaDuration,
                  exerciseGoal: zeroDuration,
                  readingGoal: zeroDuration,
                  weekendBedTimeGoal: bed,
                  weekendWakeUpTimeGoal: wake,
                  weekendStudyTimeGoal: studyDuration,
                  weekendMediaTimeGoal: mediaDuration,
                  weekendExerciseGoal: zeroDuration,
                  weekendReadingGoal: zeroDuration,
                };

                // Create a serializable form for localStorage (Date -> ISO, Duration -> minutes)
                const serializable = {
                  bedTimeGoal: bed ? bed.toISOString() : null,
                  wakeUpTimeGoal: wake ? wake.toISOString() : null,
                  studyTimeGoalMinutes: studyMin,
                  mediaTimeGoalMinutes: mediaMin,
                  exerciseGoalMinutes: 0,
                  readingGoalMinutes: 0,
                  weekendBedTimeGoal: bed ? bed.toISOString() : null,
                  weekendWakeUpTimeGoal: wake ? wake.toISOString() : null,
                  weekendStudyTimeGoalMinutes: studyMin,
                  weekendMediaTimeGoalMinutes: mediaMin,
                  weekendExerciseGoalMinutes: 0,
                  weekendReadingGoalMinutes: 0,
                };

                try {
                  localStorage.setItem("goal", JSON.stringify(serializable));
                  console.log("Typed goal (in-memory):", typedGoal);
                  console.log("Saved goal to localStorage:", serializable);
                } catch (e) {
                  console.error("Failed to save goal to localStorage", e);
                }
              }}
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                backgroundColor: "#0070f3",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              完了
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
