import React, { memo, useCallback, useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import useMessages from "../hooks/useMessages";
import { v4 as uuid4 } from "uuid";
import { uploadedImagesToCanvasesData } from "../utils/fabricUtils";
import useCanvasesData from "../hooks/useCanvasesData";
import { canvasDataToCompositeImage } from "../utils/mapping";
import useLanguage from "../hooks/useLanguage";

function ChatBox() {
  const [replyImage, setReplyImage] = useState(null);
  const { messages, setMessages } = useMessages();
  const { canvasesData, setCanvasesData } = useCanvasesData();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const updateMessages = async () => {
      if (messages.length === 0) return;
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.isPending) {
        const pendedMessages = messages.slice(0, messages.length - 1);
        if (lastMessage.sender === "user") {
          const newImages = lastMessage.images.filter(
            (img) => !(img.canvasId in canvasesData),
          );
          for (let i = 0; i < newImages.length; i++)
            newImages[i].canvasId = uuid4();

          const newCanvasesData = await uploadedImagesToCanvasesData(newImages);
          setCanvasesData({ ...canvasesData, ...newCanvasesData });
          setTimeout(() => {
            setMessages([
              ...pendedMessages,
              { ...lastMessage, isPending: false, images: newImages },
            ]);
          }, 500);
        } else {
          const lastUserMessage = messages[messages.length - 2];
          const reqImages =
            lastUserMessage.images.length > 0
              ? lastUserMessage.images
              : lastMessage.images;

          let requestHistory = null;

          const reqCanvasesData = lastUserMessage.images.map(
            (img) => canvasesData[img.canvasId],
          );
          const compositeImages = await Promise.all(
            reqCanvasesData.map(
              async (canvasData) =>
                await canvasDataToCompositeImage(canvasData),
            ),
          );
          const requestData = JSON.stringify({
            instruction: lastUserMessage.text,
            language: language,
            feedback_history: requestHistory,
            images: compositeImages,
          });

          const request = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestData,
          };

          // TODO: Implement send request message to server
        }
      } else if (lastMessage.sender === "user") {
        setTimeout(() => {
          setMessages([
            ...messages,
            { id: uuid4(), sender: "bot", isPending: true },
          ]);
        }, 500);
      }
    };

    updateMessages();
  }, [messages]);

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
    setMessages([...messages, message]);
  };

  const handleReplyImage = useCallback((image) => {
    setReplyImage(image);
  }, []);

  return (
    <div className="flex flex-col justify-start items-center bg-slate-400 min-w-96 w-full h-full">
      <MessageList onReplyImage={handleReplyImage} />
      <MessageInput replyImage={replyImage} onSendMessage={handleSendMessage} />
    </div>
  );
}

export default memo(ChatBox);
