"use client";

import React, { useState } from "react";

import Link from "next/link";

function First() {
  return (
    <div>
      <h1>First</h1>
      <Link href={"/second"}>目標を入力する</Link>
    </div>
  );
}

export default First;
