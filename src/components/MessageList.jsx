import React from "react";
import Message from "./Message";

export default function MessageList({ messages }) {
  return (
    <div className="flex flex-col sm:w-5/6 md:w-2/3">
      {messages.map((msg) => (
        <Message key={msg.id} images={msg.images} text={msg.text} />
      ))}
    </div>
  );
}
