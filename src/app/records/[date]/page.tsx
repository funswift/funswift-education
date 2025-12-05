import RecordEditor from "@/components/records/RecordEditor";

type Props = {
  params: { date: string };
};

export default async function Page({ params }: Props) {
  const { date } = params;
  return (
    <div className="min-h-screen p-8 bg-[var(--background)]">
      <RecordEditor date={date} />
    </div>
  );
}
