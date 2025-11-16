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

type Props = {
  data: {
    bedTime: string;     // ISO文字列
    wakeUpTime: string;
  }[];
  goal: {
    bedTimeGoal: string;
    wakeUpTimeGoal: string;
  };
};

export default function SleepChart({ data, goal }: Props) {
  // 文字列 → DateTime へ戻す
  const converted = data.map((r) => {
    const bed = DateTime.fromISO(r.bedTime);
    const wake = DateTime.fromISO(r.wakeUpTime);

    return {
      dateLabel: bed.toFormat("MM/dd"), // 横軸表示
      bedHour: bed.hour + bed.minute / 60,
      wakeHour: wake.hour + wake.minute / 60,
      sleepLength: wake.diff(bed, "hours").hours,
      bed,
      wake,
    };
  });

  const bedGoal = DateTime.fromISO(goal.bedTimeGoal);
  const wakeGoal = DateTime.fromISO(goal.wakeUpTimeGoal);

  return (
    <div style={{ width: "25vw", height: "50vh" }}>
      <ResponsiveContainer>
        <BarChart
          data={converted}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          {/* X軸：日付 */}
          <XAxis dataKey="dateLabel" />

          <YAxis
            type="number"
            domain={[20, 32]}
            reversed
            allowDataOverflow={true}    // ← ★自動調整禁止
            allowDecimals={false}
            ticks={[2,20,22,24,26,28,30,32]}
            interval={0}  
            tickFormatter={(v) => {
              let hour = v;
              if (hour >= 24) hour -= 24;
              return `${hour}:00`;
            }}
          />
          


          <Tooltip />

          {/* 目標ライン */}
          <ReferenceLine
            y={bedGoal.hour + bedGoal.minute / 60}
            stroke="var(--darkBlue)"
            strokeDasharray="4"
            //label="目標就寝"
          />
          <ReferenceLine
            y={wakeGoal.hour + wakeGoal.minute / 60 + 24}
            stroke="var(--yellow)"
            strokeDasharray="4"
            //label="目標起床"
          />

          {/* 就寝スタート位置（透明） */}
          <Bar
            dataKey="bedHour"
            stackId="sleep"
            fill="transparent"
            isAnimationActive={false}
          />

            {/* 睡眠バー（浮く） */}
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
