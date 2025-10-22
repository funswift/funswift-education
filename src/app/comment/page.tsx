"use client";

import React, { useState } from "react";

export default function CommentPage() {
  const [studentComment, setStudentComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("コメント内容:", studentComment);
    alert("コメントを送信しました！");
    setStudentComment("");
  };

  return (
    <div className="fixed bottom-6 right-0 w-1/3 h-1/6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="relative w-full h-full px-4 flex items-center"
      >
        {/* 入力欄 */}
        <textarea
          value={studentComment}
          onChange={(e) => {
            setStudentComment(e.target.value);
          }}
          placeholder="がんばったことを入力..."
          className="w-full h-full outline-none text-gray-800 placeholder-gray-400 p-3 pr-14 rounded-lg shadow-sm resize-none"
          
          style={{ backgroundColor: "#FFFFFF" ,color: "#3B3B3B" }}
        />
        
        {/* 入力欄の中に重ねる送信ボタン */}
        <button
          type="submit"
          className="absolute right-7 font-semibold transition"
          style={{ color: "#578FD7" }}
        >
          送信
        </button>
      </form>
    </div>
  );

  
}

