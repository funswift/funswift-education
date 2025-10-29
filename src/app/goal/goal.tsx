"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function First() {
  const [time, setTime] = useState("");

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 320, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      
       

       
        <div style={{ marginTop: 12, textAlign: "right" }}>
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
              }}>目標を入力する
              </Link>
        </div>
      </div>
    </div>
  );
}


