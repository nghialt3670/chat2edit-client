import React, { useState } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useUser from "../hooks/useUser";
import useLanguage from "../hooks/useLanguage";
import AppLogo from "./AppLogo";
import UserAvatar from "./UserAvatar";

export default function TopBar({ onToggleSideBar }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  const handleToggleClick = (e) => {
    onToggleSideBar(e);
  };

  const handleAppNameClick = (e) => {
    window.location.reload();
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="bg-slate-400 w-full h-14 flex items-center">
      <IconButton
        className="size-14"
        onClick={handleToggleClick}
        style={{ zIndex: 1000 }}
      >
        <TfiAlignJustify className="size-3/5" />
      </IconButton>
      <div className="flex flex-row items-center cursor-pointer">
        <AppLogo size={32} />
        <h1
          className="ml-1 text-xl font-bold"
          style={{ zIndex: 1000 }}
          onClick={handleAppNameClick}
        >
          Chat2Edit
        </h1>
      </div>
      <Select
        className="ml-auto w-fit"
        value={language}
        onChange={handleLanguageChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        variant="standard"
      >
        <MenuItem value="vi">Vietnamese</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
      <div className="mx-4">
        <UserAvatar
          size={20}
          onClick={() => {
            console.log(9);
          }}
        />
      </div>
    </div>
  );
}
