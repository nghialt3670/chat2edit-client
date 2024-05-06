import React, { memo, useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import useMessages from "../hooks/useMessages";

function MessageList({ onReplyImage }) {
  const { messages, setMessages } = useMessages();
  const messageContainerRef = useRef(null);

  useEffect(() => {
    messageContainerRef.current.scroll({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="flex flex-col sm:w-5/6 md:w-3/5 h-5/6 overflow-y-scroll no-scrollbar"
      ref={messageContainerRef}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          isPending={msg.isPending}
          sender={msg.sender}
          images={msg.images}
          text={msg.text}
          onReplyImage={onReplyImage}
        />
      ))}
    </div>
  );
}

export default memo(MessageList);
