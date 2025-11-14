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
  const [hhStr, mmStr] = time.split(":");
  const hh = Number(hhStr || 0);
  const mm = Number(mmStr || 0);
  return hh * 60 + mm;
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
            return times.map((t, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <label htmlFor={`time-input-${i}`} style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  {labels[i]}
                </label>
                <input
                  id={`time-input-${i}`}
                  type="time"
                  value={t}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
                  style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}
                />
              </div>
            ));
          })()}

        <div style={{ marginTop: 12, color: "#333" }}>
          <strong>選択:</strong>
            <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
              {(() => {
                const labels = ["寝る時間", "起きる時間", "メディア時間", "勉強時間"];
                return times.map((t, i) => (
                  <li key={i} style={{ listStyle: "decimal" }}>{`${labels[i]}: ${t || "未選択"}`}</li>
                ));
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

                // Only persist the four requested fields to localStorage:
                // bedTimeGoal (ISO string), wakeUpTimeGoal (ISO string),
                // mediaTimeGoalMinutes (number), studyTimeGoalMinutes (number)
                const minimal = {
                  bedTimeGoal: bed ? bed.toISOString() : null,
                  wakeUpTimeGoal: wake ? wake.toISOString() : null,
                  mediaTimeGoalMinutes: mediaMin,
                  studyTimeGoalMinutes: studyMin,
                };

                try {
                  localStorage.setItem("goal", JSON.stringify(minimal));
                  console.log("Saved minimal goal to localStorage:", minimal);
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
