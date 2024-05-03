import React, { memo, useCallback, useContext, useState } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import MessagesContext from "../context/MessagesContext";
import { v4 as uuid4 } from "uuid";

function ChatBox() {
  const [replyImage, setReplyImage] = useState(null);
  const { messages, setMessages } = useContext(MessagesContext);

  const handleSendMessage = (message) => {
    // TODO: Implement response to user when user send message
    // while another message is pending
    const lastMessage = messages[messages.length - 1];
    if (
      messages.length > 0 &&
      (lastMessage.isPending || lastMessage.sender === "user")
    ) {
      alert("Wait for message pending!");
      return;
    }
    // Display pending state of the user message first
    setMessages([...messages, message]);
    setTimeout(() => {
      // Display actual message data of the user (after render all images)
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].isPending = false;
        setTimeout(() => {
          // Display pending state of the bot response
          setMessages((prev) => {
            if (prev[prev.length - 1].sender === "bot") return prev;
            return [...prev, { id: uuid4(), sender: "bot", isPending: true }];
          });
        }, 1000);
        return newMessages;
      });
    }, 500);
  };

  const handleReplyImage = useCallback((image) => {
    setReplyImage(image);
  }, []);

  return (
    <div className="flex flex-col justify-start items-center bg-slate-400 min-w-96 w-full h-full">
      <MessageList messages={messages} onReplyImage={handleReplyImage} />
      <MessageInput replyImage={replyImage} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default memo(ChatBox);
