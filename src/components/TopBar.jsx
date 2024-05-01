import React, { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import IconButton from "@mui/material/IconButton";

export default function TopBar({ onToggleSideBar }) {
  const handleToggleClick = (e) => {
    onToggleSideBar(e);
  };

  return (
    <div className="bg-slate-400 w-full h-fit flex flex-row items-center">
      <IconButton
        className="size-14"
        onClick={handleToggleClick}
        style={{ zIndex: 1000 }}
      >
        <TfiAlignJustify className="size-3/5" />
      </IconButton>
      <h1 className="text-xl font-medium" style={{ zIndex: 1000 }}>
        Chat2Edit
      </h1>
    </div>
  );
}
