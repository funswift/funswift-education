import { Duration } from 'luxon'

type DailyRecord = {
    bedTime: Date; // 寝た時刻
    wakeUpTime: Date; // 起きた時刻
    studyTime: Duration; // 勉強時間（分）
    mediaTime: Duration; // テレビやゲームの時間（分）
    exercise: boolean; // 運動をしたか
    reading: boolean; // 読書をしたか
    breakfast: boolean; // 朝食を食べたか
    assistance: boolean; // お手伝いをしたか
}
