"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function First() {
  const [time, setTime] = useState("");

  return (
    <div style={{   position: "absolute", top: "1rem",right: "1rem",minHeight: "60vh", padding: "2rem" }}>
      <div style={{ width: 320, border: "2px solid #ccc", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ marginTop: 12, textAlign: "right" }}>
        
        </div>
      </div>
    </div>
  );
}


