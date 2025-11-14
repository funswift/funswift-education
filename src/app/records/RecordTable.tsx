'use client'
import { useEffect, useState } from 'react'
import { DailyRecord } from '../../types/dailyRecord'
import { loadLast14DaysRecords } from './recordStorage'

// LuxonのDurationを表示用に整形する関数
function formatDuration(d: DailyRecord['studyTime']) {
  return d.isValid ? d.toFormat('h:mm') : '-'
}

export default function RecordTable() {
  const [records, setRecords] = useState<DailyRecord[]>([])

  // 初回レンダリング時にlocalStorageから記録を読み込む
  useEffect(() => {
    const loaded = loadLast14DaysRecords()
    setRecords(loaded)
  }, [])

  return (
    <div>
      <h2>過去14日間の記録</h2>
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>就寝</th>
            <th>起床</th>
            <th>勉強</th>
            <th>メディア</th>
            <th>運動</th>
            <th>読書</th>
            <th>朝食</th>
            <th>お手伝い</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => {
            const date = r.bedTime.toISOString().slice(0, 10)
            return (
              <tr key={date}>
                <td>{date}</td>
                <td>{r.bedTime.toLocaleTimeString()}</td>
                <td>{r.wakeUpTime.toLocaleTimeString()}</td>
                <td>{formatDuration(r.studyTime)}</td>
                <td>{formatDuration(r.mediaTime)}</td>
                <td>{r.exercise ? '✔' : ''}</td>
                <td>{r.reading ? '✔' : ''}</td>
                <td>{r.breakfast ? '✔' : ''}</td>
                <td>{r.assistance ? '✔' : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
