import { Duration } from "luxon";
import { DailyRecord } from "../../types/dailyRecord";

// 保存
export function saveDailyRecord(record: DailyRecord, recordDate: string) {
  localStorage.setItem(`dailyRecord-${recordDate}`, JSON.stringify(record));
}

// 指定日付の読込
export function loadDailyRecordByDate(dateStr: string): DailyRecord | null {
  const raw = localStorage.getItem(`dailyRecord-${dateStr}`);
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
}

// 最新14日分の読込（未保存の日も返す）
export function loadLast14DaysRecords(): { date: string; record: DailyRecord | null }[] {
  const today = new Date();
  const list: { date: string; record: DailyRecord | null }[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dateStr = d.toISOString().slice(0, 10);
    const record = loadDailyRecordByDate(dateStr);

    list.push({ date: dateStr, record });
  }

  return list;
}
