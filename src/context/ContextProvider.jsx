import React from "react";
import MessagesContext from "./MessagesContext";

export default function ContextProvider({ messages, setMessages, children }) {
  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
}
