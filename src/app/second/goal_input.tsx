"use client";

import React, { useState } from "react";

export default function GoalInput() {
  // 目標時間入力
  const [time, setTime] = useState("00:00");

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 320, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <label htmlFor="time-input" style={{ display: "block", marginBottom: ".5rem", fontWeight: 600 }}>
          時刻を入力
        </label>
        <input
          id="time-input"
          type="time"
          value={time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
          style={{ width: "100%", padding: ".5rem .75rem", fontSize: "1rem", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <p style={{ marginTop: ".75rem", color: "#333" }}>選択: {time || "未選択"}</p>
      </div>
    </div>
  );
}
