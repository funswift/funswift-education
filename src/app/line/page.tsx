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
            borderColor: "#90C0FF",
            backgroundColor: "rgba(144, 192, 255, 0.2)",
            fill: false,
            tension: 0.2,
            pointBackgroundColor: "#90C0FF",
            pointBorderColor: "#90C0FF",
          },
          {
            label: "メディア時間（分）",
            data: mediaTimes.reverse(),
            borderColor: "#FA8072",
            backgroundColor: "rgba(250, 128, 114, 0.2)",
            fill: false,
            tension: 0.2,
            pointBackgroundColor: "#FA8072",
            pointBorderColor: "#FA8072",
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
      <h1 className="text-2xl font-semibold mb-6">勉強・メディア時間グラフ</h1>
      <StudyMediaChart data={data} />
    </div>
  );
}
