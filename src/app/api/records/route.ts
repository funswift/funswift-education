import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Duration } from 'luxon'
import { DailyRecord } from '@/types/dailyRecord'


// 保存先ファイル
const DATA_FILE = path.join(process.cwd(), 'data', 'records.json')

// DailyRecord -> JSON 用オブジェクト
function serializeRecord(r: DailyRecord) {
  return {
    bedTime: r.bedTime.toISOString(),
    wakeUpTime: r.wakeUpTime.toISOString(),
    studyTime: r.studyTime.toISO(),
    mediaTime: r.mediaTime.toISO(),
    exercise: r.exercise,
    reading: r.reading,
    breakfast: r.breakfast,
    assistance: r.assistance,
  }
}

// JSON オブジェクト -> DailyRecord
function deserializeRecord(o: any): DailyRecord {
  return {
    bedTime: new Date(o.bedTime),
    wakeUpTime: new Date(o.wakeUpTime),
    studyTime: Duration.fromISO(o.studyTime),
    mediaTime: Duration.fromISO(o.mediaTime),
    exercise: !!o.exercise,
    reading: !!o.reading,
    breakfast: !!o.breakfast,
    assistance: !!o.assistance,
  }
}

function readRecords(): DailyRecord[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr.map(deserializeRecord)
  } catch (err) {
    console.error('readRecords error', err)
    return []
  }
}

// 生データをそのまま返す（recordDate メタ情報などを保持）
function readRawRecords(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return []
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    const arr = JSON.parse(raw)
    if (!Array.isArray(arr)) return []
    return arr
  } catch (err) {
    console.error('readRawRecords error', err)
    return []
  }
}

function writeRawRecords(records: any[]): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf8')
    return true
  } catch (err) {
    console.error('writeRawRecords error:', err)
    return false
  }
}

function writeRecords(records: DailyRecord[]): boolean {
  try {
    const out = records.map(serializeRecord)
    fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2), 'utf8')
    return true
  } catch (err) {
    console.error('writeRecords error', err)
    return false
  }
}

// GET: ?days=14 （デフォルト14日）
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const daysParam = url.searchParams.get('days')
    const dateParam = url.searchParams.get('date') // YYYY-MM-DD
    const days = daysParam ? Number(daysParam) : 14

    const records = readRecords()

    // date 指定がある場合はその日のレコードを返す（upsertの基準は bedTime の日付）
    if (dateParam) {
      // search raw records for explicit recordDate metadata first, then fall back to bedTime date
      const raw = readRawRecords()
      const byMeta = raw.find((r: any) => r.recordDate === dateParam)
      if (byMeta) return NextResponse.json(byMeta)
      const target = records.find(r => r.bedTime.toISOString().slice(0, 10) === dateParam)
      if (!target) return NextResponse.json({ message: 'not found' }, { status: 404 })
      return NextResponse.json(serializeRecord(target))
    }

    // return list with recordDate metadata so front-end can match by logical day
    const raw = readRawRecords()
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

    if (Number.isFinite(days) && days > 0) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days + 1) // include today and past (days-1) days
      // normalize cutoff to local midnight so day comparisons use whole days
      cutoff.setHours(0, 0, 0, 0)
      // Use recordDate (logical day) when present; otherwise fall back to bedTime's calendar date.
      const filtered = listOut.filter((r: any) => {
        const dayStr = r.recordDate || (r.bedTime ? r.bedTime.slice(0, 10) : undefined)
        if (!dayStr) return false
        // interpret as local midnight for that day
        const dayDate = new Date(dayStr + 'T00:00')
        return dayDate >= cutoff
      })
      return NextResponse.json(filtered)
    }

    return NextResponse.json(listOut)
  } catch (err) {
    console.error('GET /api/records error', err)
    return NextResponse.json({ message: '読み込みエラー' }, { status: 500 })
  }
}

// POST: 単一日の記録を追加。期待する body 形：{ bedTime, wakeUpTime, studyTime, mediaTime, exercise, reading, breakfast, assistance }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('POST /api/records received:', { body })

    if (!body || !body.bedTime || !body.wakeUpTime) {
      return NextResponse.json({ message: '就寝時刻と起床時刻は必須です' }, { status: 400 })
    }
    // Build stored object; accept optional recordDate to indicate logical day this record belongs to
    const recordDate = body.recordDate || new Date(body.bedTime).toISOString().slice(0, 10)
    console.log('Using recordDate:', recordDate)
    const stored = {
      bedTime: new Date(body.bedTime).toISOString(),
      wakeUpTime: new Date(body.wakeUpTime).toISOString(),
      studyTime: Duration.fromObject({ minutes: body.studyTime ?? 0 }).toISO(),
      mediaTime: Duration.fromObject({ minutes: body.mediaTime ?? 0 }).toISO(),
      exercise: !!body.exercise,
      reading: !!body.reading,
      breakfast: !!body.breakfast,
      assistance: !!body.assistance,
      recordDate: recordDate,
    }
    console.log('Prepared stored object:', stored)

    const raw = readRawRecords()
    console.log('Current records:', raw)
    // upsert by recordDate if exists, otherwise by bedTime date
    const idx = raw.findIndex((r: any) => r.recordDate === recordDate || (r.bedTime && r.bedTime.slice(0, 10) === recordDate))
    console.log('Found existing record at index:', idx)
    if (idx >= 0) raw[idx] = stored
    else raw.push(stored)

    if (!writeRawRecords(raw)) {
      console.error('Failed to write records to file')
      return NextResponse.json({ message: '保存に失敗しました' }, { status: 500 })
    }

    console.log('Successfully saved record')
    return NextResponse.json(stored)
  } catch (err) {
    console.error('POST /api/records error', err)
    return NextResponse.json({ message: '処理エラー' }, { status: 500 })
  }
}

