type DailyRecord = {
    bedTime: Date; //寝た時刻
    wakeUpTime: Date;//起きた時刻
    studyTime: Date; //勉強時間
    mediaTime: Date;
    exercise: false;
    reading: false;
    breakfast: false;
    assistance: false;
}
    
type DailyGoal = {
    bedTimeGoal: Date; //寝た時刻
    wakeUpTimeGoal: Date;//起きた時刻
    studyTimeGoal: Date;
    mediaTimeGoal: Date;
    excerciseGoal: Date;
    readingGoal: Date;
}

type WeeklyGoal = {
    weeklyBedTimeGoal: Date; //寝た時刻
    weeklyWakeUpTimeGoal: Date;//起きた時刻
    weeklyStudyTimeGoal: Date;
    weeklyMediaTimeGoal: Date;
    weeklyExcerciseGoal: Date;
    weeklyReadingGoal: Date;
}

type studentComment = {
    comment: string;
}

type Account = {
    id: string; //ユーザーID
    name:string;
    password:string;
    class: number;
}