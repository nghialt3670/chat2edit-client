import React, { memo, useContext, useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import TopBar from "./TopBar";
import MessagesContext from "../context/MessagesContext";

function ChatBox() {
  const [replyImages, setReplyImages] = useState([]);
  const { messages, setMessages } = useContext(MessagesContext);

  const handleSendMessage = (message) => {
    setMessages([...messages, message]);
  };
  return (
    <div className="flex flex-col justify-start items-center bg-slate-400 min-w-96 w-full h-full">
      <MessageList messages={messages} />
      <MessageInput
        replyImages={replyImages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default memo(ChatBox);
