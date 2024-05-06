import React from "react";
import MessagesContext from "./MessagesContext";
import UserContext from "./UserContext";
import CanvasesDataContext from "./CanvasesDataContext";
import LanguageContext from "./LanguageContext";

export default function ContextProvider({
  user,
  setUser,
  messages,
  setMessages,
  canvasesData,
  setCanvasesData,
  language,
  setLanguage,
  children,
}) {
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <MessagesContext.Provider value={{ messages, setMessages }}>
        <CanvasesDataContext.Provider value={{ canvasesData, setCanvasesData }}>
          <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
          </LanguageContext.Provider>
        </CanvasesDataContext.Provider>
      </MessagesContext.Provider>
    </UserContext.Provider>
  );
}
