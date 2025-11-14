"use client";

import React, { useState } from "react";
import Link from "next/link";

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

        {times.map((t, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <label htmlFor={`time-input-${i}`} style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              時刻 {i + 1}
            </label>
            <input
              id={`time-input-${i}`}
              type="time"
              value={t}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(i, e.target.value)}
              style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}
            />
          </div>
        ))}

        <div style={{ marginTop: 12, color: "#333" }}>
          <strong>選択:</strong>
          <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
            {times.map((t, i) => (
              <li key={i} style={{ listStyle: "decimal" }}>{`時刻 ${i + 1}: ${t || "未選択"}`}</li>
            ))}
          </ul>

          {/* 完了ボタンをボックス内に配置 */}
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <Link
              href="/"
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
