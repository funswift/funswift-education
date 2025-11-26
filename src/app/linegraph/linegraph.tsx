"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  ChartData,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function StudyMediaChart({ data }: { data: ChartData<"line"> }) {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}> 
      <Line data={data} />
    </div>
  );
}
