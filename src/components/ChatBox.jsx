import React from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

export default function ChatBox() {
  return (
    <div className="flex flex-col justify-center items-center bg-slate-400 w-full h-full">
      <div className="flex w-full h-16 items-center text-xl p-6">Chat2Edit</div>
      <MessageList />
      <MessageInput />
      <p className="w-full h-10"></p>
    </div>
  );
}
