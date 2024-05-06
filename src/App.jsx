import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import EditPage from "./components/EditPage";
import ContextProvider from "./context/ContextProvider";

export default function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [canvasesData, setCanvasesData] = useState({});
  const [language, setLanguage] = useState("vi");

  return (
    <ContextProvider
      user={user}
      setUser={setUser}
      messages={messages}
      setMessages={setMessages}
      canvasesData={canvasesData}
      setCanvasesData={setCanvasesData}
      language={language}
      setLanguage={setLanguage}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/edit" element={<EditPage />} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}
