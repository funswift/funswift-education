import Goal from "@/components/Goal/Goal";
import DailyRow from "@/components/records/dailyRecords";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <main>
        <Goal />
        <div className="flex flex-col gap-4">
          <DailyRow />
          <DailyRow />
          <DailyRow />
          <DailyRow />
          <DailyRow />
          <DailyRow />
          <DailyRow />
        </div>
      </main>
    </div>
  );
}
