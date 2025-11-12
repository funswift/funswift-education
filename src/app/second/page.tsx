"use client";

import React from "react";
import Link from "next/link";
import GoalInput from "./goal_input";

export default function Second() {
  return (
    <div>
      {/* 戻るボタン */}
  <h1>Second</h1>
  <GoalInput />
      <Link href="/">完了</Link>

    
    </div>
  );

  
}


