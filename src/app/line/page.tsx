import React from "react";
import StudyMediaChart from "../linegraph/linegraph";

export default function RecordsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">グラフページ</h1>
      <StudyMediaChart />
    </div>
  );
}
