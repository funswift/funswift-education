import Goal from "@/components/Goal/Goal";
import DailyList from "@/components/records/dailyList";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex items-start justify-center">
      <main>
        <Goal />
        <div className="mt-8">
          <DailyList />
        </div>
      </main>
    </div>
  );
}
