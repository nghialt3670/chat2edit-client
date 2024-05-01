import React, { useState } from "react";
import SideBar from "./SideBar";
import ChatBox from "./ChatBox";
import TopBar from "./TopBar";

export default function ChatPage() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const handleToggleSideBar = (e) => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="flex flex-col size-full">
      <TopBar onToggleSideBar={handleToggleSideBar} />
      <SideBar isOpen={isSideBarOpen}></SideBar>
      <ChatBox />
    </div>
  );
}
