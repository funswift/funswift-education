"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { loadLast14DaysRecords } from "../records/recordStorage";
import { DailyRecord } from "../../types/dailyRecord";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function StudyMediaChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [studyTimes, setStudyTimes] = useState<number[]>([]);
  const [mediaTimes, setMediaTimes] = useState<number[]>([]);

  useEffect(() => {
    // データを取得してグラフ用に整形
    const records = loadLast14DaysRecords();
    const newLabels: string[] = [];
    const newStudyTimes: number[] = [];
    const newMediaTimes: number[] = [];

    records.forEach((record: DailyRecord) => {
      // 日付オブジェクトを変数に入れる
      const d = record.bedTime;
      // 「月/日」の形にする (月は0から始まるので+1する)
      const date = `${d.getMonth() + 1}/${d.getDate()}`;
      newLabels.push(date);
      newStudyTimes.push(record.studyTime.as("minutes")); // 勉強時間を分に変換
      newMediaTimes.push(record.mediaTime.as("minutes")); // メディア時間を分に変換
    });

    setLabels(newLabels.reverse()); // 日付を昇順に並べ替え
    setStudyTimes(newStudyTimes.reverse());
    setMediaTimes(newMediaTimes.reverse());
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: "勉強時間（分）",
        data: studyTimes,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
        tension: 0.2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)", // ◯の中の色
        pointBorderColor: "rgba(54, 162, 235, 1)", // ◯の枠の色
      },
      {
        label: "メディア時間（分）",
        data: mediaTimes,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)", 
        pointBorderColor: "rgba(255, 99, 132, 1)", 
      },
    ],
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Line data={data} />
    </div>
  );
}
