// types/dailyRecord.ts
import { Duration } from "luxon";

export type DailyRecord = {
  bedTime: Date | null;
  wakeUpTime: Date | null;
  studyTime: Duration | null;
  mediaTime: Duration | null;
  exercise: boolean;
  reading: boolean;
  breakfast: boolean;
  assistance: boolean;
};

