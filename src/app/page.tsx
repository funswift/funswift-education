import Goal from "@/components/Goal/Goal";
import DailyRow from "@/components/records/dailyRecords";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <main>
        <Goal />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <DailyRow key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
