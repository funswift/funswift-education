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
  // weekend fields
  weekendBedTimeGoal?: string | null;
  weekendWakeUpTimeGoal?: string | null;
  weekendStudyTimeGoalMinutes?: number;
  weekendMediaTimeGoalMinutes?: number;
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
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000 }}>
      <div style={{ width: 900, maxWidth: "min(95vw, 1100px)", border: "2px solid #ccc", borderRadius: 12, padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, marginBottom: 6 }}>目標時間</h4>
            {stored ? (
              <div style={{ color: "#333", fontSize: 13 }}>
                {/* 平日の行 */}
                <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>寝る時間</div>
                    <div style={{ color: "#444" }}>{formatISOToHM(stored.bedTimeGoal)}</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>起きる時間</div>
                    <div style={{ color: "#444" }}>{formatISOToHM(stored.wakeUpTimeGoal)}</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>メディア時間</div>
                    <div style={{ color: "#444" }}>{stored.mediaTimeGoalMinutes ?? "未設定"} 分</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>勉強した時間</div>
                    <div style={{ color: "#444" }}>{stored.studyTimeGoalMinutes ?? "未設定"} 分</div>
                  </div>
                </div>

                {/* 週末の行 */}
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>寝る時間（土日祝）</div>
                    <div style={{ color: "#444" }}>{formatISOToHM(stored.weekendBedTimeGoal ?? null)}</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>起きる時間（土日祝）</div>
                    <div style={{ color: "#444" }}>{formatISOToHM(stored.weekendWakeUpTimeGoal ?? null)}</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>メディア時間（土日祝）</div>
                    <div style={{ color: "#444" }}>{stored.weekendMediaTimeGoalMinutes ?? "未設定"} 分</div>
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 600, fontSize: 12 }}>勉強時間（土日祝）</div>
                    <div style={{ color: "#444" }}>{stored.weekendStudyTimeGoalMinutes ?? "未設定"} 分</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ color: "#777", fontSize: 13 }}>目標がまだ保存されていません</div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", marginLeft: 12, flexShrink: 0 }}>
            {/* Use project Button component and navigate on click */}
            <GoalButton />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalButton() {
  const router = useRouter();
  return (
    <Button onClick={() => router.push('/second')}>目標を入力する</Button>
  );
}
