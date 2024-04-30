import React from "react";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";

export default function ChatPage() {
  return (
    <div className="flex flex-row size-full">
      <SideBar></SideBar>
      <ChatBox></ChatBox>
    </div>
  );
}
