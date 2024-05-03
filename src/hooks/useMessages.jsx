import React, { useContext } from "react";
import MessagesContext from "../context/MessagesContext";

export default function useMessages() {
  return useContext(MessagesContext);
}
