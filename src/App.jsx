import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import EditPage from "./components/EditPage";
import ContextProvider from "./context/ContextProvider";

export default function App() {
  const [messages, setMessages] = useState([]);

  return (
    <ContextProvider messages={messages} setMessages={setMessages}>
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
