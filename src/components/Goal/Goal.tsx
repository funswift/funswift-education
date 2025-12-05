"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    // fixed widget at top-right
    <div
      style={{
        width: 1000,
        maxWidth: "min(95vw, 1100px)",
        border: "2px solid #ccc",
        borderRadius: 12,
        padding: "5px 15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 13, margin: 0, marginBottom: 6 }}>目標時間</h1>
          {stored ? (
            <div style={{ color: "#333", fontSize: 14 }}>
              {/* 平日の行 */}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>寝る時間</div>
                  <div style={{ color: "#444" }}>
                    {formatISOToHM(stored.bedTimeGoal)}
                  </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>
                    起きる時間
                  </div>
                  <div style={{ color: "#444" }}>
                    {formatISOToHM(stored.wakeUpTimeGoal)}
                  </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>
                    メディア時間
                  </div>
                  <div style={{ color: "#444" }}>
                    {stored.mediaTimeGoalMinutes ?? "未設定"} 分
                  </div>
                </div>
                <div style={{ minWidth: 160 }}>
                  <div style={{ fontWeight: 600, fontSize: 11 }}>
                    勉強した時間
                  </div>
                  <div style={{ color: "#444" }}>
                    {stored.studyTimeGoalMinutes ?? "未設定"} 分
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "#777", fontSize: 15 }}>
              目標がまだ保存されていません
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 12,
            flexShrink: 0,
          }}
        >
          {/* Use project Button component and navigate on click */}
          <GoalButton />
        </div>
      </div>
    </div>
  );
}

function GoalButton() {
  const router = useRouter();
  return <Button onClick={() => router.push("/second")}>目標を入力する</Button>;
}
