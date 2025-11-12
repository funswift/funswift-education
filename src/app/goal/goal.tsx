"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function First() {
  const [time, setTime] = useState("");

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 320, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      
       

       
        <div style={{ marginTop: 12 }}>
          <Link href="/second">目標を入力する</Link>
        </div>
      </div>
    </div>
  );
}
