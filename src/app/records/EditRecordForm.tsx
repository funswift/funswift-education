'use client'
import { useState, useEffect } from 'react'
import { DailyRecord } from '../../types/dailyRecord'
import { saveDailyRecord, loadDailyRecordByDate } from './recordStorage'
import { Duration } from 'luxon'

export default function EditRecordForm({ date }: { date: string }) {
    const [record, setRecord] = useState<DailyRecord | null>(null)

    // 初回レンダリング時に指定日付の記録を読み込む
    useEffect(() => {
        const loaded = loadDailyRecordByDate(date)
        setRecord(loaded)
    }, [date])

    if (!record) return <p>{date} の記録が見つかりません</p>

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                saveDailyRecord(record)
                alert('保存しました')
            }}
        >
            <h2>{date} の記録を編集</h2>

            {/* 勉強時間 */}
            <label>
                勉強時間（分）:
                <input
                    type="number"
                    value={record.studyTime.as('minutes')}
                    onChange={(e) =>
                        setRecord({
                            ...record,
                            studyTime: Duration.fromObject({ minutes: Number(e.target.value) }),
                        })
                    }
                />
            </label>

            {/* メディア時間 */}
            <label>
                メディア時間（分）:
                <input
                    type="number"
                    value={record.mediaTime.as('minutes')}
                    onChange={(e) =>
                        setRecord({
                            ...record,
                            mediaTime: Duration.fromObject({ minutes: Number(e.target.value) }),
                        })
                    }
                />
            </label>

            {/* 運動 */}
            <label>
                運動した:
                <input
                    type="checkbox"
                    checked={record.exercise}
                    onChange={(e) => setRecord({ ...record, exercise: e.target.checked })}
                />
            </label>

            {/* 読書 */}
            <label>
                読書した:
                <input
                    type="checkbox"
                    checked={record.reading}
                    onChange={(e) => setRecord({ ...record, reading: e.target.checked })}
                />
            </label>

            {/* 朝食 */}
            <label>
                朝食を食べた:
                <input
                    type="checkbox"
                    checked={record.breakfast}
                    onChange={(e) => setRecord({ ...record, breakfast: e.target.checked })}
                />
            </label>

            {/* お手伝い */}
            <label>
                お手伝いした:
                <input
                    type="checkbox"
                    checked={record.assistance}
                    onChange={(e) => setRecord({ ...record, assistance: e.target.checked })}
                />
            </label>

            {/* 保存ボタン */}
            <button type="submit">保存</button>
        </form>
    )
}
