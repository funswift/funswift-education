type DailyRecord = {
    id: string; //出席番号
    bedTime: Date; //寝た時刻
    wakeUpTime: Date;//起きた時刻
    studyStartTime: Date; //勉強を始めた時刻
    studyFinishTime: Date;//勉強を終えた時刻
    readingStartTime: Date; //読書を始めた時刻
    readingFinishTime: Date; //読書を終えた時刻
    mediaStartTime: Date;
    mediaFinishTime: Date;
    exercise: false;
    breakfast: false;
    assistance: false;
    studentComment: string;
}

type DailyGoal = {
    bedTime_goal: Date; //寝た時刻
    wakeUpTime_goal: Date;//起きた時刻
    studyStartTime_goal: Date; //勉強を始めた時刻
    studyFinishTime_goal: Date;//勉強を終えた時刻
    readingStartTime_goal: Date; //読書を始めた時刻
    readingFinishTime_goal: Date; //読書を終えた時刻
    mediaStartTime_goal: Date;
    mediaFinishTime_goal: Date;
}