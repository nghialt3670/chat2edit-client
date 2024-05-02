import React, { useEffect, useRef, useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import Message from "./Message";
import Skeleton from "@mui/material/Skeleton";

const LoadingMessage = ({ sender, onReplyImage }) => {
  // TODO: Implement display logic when message is loading
  return (
    <div className="mb-10 flex flex-row float-left">
      <div className="mr-4">
        {sender === "user" ? (
          <FaUser className="m-1" />
        ) : (
          <RiRobot3Fill className="m-1" />
        )}
      </div>
      <div className="w-full">
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </div>
    </div>
  );
};

export default function MessageList({ messages, onReplyImage }) {
  const messageContainerRef = useRef(null);
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    messageContainerRef.current.scroll({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
    if (messages.length > 0 && messages[messages.length - 1].sender === "user")
      setTimeout(() => {
        setIsReplying(true);
      }, 1000);
    else setIsReplying(false);
  }, [messages]);

  return (
    <div
      className="flex flex-col sm:w-5/6 md:w-3/5 h-5/6 overflow-y-scroll no-scrollbar"
      ref={messageContainerRef}
    >
      {messages.map((msg) => (
        <Message
          key={msg.id}
          sender={msg.sender}
          images={msg.images}
          text={msg.text}
          onReplyImage={onReplyImage}
        />
      ))}
      {isReplying ? <LoadingMessage /> : undefined}
    </div>
  );
}
