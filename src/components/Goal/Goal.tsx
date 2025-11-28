"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type StoredGoal = {
  bedTimeGoal: string | null;
  wakeUpTimeGoal: string | null;
  studyTimeGoalMinutes?: number;
  mediaTimeGoalMinutes?: number;
  exerciseGoalMinutes?: number;
  readingGoalMinutes?: number;
};

function formatISOToHM(iso: string | null) {
  if (!iso) return "未選択";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "未選択";
  }
}

export default function Goal() {
  const [stored, setStored] = useState<StoredGoal | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("goal");
      if (!raw) {
        setStored(null);
        return;
      }
      const obj = JSON.parse(raw) as StoredGoal;
      setStored(obj);
    } catch (e) {
      console.error("Failed to read goal from localStorage", e);
      setStored(null);
    }
  }, []);

  return (
    <div
      style={{
        width: 520,
        border: "2px solid #ccc",
        borderRadius: 12,
        padding: "1.25rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>保存済みの目標</h3>
          {stored ? (
            <div style={{ color: "#333" }}>
              <div>寝る時間: {formatISOToHM(stored.bedTimeGoal)}</div>
              <div>起きる時間: {formatISOToHM(stored.wakeUpTimeGoal)}</div>
              <div>
                メディア時間: {stored.mediaTimeGoalMinutes ?? "未設定"} 分
              </div>
              <div>勉強時間: {stored.studyTimeGoalMinutes ?? "未設定"} 分</div>
            </div>
          ) : (
            <div style={{ color: "#777" }}>目標がまだ保存されていません</div>
          )}
        </div>

        <div style={{ minWidth: 180, textAlign: "right" }}>
          <Link
            href="/second"
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
            目標を入力する
          </Link>
        </div>
      </div>
    </div>
  );
}
