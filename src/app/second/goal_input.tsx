"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function parseTimeToDateISO(time: string): string | null {
  if (!time) return null;
  const [hhStr, mmStr] = time.split(":");
  const hh = Number(hhStr || 0);
  const mm = Number(mmStr || 0);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

function parseTimeToMinutes(time: string): number {
  if (!time) return 0;
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
  // 平日と週末それぞれの4つの目標を管理する配列
  const [weekday, setWeekday] = useState<string[]>(["", "", "", ""]);
  const [weekend, setWeekend] = useState<string[]>(["", "", "", ""]);

  const handleChange = (which: "weekday" | "weekend", index: number, value: string) => {
    if (which === "weekday") {
      setWeekday(prev => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    } else {
      setWeekend(prev => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    }
  };

  const router = useRouter();

  const handleComplete = () => {
    const bedISO = parseTimeToDateISO(weekday[0]);
    const wakeISO = parseTimeToDateISO(weekday[1]);
    const mediaMin = parseTimeToMinutes(weekday[2]);
    const studyMin = parseTimeToMinutes(weekday[3]);

    const wBedISO = parseTimeToDateISO(weekend[0]);
    const wWakeISO = parseTimeToDateISO(weekend[1]);
    const wMediaMin = parseTimeToMinutes(weekend[2]);
    const wStudyMin = parseTimeToMinutes(weekend[3]);

    const payload = {
      bedTimeGoal: bedISO,
      wakeUpTimeGoal: wakeISO,
      mediaTimeGoalMinutes: mediaMin,
      studyTimeGoalMinutes: studyMin,
      weekendBedTimeGoal: wBedISO,
      weekendWakeUpTimeGoal: wWakeISO,
      weekendMediaTimeGoalMinutes: wMediaMin,
      weekendStudyTimeGoalMinutes: wStudyMin,
    };

    try {
      localStorage.setItem("goal", JSON.stringify(payload));
      console.log("Saved goal:", payload);
    } catch (e) {
      console.error("Failed to save goal to localStorage", e);
    }

    router.push("/");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 600, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0, marginBottom: 12 }}>目標時刻を入力</h2>

        {/* 平日 / 週末 並列表示 */}
        {(() => {
          const labels = ["寝る時間", "起きる時間", "メディア時間", "勉強時間"];
          const maxMinutes = 240; // 1分刻みで 0..240 を選べる
          const slots = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

          return (
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginTop: 0 }}>平日</h3>
                {weekday.map((t, i) => {
                  const isDuration = i === 2 || i === 3;
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <label htmlFor={`weekday-input-${i}`} style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{labels[i]}</label>
                      {isDuration ? (
                        <select id={`weekday-input-${i}`} value={t} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("weekday", i, e.target.value)} style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}>
                          <option value="">選択してください</option>
                          {slots.map((m) => (
                            <option key={m} value={String(m)}>{m} 分</option>
                          ))}
                        </select>
                      ) : (
                        <input id={`weekday-input-${i}`} type="time" value={t} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("weekday", i, e.target.value)} style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ marginTop: 0 }}>週末 / 祝日</h3>
                {weekend.map((t, i) => {
                  const isDuration = i === 2 || i === 3;
                  return (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <label htmlFor={`weekend-input-${i}`} style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>{labels[i]}</label>
                      {isDuration ? (
                        <select id={`weekend-input-${i}`} value={t} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange("weekend", i, e.target.value)} style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}>
                          <option value="">選択してください</option>
                          {slots.map((m) => (
                            <option key={m} value={String(m)}>{m} 分</option>
                          ))}
                        </select>
                      ) : (
                        <input id={`weekend-input-${i}`} type="time" value={t} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("weekend", i, e.target.value)} style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        <div style={{ marginTop: 12, color: "#333" }}>
          <strong>選択:</strong>
          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>平日</div>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                {weekday.map((t, i) => <li key={i} style={{ listStyle: "decimal" }}>{`${i === 2 || i === 3 ? `${t || "未選択"} 分` : `${t || "未選択"}`}`}</li>)}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>週末 / 祝日</div>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                {weekend.map((t, i) => <li key={i} style={{ listStyle: "decimal" }}>{`${i === 2 || i === 3 ? `${t || "未選択"} 分` : `${t || "未選択"}`}`}</li>)}
              </ul>
            </div>
          </div>

          {/* 完了ボタンをボックス内に配置 */}
          <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleComplete}>完了</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
