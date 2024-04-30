import React, { useState } from "react";
import { TfiAngleDoubleRight, TfiAngleDoubleLeft } from "react-icons/tfi";
import { TfiAlignJustify } from "react-icons/tfi";
import IconButton from "@mui/material/IconButton";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`bg-slate-500 ${isOpen ? "w-96" : "w-16"} transition-width duration-200`}
    >
      <IconButton className="size-16" onClick={toggleSidebar}>
        <TfiAlignJustify className="size-3/5" />
      </IconButton>
    </nav>
  );
}
