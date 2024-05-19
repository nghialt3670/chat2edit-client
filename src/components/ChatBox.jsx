import React, { memo, useCallback, useState, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import useMessages from "../hooks/useMessages";
import { v4 as uuid4 } from "uuid";
import {
  getCanvasData,
  loadCanvasFromData,
  loadFabricImage,
  loadObjectsFromData,
} from "../utils/fabricUtils";
import useCanvasesData from "../hooks/useCanvasesData";
import useLanguage from "../hooks/useLanguage";

function ChatBox() {
  const [replyImage, setReplyImage] = useState(null);
  const [chatId, setChatId] = useState(null)
  const { messages, setMessages } = useMessages();
  const { canvasesData, setCanvasesData } = useCanvasesData();
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    setChatId(uuid4());
  }, []);

  useEffect(() => {
    const updateMessages = async () => {
      if (messages.length === 0) return;
      const lastMessage = messages[messages.length - 1];

      const pendedMessages = messages.slice(0, messages.length - 1);
      if (lastMessage.isPending && lastMessage.sender === "user") {
        const oldImages = lastMessage.images.filter((img) => img.canvasId);
        const newImages = lastMessage.images.filter((img) => !img.canvasId);
        for (let i = 0; i < newImages.length; i++)
          newImages[i].canvasId = uuid4();

        const newCanvasesData = await Promise.all(
          newImages.map(async (image) => await getCanvasData(image)),
        );
        setCanvasesData([...canvasesData, ...newCanvasesData]);
        setTimeout(() => {
          setMessages([
            ...pendedMessages,
            {
              ...lastMessage,
              isPending: false,
              images: oldImages.concat(newImages),
            },
          ]);
        }, 500);
      } else if (lastMessage.isPending && lastMessage.sender === "bot") {
        const lastUserMessage = messages[messages.length - 2];
        const requestImages = lastUserMessage.images;
        // Should optimize this line later.
        const requestCanvasesData = requestImages.map((image) =>
          canvasesData.find((item) => item.id === image.canvasId),
        );
        const requestData = JSON.stringify({
          chat_id: chatId,
          instruction: lastUserMessage.text,
          canvases: requestCanvasesData,
        });

        console.log(JSON.parse(requestData))
        
        const request = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestData,
        };
        const response = await fetch(
          "http://127.0.0.1:8000/edit",
          request,
        );
        const responseData = await response.json();
        console.log(responseData)
        const responseStatus = responseData["status"];
        if (responseStatus == "fail") {
          const errorMessage = {
            id: uuid4(),
            isPending: false,
            sender: "bot",
            images: [],
            text: "Something went wrong, please try later!",
          };
          console.log(responseData["response"])
          setMessages([...pendedMessages, errorMessage]);
          return;
        }

        const responseCanvasesData = responseData["canvases"];
        const responseText = responseData["response"];

        setCanvasesData([...canvasesData, ...responseCanvasesData]);
        const responseCanvases = await Promise.all(
          responseCanvasesData.map(loadCanvasFromData),
        );
        const responseImages = responseCanvases.map((canvas) => ({
          id: uuid4(),
          dataURL: canvas.toDataURL(),
          canvasId: canvas.id,
        }));
        const responseMessage = {
          id: uuid4(),
          isPending: false,
          sender: "bot",
          images: responseImages,
          text: responseText,
        };
        setMessages([...pendedMessages, responseMessage]);
      } else if (!lastMessage.isPending && lastMessage.sender === "user") {
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
