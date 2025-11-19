import { Duration } from 'luxon'
import { DailyRecord } from '../../types/dailyRecord'


// 論理日（recordDate: YYYY-MM-DD）をキーに保存（例: dailyRecord-2025-11-12）
export function saveDailyRecord(record: DailyRecord, recordDate: string) {
    localStorage.setItem(`dailyRecord-${recordDate}`, JSON.stringify(record))
}

// 指定日付の記録を読み込む（編集用）
export function loadDailyRecordByDate(dateStr: string): DailyRecord | null {
    const raw = localStorage.getItem(`dailyRecord-${dateStr}`)
    if (!raw) return null
    try {
        const parsed = JSON.parse(raw)
        return {
            bedTime: new Date(parsed.bedTime),
            wakeUpTime: new Date(parsed.wakeUpTime),
            studyTime: Duration.fromISO(parsed.studyTime),
            mediaTime: Duration.fromISO(parsed.mediaTime),
            exercise: !!parsed.exercise,
            reading: !!parsed.reading,
            breakfast: !!parsed.breakfast,
            assistance: !!parsed.assistance,
        }
    } catch {
        return null
    }
}

// 過去14日分の記録を一覧取得
export function loadLast14DaysRecords(): DailyRecord[] {
    const records: DailyRecord[] = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const key = `dailyRecord-${d.toISOString().slice(0, 10)}`
        const raw = localStorage.getItem(key)
        if (!raw) continue

        try {
            const parsed = JSON.parse(raw)
            records.push({
                bedTime: new Date(parsed.bedTime),
                wakeUpTime: new Date(parsed.wakeUpTime),
                studyTime: Duration.fromISO(parsed.studyTime),
                mediaTime: Duration.fromISO(parsed.mediaTime),
                exercise: !!parsed.exercise,
                reading: !!parsed.reading,
                breakfast: !!parsed.breakfast,
                assistance: !!parsed.assistance,
            })
        } catch {
            continue
        }
    }

    return records
}
