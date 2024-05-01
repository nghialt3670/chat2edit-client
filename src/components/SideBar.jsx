import React, { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import IconButton from "@mui/material/IconButton";
import zIndex from "@mui/material/styles/zIndex";

export default function SideBar({ isOpen }) {
  return (
    <nav
      className={`absolute bg-slate-500 ${isOpen ? "left-0" : "-left-80"} w-80 h-full duration-200`}
      style={{ zIndex: 999 }}
    ></nav>
  );
}
