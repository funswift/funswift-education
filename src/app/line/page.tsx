"use client";
import React, { useEffect, useState } from "react";
import StudyMediaChart from "../../components/linegraph/linegraph";
import { loadLast14DaysRecords } from "../records/recordStorage";
import { ChartData } from "chart.js";

export default function RecordsPage() {
  const [data, setData] = useState<ChartData<"line"> | null>(null);
  const [error, setError] = useState<string | null>(null); // エラー状態を追加

  useEffect(() => {
    try {
      const records = loadLast14DaysRecords();
      if (records.length === 0) {
        throw new Error("データが存在しません");
      }

      const labels: string[] = [];
      const studyTimes: number[] = [];
      const mediaTimes: number[] = [];

      records.forEach((record) => {
        const d = record.bedTime;
        const date = `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
        labels.push(date);
        studyTimes.push(record.studyTime.as("minutes"));
        mediaTimes.push(record.mediaTime.as("minutes"));
      });

      setData({
        labels: labels.reverse(),
        datasets: [
          {
            label: "勉強時間（分）",
            data: studyTimes.reverse(),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: false,
            tension: 0.2,
            pointBackgroundColor: "rgba(54, 162, 235, 1)",
            pointBorderColor: "rgba(54, 162, 235, 1)",
          },
          {
            label: "メディア時間（分）",
            data: mediaTimes.reverse(),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: false,
            tension: 0.2,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            pointBorderColor: "rgba(255, 99, 132, 1)",
          },
        ],
      });
    } catch (err: any) {
      setError(err.message || "データの取得中にエラーが発生しました");
    }
  }, []);

  if (error) {
    return <p>{error}</p>; // エラーメッセージを表示
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">グラフページ</h1>
      <StudyMediaChart data={data} />
    </div>
  );
}
