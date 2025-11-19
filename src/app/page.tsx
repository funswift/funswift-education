import Goal from "@/components/Goal/Goal";


export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="w-full bg-[var(--lightBlue)] p-4 flex items-center justify-between">
        {/* 左側（アイコン＋ユーザー情報） */}
        <div className="flex items-center space-x-3">
          <Image
            src="/kotori-icon.png"
            alt="コトリ"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">函館　花子</h1>
            <span className="text-sm text-white">ノートの魔法使い ✨</span>
          </div>
        </div>

        {/* 右側（ボタン群） */}
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
            今までの記録
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium">
            設定
          </button>
        </div>
      </header>

      {/* メイン内容 */}
      <section className="flex-1 p-10 bg-white">
        <h2 className="text-xl font-semibold text-[var(--text)]">
          1月1日 〜 1月14日の記録
        </h2>
      </section>
      <div className="min-h-screen p-8 flex items-start justify-center">
        <Goal />
      </div>
    </main>
  );
}
