"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadRecord } from "@/app/records/recordStorage";
import { Duration } from "luxon";
import TimePicker from "@/components/records/TimePicker";

type Props = {
  date: string; // YYYY-MM-DD
};

function toTimeInputValue(d: Date | null) {
  if (!d) return "";
  const local = new Date(d);
  const hh = String(local.getHours()).padStart(2, "0");
  const mm = String(local.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function RecordEditor({ date }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [bedTime, setBedTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [studyMinutes, setStudyMinutes] = useState("" as string);
  const [mediaMinutes, setMediaMinutes] = useState("" as string);
  const [breakfast, setBreakfast] = useState(false);
  const [assistance, setAssistance] = useState(false);
  const [reading, setReading] = useState(false);
  const [exercise, setExercise] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      const rec = loadRecord(date);
      if (rec) {
        setBedTime(toTimeInputValue(rec.bedTime));
        setWakeTime(toTimeInputValue(rec.wakeUpTime));
        setStudyMinutes(
          rec.studyTime
            ? String(Math.round(rec.studyTime.as("minutes") || 0))
            : ""
        );
        setMediaMinutes(
          rec.mediaTime
            ? String(Math.round(rec.mediaTime.as("minutes") || 0))
            : ""
        );
        setBreakfast(!!rec.breakfast);
        setAssistance(!!rec.assistance);
        setReading(!!rec.reading);
        setExercise(!!rec.exercise);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [date]);

  function parseTimeToDate(dateStr: string, time: string) {
    if (!time) return null;
    // create local Date from yyyy-mm-dd and HH:MM
    const isoLocal = `${dateStr}T${time}:00`;
    const d = new Date(isoLocal);
    return d;
  }

  function handleSave() {
    // build dates
    const bedDate = parseTimeToDate(date, bedTime);
    let wakeDate = parseTimeToDate(date, wakeTime);

    if (bedDate && wakeDate && wakeDate <= bedDate) {
      // assume wake is next day
      wakeDate = new Date(wakeDate.getTime() + 24 * 60 * 60 * 1000);
    }

    const parseNum = (s: string) => {
      const t = (s || "").toString().trim();
      if (t === "") return null;
      const n = Number(t);
      return Number.isFinite(n) ? n : null;
    };

    const studyNum = parseNum(studyMinutes);
    const mediaNum = parseNum(mediaMinutes);

    const storeObj: Record<string, any> = {
      bedTime: bedDate ? bedDate.toISOString() : null,
      wakeUpTime: wakeDate ? wakeDate.toISOString() : null,
      studyTime:
        studyNum !== null
          ? Duration.fromObject({ minutes: studyNum }).toISO()
          : null,
      mediaTime:
        mediaNum !== null
          ? Duration.fromObject({ minutes: mediaNum }).toISO()
          : null,
      exercise: !!exercise,
      reading: !!reading,
      breakfast: !!breakfast,
      assistance: !!assistance,
    };

    try {
      localStorage.setItem(`dailyRecord-${date}`, JSON.stringify(storeObj));
      router.back();
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">{date} の記録を編集</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-sm">寝た時間</span>
          <div className="mt-1">
            <TimePicker
              value={bedTime}
              onChange={setBedTime}
              ariaLabel="bed-time"
              step={1}
            />
          </div>
        </label>

        <label className="flex flex-col">
          <span className="text-sm">起きた時間</span>
          <div className="mt-1">
            <TimePicker
              value={wakeTime}
              onChange={setWakeTime}
              ariaLabel="wake-time"
              step={1}
            />
          </div>
        </label>

        <label className="flex flex-col col-span-2">
          <span className="text-sm">勉強時間（分）</span>
          <input
            type="number"
            min={0}
            value={studyMinutes}
            onChange={(e) => setStudyMinutes(e.target.value)}
            className="mt-1 p-2 border rounded"
            placeholder=""
          />
        </label>

        <label className="flex flex-col col-span-2">
          <span className="text-sm">メディア時間（分）</span>
          <input
            type="number"
            min={0}
            value={mediaMinutes}
            onChange={(e) => setMediaMinutes(e.target.value)}
            className="mt-1 p-2 border rounded"
            placeholder=""
          />
        </label>

        <div className="col-span-2 flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={breakfast}
              onChange={(e) => setBreakfast(e.target.checked)}
            />{" "}
            朝ご飯
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={assistance}
              onChange={(e) => setAssistance(e.target.checked)}
            />{" "}
            お手伝い
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={reading}
              onChange={(e) => setReading(e.target.checked)}
            />{" "}
            読書
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exercise}
              onChange={(e) => setExercise(e.target.checked)}
            />{" "}
            運動
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className="px-4 py-2 bg-[var(--darkBlue)] text-white rounded"
          onClick={handleSave}
        >
          保存
        </button>
        <button
          className="px-4 py-2 border rounded"
          onClick={() => router.back()}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
