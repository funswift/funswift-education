export default function ColorTestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
         style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
      
      <h1 className="text-3xl font-bold">🎨 Color Variable Test</h1>
      <p>Next.js + Tailwind + CSS変数のテストページです。</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
        <div className="w-32 h-16 flex items-center justify-center text-white rounded-md" style={{ backgroundColor: "var(--lightBlue)" }}>lightBlue</div>
        <div className="w-32 h-16 flex items-center justify-center text-white rounded-md" style={{ backgroundColor: "var(--darkBlue)" }}>darkBlue</div>
        <div className="w-32 h-16 flex items-center justify-center text-black rounded-md" style={{ backgroundColor: "var(--yellow)" }}>yellow</div>
        <div className="w-32 h-16 flex items-center justify-center text-white rounded-md" style={{ backgroundColor: "var(--green)" }}>green</div>
        <div className="w-32 h-16 flex items-center justify-center text-white rounded-md" style={{ backgroundColor: "var(--red)" }}>red</div>
        <div className="w-32 h-16 flex items-center justify-center text-white rounded-md" style={{ backgroundColor: "var(--orange)" }}>orange</div>
      </div>
    </div>
  );
}
