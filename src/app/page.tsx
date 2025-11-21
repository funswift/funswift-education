import Goal from "@/components/Goal/Goal";
import DailyRow from "@/components/records/dailyRecords";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <main>
        <Goal />
        <DailyRow />
      </main>
    </div>
  );
}
