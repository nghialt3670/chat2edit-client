import React from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi";
import IconButton from "@mui/material/IconButton";

export default function MessageInput() {
  return (
    <form className="flex justify-between items-center rounded-full bg-slate-200 w-[600px] h-16">
      <IconButton size="large">
        <MdAddPhotoAlternate className="size-full" />
      </IconButton>
      <input
        className="bg-transparent h-2/3 w-11/12 outline-none text-xl"
        type="text"
        name=""
        id=""
        spellCheck="false"
      />
      <IconButton size="large">
        <BiSolidSend className="size-full" />
      </IconButton>
    </form>
  );
}
