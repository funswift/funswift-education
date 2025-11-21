export default function DailyRow() {
  return (
    <div className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm">
      {/* 左側：日付 */}
      <div className="text-2xl font-semibold text-gray-800 w-16">1日</div>

      {/* 中央：項目一覧 */}
      <div className="flex gap-8 flex-1 text-gray-700 text-center">
        <div>
          <div className="text-sm">メディア</div>
          <div className="font-semibold">4h30m</div>
        </div>

        <div>
          <div className="text-sm">勉強</div>
          <div className="font-semibold">50m</div>
        </div>

        <div>
          <div className="text-sm">睡眠</div>
          <div className="font-semibold">8h</div>
        </div>

        <div>
          <div className="text-sm">朝ご飯</div>
          <div className="font-semibold">◯</div>
        </div>

        <div>
          <div className="text-sm">お手伝い</div>
          <div className="font-semibold">✕</div>
        </div>

        <div>
          <div className="text-sm">読書</div>
          <div className="font-semibold">✕</div>
        </div>

        <div>
          <div className="text-sm">運動</div>
          <div className="font-semibold">◯</div>
        </div>
      </div>

      {/* 右側：入力リンク */}
      <button className="text-blue-600 font-semibold hover:underline ml-4">
        入力
      </button>
    </div>
  );
}
