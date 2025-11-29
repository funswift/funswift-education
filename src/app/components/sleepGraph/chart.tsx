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


/*以下サンプルデータ,コンソールで実行してみてください
(function() {
  // Luxon Duration を使いたいけど、ブラウザ用に最小限の構造だけ模倣
  function makeDuration(minutes) {
    return {
      values: [minutes],
      isLuxonDuration: true
    };
  }

  // 今日を基準に 14 日前まで
  const today = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  // サンプル：ほぼ同じパターン、日によってズラす
  for (let i = 0; i < 14; i++) {
    const d = new Date(today.getTime() - i * oneDay);

    const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

    // ランダムに 21:00〜24:00 に就寝
    const bed = new Date(d);
    bed.setHours(21 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);

    // 翌日の 6:00〜9:00 に起床
    const wake = new Date(d);
    wake.setDate(wake.getDate() + 1);
    wake.setHours(6 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60), 0, 0);

    const record = {
      bedTime: bed.toISOString(),
      wakeUpTime: wake.toISOString(),
      studyTime: makeDuration(Math.floor(Math.random() * 90)),       // 0–90分
      mediaTime: makeDuration(Math.floor(Math.random() * 120)),      // 0–120分
      exercise: Math.random() > 0.5,
      reading: Math.random() > 0.5,
      breakfast: Math.random() > 0.2,
      assistance: Math.random() > 0.3,
    };

    localStorage.setItem(`dailyRecord-${dateStr}`, JSON.stringify(record));
  }

  console.log("✨ 14日分のサンプル睡眠データを保存しました！");
})();
*/
