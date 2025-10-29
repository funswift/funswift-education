"use client"
import React, { useEffect, useState } from "react"

type ServerRecord = {
  bedTime: string
  wakeUpTime: string
  studyTime: string
  mediaTime: string
  exercise: boolean
  reading: boolean
  breakfast: boolean
  assistance: boolean
  recordDate?: string
}

export default function RecordsPage() {
  // modal state
  const [openDate, setOpenDate] = useState<string | null>(null) // YYYY-MM-DD
  const [slots, setSlots] = useState<string[]>([]) // YYYY-MM-DD array for 14 days
  const [list, setList] = useState<ServerRecord[]>([]) // raw server records (serialized)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // modal form state
  const [form, setForm] = useState({
    bedTime: "",
    wakeUpTime: "",
    studyTime: 0,
    mediaTime: 0,
    exercise: false,
    reading: false,
    breakfast: false,
    assistance: false,
  })

  useEffect(() => {
    buildSlots()
    fetchList()
  }, [])

  function buildSlots() {
    const arr: string[] = []
    const today = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      arr.push(d.toISOString().slice(0, 10))
    }
    setSlots(arr)
  }

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch('/api/records')
      const data = await res.json()
      setList(data)
    } catch (err) {
      setMessage('取得エラー: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  // helper: parse PT45M -> 45
  function durationIsoToMinutes(iso?: string) {
    if (!iso) return 0
    const m = iso.match(/PT(\d+)M/)
    if (m) return Number(m[1])
    return 0
  }

  async function openModalFor(date: string) {
    setMessage(null)
    setOpenDate(date)
    // fetch single-day record from server
    try {
      const res = await fetch(`/api/records?date=${date}`)
      if (res.status === 404) {
        // empty form default times: bedTime -> previous day 22:00, wakeUpTime -> this date 06:00
        const bed = new Date(date + 'T00:00')
        bed.setDate(bed.getDate() - 1)
        bed.setHours(22, 0, 0, 0)
        const wake = new Date(date + 'T06:00')
        setForm({
          bedTime: toLocalInput(bed.toISOString()),
          wakeUpTime: toLocalInput(wake.toISOString()),
          studyTime: 0,
          mediaTime: 0,
          exercise: false,
          reading: false,
          breakfast: false,
          assistance: false,
        })
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setForm({
        bedTime: toLocalInput(data.bedTime),
        wakeUpTime: toLocalInput(data.wakeUpTime),
        studyTime: durationIsoToMinutes(data.studyTime),
        mediaTime: durationIsoToMinutes(data.mediaTime),
        exercise: !!data.exercise,
        reading: !!data.reading,
        breakfast: !!data.breakfast,
        assistance: !!data.assistance,
      })
    } catch (err) {
      setMessage('モーダル読み込みエラー: ' + String(err))
    }
  }

  function toLocalInput(dtIso?: string) {
    if (!dtIso) return ''
    const d = new Date(dtIso)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  async function saveForm(e?: React.FormEvent) {
    if (e) e.preventDefault()
    if (!openDate) return
    setSaving(true)
    setMessage(null)
    try {
      const payload = {
        bedTime: new Date(form.bedTime).toISOString(),
        wakeUpTime: new Date(form.wakeUpTime).toISOString(),
        studyTime: form.studyTime ?? 0,
        mediaTime: form.mediaTime ?? 0,
        exercise: !!form.exercise,
        reading: !!form.reading,
        breakfast: !!form.breakfast,
        assistance: !!form.assistance,
        recordDate: openDate,
      }
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      await fetchList()
      setOpenDate(null)
      setMessage('保存しました')
    } catch (err) {
      setMessage('保存エラー: ' + String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">2週間の記録（テスト用）</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {slots.map(d => {
          const rec = list.find((r: any) => {
            // If a record has an explicit recordDate, match only by that (logical day).
            if (r.recordDate) return r.recordDate === d
            // Otherwise fall back to bedTime's calendar date.
            return r.bedTime && new Date(r.bedTime).toISOString().slice(0, 10) === d
          })
          return (
            <div key={d} className="border rounded p-3 flex flex-col justify-between">
                <div className="text-sm font-medium">{d}</div>
                <div className="mt-2 text-xs">
                  {rec ? (
                    <>
                      <div>寝: {rec.bedTime ? new Date(rec.bedTime).toLocaleTimeString() : '—'}</div>
                      <div>起: {rec.wakeUpTime ? new Date(rec.wakeUpTime).toLocaleTimeString() : '—'}</div>
                      <div>勉強: {durationIsoToMinutes((rec as any).studyTime)} 分</div>
                      <div>テレビ/ゲーム: {durationIsoToMinutes((rec as any).mediaTime)} 分</div>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm">
                        {rec.exercise ? <span className="px-2 py-0.5 bg-green-100 rounded">運動</span> : null}
                        {rec.reading ? <span className="px-2 py-0.5 bg-green-100 rounded">読書</span> : null}
                        {rec.breakfast ? <span className="px-2 py-0.5 bg-green-100 rounded">朝食</span> : null}
                        {rec.assistance ? <span className="px-2 py-0.5 bg-green-100 rounded">お手伝い</span> : null}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-500">未登録</div>
                  )}
                </div>
              <div className="mt-3">
                <button onClick={() => openModalFor(d)} className="bg-green-600 text-white px-3 py-1 rounded">入力</button>
              </div>
            </div>
          )
        })}
      </div>

      {message && <div className="mb-4 text-sm text-gray-700">{message}</div>}

      {/* Modal */}
      {openDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-xl">
            <h2 className="text-lg font-medium mb-3">{openDate} の記録</h2>
            <form onSubmit={saveForm} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">
                  寝た時刻
                  <input type="datetime-local" value={form.bedTime} onChange={e => setForm({...form, bedTime: e.target.value})} className="border p-2 rounded" />
                </label>
                <label className="flex flex-col">
                  起きた時刻
                  <input type="datetime-local" value={form.wakeUpTime} onChange={e => setForm({...form, wakeUpTime: e.target.value})} className="border p-2 rounded" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col">勉強時間（分）<input type="number" min={0} value={form.studyTime} onChange={e => setForm({...form, studyTime: Number(e.target.value)})} className="border p-2 rounded" /></label>
                <label className="flex flex-col">テレビ/ゲーム（分）<input type="number" min={0} value={form.mediaTime} onChange={e => setForm({...form, mediaTime: Number(e.target.value)})} className="border p-2 rounded" /></label>
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.exercise} onChange={e => setForm({...form, exercise: e.target.checked})} /> 運動</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.reading} onChange={e => setForm({...form, reading: e.target.checked})} /> 読書</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.breakfast} onChange={e => setForm({...form, breakfast: e.target.checked})} /> 朝食</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={form.assistance} onChange={e => setForm({...form, assistance: e.target.checked})} /> お手伝い</label>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpenDate(null)} className="px-3 py-1 border rounded">キャンセル</button>
                <button type="submit" disabled={saving} className="px-3 py-1 bg-blue-600 text-white rounded">{saving ? '保存中...' : '保存'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
