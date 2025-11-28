"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

import { DateTime } from "luxon";

type ChartInput = {
  bedTime: string;      // ISO
  wakeUpTime: string;   // ISO
};

type ChartGoal = {
  bedTimeGoal: string | null;
  wakeUpTimeGoal: string | null;
} | null;

export default function SleepChart({
  data,
  goal,
}: {
  data: ChartInput[];
  goal: ChartGoal;
}) {
  // ---- グラフで使う値に変換 ----
  const converted = data.map((r) => {
    const bed = DateTime.fromISO(r.bedTime);
    const wake = DateTime.fromISO(r.wakeUpTime);

    const bedHour = bed.hour + bed.minute / 60;
    const wakeHour =
      wake.hour + wake.minute / 60 + (wake.hour < 12 ? 24 : 0);

    return {
      dateLabel: bed.toFormat("MM/dd"),
      bedHour,
      sleepLength: wakeHour - bedHour,
      bedISO: bed.toISO(),
      wakeISO: wake.toISO(),
    };
  });

  
  // ---- 目標データが有効ならライン表示 ----
const hasGoal =
  goal &&
  goal.bedTimeGoal !== null &&
  goal.wakeUpTimeGoal !== null;

// ★ goal が null のときに絶対にここを実行しない
let bedGoalHour: number | null = null;
let wakeGoalHour: number | null = null;

if (hasGoal) {
  const bed = DateTime.fromISO(goal!.bedTimeGoal!);
  const wake = DateTime.fromISO(goal!.wakeUpTimeGoal!);

  bedGoalHour =
    bed.hour + bed.minute / 60 +
    (bed.hour < 12 ? 24 : 0);

  wakeGoalHour =
    wake.hour + wake.minute / 60 +
    (wake.hour < 12 ? 24 : 0);
}




  return (
    <div style={{ width: "90vw", height: "60vh" }}>
      <ResponsiveContainer>
        <BarChart
          data={converted}
          margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
        >
          {/* ---- 日付 ---- */}
          <XAxis
            dataKey="dateLabel"
            interval={0}
            angle={-45}
            textAnchor="end"
          />

          {/* ---- 20:00〜翌08:00（反転 Y 軸） ---- */}
          <YAxis
            type="number"
            //domain={[0,50]}//デバッグ用
            domain={[19,33]}//本当の範囲
            allowDataOverflow={true}
            reversed
            ticks={[20,21,22,23,24,25,26,27,28,29,30,31,32]}
            interval={0}
            allowDecimals={false}
            tickFormatter={(v) => {
              let hour = Math.floor(v);
              if (hour >= 24) hour -= 24;
              return `${hour}:00`;
            }}
          />

          {/* ---- Tooltip ---- */}
          <Tooltip
            formatter={(v, name, entry: any) => {
              const bedISO = entry?.payload?.bedISO;
              const wakeISO = entry?.payload?.wakeISO;

              const bed = DateTime.fromISO(bedISO);
              const wake = DateTime.fromISO(wakeISO);

              return [
                `${Number(v).toFixed(2)} 時間（${bed.toFormat("HH:mm")} → ${wake.toFormat("HH:mm")}）`,
                "睡眠時間"
              ];
            }}
          />

          {/* ---- 目標ライン ---- */}
          {hasGoal && bedGoalHour !== null && (
            <ReferenceLine
              y={bedGoalHour}
              stroke="var(--darkBlue)"
              strokeDasharray="4"
              label="目標就寝"
            />
          )}

          {hasGoal && wakeGoalHour !== null && (
            <ReferenceLine
              y={wakeGoalHour}
              stroke="var(--yellow)"
              strokeDasharray="4"
              label="目標起床"
            />
          )}

          {/* ---- 睡眠バー ---- */}
          <Bar
            dataKey="bedHour"
            stackId="sleep"
            fill="transparent"
            isAnimationActive={false}
          />
          <Bar
            dataKey="sleepLength"
            stackId="sleep"
            fill="var(--green)"
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
