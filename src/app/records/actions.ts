'use server'
// このファイルは Next.js の Server Actions（サーバー側で実行される関数）です。
// ブラウザから直接ファイルに保存せず、サーバー側で JSON ファイルを読み書きします。

import fs from 'fs'
import path from 'path'
import { Duration } from 'luxon'
import type { DailyRecord } from '@/types/dailyRecord'

// 記録データの保存先（プロジェクト直下の data/records.json）
const DATA_FILE = path.join(process.cwd(), 'data', 'records.json')

// 保存先のディレクトリとファイルが存在しない場合は作成します。
function ensureDataFile() {
    const dir = path.dirname(DATA_FILE)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8')
    }
}

// JSON ファイルからそのままの配列データ（シリアライズ済み）を読み込みます。
// ここでは Date や Duration に復元せず、そのまま扱います（一覧や保存の基準に recordDate を使うため）。
function readRawRecords(): any[] {
    try {
        ensureDataFile()
        const raw = fs.readFileSync(DATA_FILE, 'utf8')
        const arr = JSON.parse(raw)
        return Array.isArray(arr) ? arr : []
    } catch (err) {
        console.error('readRawRecords error', err)
        return []
    }
}

// JSON ファイルへ配列データを書き戻します。
// records の各要素は ISO 文字列（Date）や ISO Duration（luxon）で保存されます。
function writeRawRecords(records: any[]): boolean {
    try {
        ensureDataFile()
        fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8')
        return true
    } catch (err) {
        console.error('writeRawRecords error:', err)
        return false
    }
}

// 1件の記録を保存（新規/更新）します。
// recordDate（YYYY-MM-DD）を論理的な「記録日」として採用し、
// 既存に同じ recordDate のレコードがある場合は置き換えます（アップサート）。
export async function saveRecord(data: {
    bedTime: string
    wakeUpTime: string
    studyTime: number
    mediaTime: number
    exercise: boolean
    reading: boolean
    breakfast: boolean
    assistance: boolean
    recordDate: string
}) {
    // フロントから受け取った分数を luxon の Duration に変換して ISO 表現で保存します。
    const stored = {
        bedTime: data.bedTime,
        wakeUpTime: data.wakeUpTime,
        studyTime: Duration.fromObject({ minutes: data.studyTime ?? 0 }).toISO(),
        mediaTime: Duration.fromObject({ minutes: data.mediaTime ?? 0 }).toISO(),
        exercise: !!data.exercise,
        reading: !!data.reading,
        breakfast: !!data.breakfast,
        assistance: !!data.assistance,
        recordDate: data.recordDate,
    }

    const raw = readRawRecords()
    // recordDate が一致するものを優先して検索。なければ bedTime の日付でフォールバックします。
    const idx = raw.findIndex((r: any) =>
        r.recordDate === data.recordDate ||
        (r.bedTime && r.bedTime.slice(0, 10) === data.recordDate)
    )

    if (idx >= 0) {
        raw[idx] = stored
    } else {
        raw.push(stored)
    }

    const success = writeRawRecords(raw)
    if (!success) {
        throw new Error('保存に失敗しました')
    }

    return stored
}

// 直近14日分の記録一覧を返します。
// フロント側のスロット表示では recordDate を優先して日付マッチングを行います。
export async function getRecords() {
    const raw = readRawRecords()
    const days = 14
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days + 1)
    cutoff.setHours(0, 0, 0, 0)

    // 一覧表示用にそのままの文字列形式を返します。
    // recordDate があればそれを含め、なければ bedTime の日付を使います。
    const listOut = raw.map((r: any) => ({
        bedTime: r.bedTime,
        wakeUpTime: r.wakeUpTime,
        studyTime: r.studyTime,
        mediaTime: r.mediaTime,
        exercise: !!r.exercise,
        reading: !!r.reading,
        breakfast: !!r.breakfast,
        assistance: !!r.assistance,
        recordDate: r.recordDate || (r.bedTime ? r.bedTime.slice(0, 10) : undefined),
    }))

    const filtered = listOut.filter((r: any) => {
        const dayStr = r.recordDate || (r.bedTime ? r.bedTime.slice(0, 10) : undefined)
        if (!dayStr) return false
        const dayDate = new Date(dayStr + 'T00:00')
        return dayDate >= cutoff
    })

    return filtered
}

// 特定の論理日（YYYY-MM-DD）の記録を返します。存在しない場合は null。
export async function getRecordByDate(dateStr: string) {
    const raw = readRawRecords()
    const record = raw.find((r: any) => r.recordDate === dateStr)
    return record || null
}
