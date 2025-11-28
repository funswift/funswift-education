// utils/calcSleepDuration.ts
import { DateTime } from "luxon";

export const calcSleepDuration = (bed: Date | null, wake: Date | null) => {
  if (!bed || !wake) return "-";

  const start = DateTime.fromJSDate(bed);
  const end = DateTime.fromJSDate(wake);

  // 翌日またぎにも対応
  const diff = end.diff(start, ["hours", "minutes"]);

  return `${diff.hours}h${diff.minutes}m`;
};
