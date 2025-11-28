import { Duration } from "luxon";
import { DailyRecord } from "@/types/dailyRecord";

// 保存
export const saveDailyRecord = (date: string, record: DailyRecord) => {
  localStorage.setItem(`dailyRecord-${date}`, JSON.stringify(record));
};

// 単日読込
export const loadRecord = (date: string): DailyRecord | null => {
  const raw = localStorage.getItem(`dailyRecord-${date}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    return {
      bedTime: parsed.bedTime ? new Date(parsed.bedTime) : null,
      wakeUpTime: parsed.wakeUpTime ? new Date(parsed.wakeUpTime) : null,
      studyTime: parsed.studyTime ? Duration.fromISO(parsed.studyTime) : null,
      mediaTime: parsed.mediaTime ? Duration.fromISO(parsed.mediaTime) : null,
      exercise: !!parsed.exercise,
      reading: !!parsed.reading,
      breakfast: !!parsed.breakfast,
      assistance: !!parsed.assistance,
    };
  } catch {
    return null;
  }
};

// 最新14日分の取得
export const loadLast14Days = () => {
  const today = new Date();
  const list: { date: string; record: DailyRecord | null }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const rec = loadRecord(key);

    list.push({ date: key, record: rec });
  }

  return list;
};
