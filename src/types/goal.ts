import { Duration } from "luxon";

type Goal = {
    /* 平日の目標 */
    bedTimeGoal: Date;  // 寝た時刻
    wakeUpTimeGoal: Date;  // 起きた時刻
    studyTimeGoal: Duration;    // 勉強時間（分）
    mediaTimeGoal: Duration;    // テレビやゲームの時間（分）
    exerciseGoal: Duration;    // 運動の時間（分）
    readingGoal: Duration;    // 読書の時間（分）

    /* 週末の目標 */
    weekendBedTimeGoal: Date; //寝た時刻
    weekendWakeUpTimeGoal: Date;//起きた時刻
    weekendStudyTimeGoal: Duration;
    weekendMediaTimeGoal: Duration;
    weekendExerciseGoal: Duration;
    weekendReadingGoal: Duration;
}
