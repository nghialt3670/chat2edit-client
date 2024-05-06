import React, { useContext } from "react";
import CanvasesDataContext from "../context/CanvasesDataContext";

export default function useCanvasesData() {
  return useContext(CanvasesDataContext);
}
