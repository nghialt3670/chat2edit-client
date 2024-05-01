import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

export default function Message({ sender, images, text, onReply }) {
  const handleImageClick = (e) => {};

  const handleEditClick = (e) => {};

  const handleDownloadClick = (e) => {};

  console.log(showOption);

  const factor = 2 / Math.ceil(Math.sqrt(images.length));
  const imgHeight = Math.floor(200 * factor);
  return (
    <div className="my-10 flex flex-row float-left">
      <div>
        {sender === "user" ? (
          <FaUser className="m-1" />
        ) : (
          <RiRobot3Fill className="m-1" />
        )}
      </div>
      <div>
        {text ? <p className="mx-2 font-medium">{text}</p> : undefined}
        <div className="flex flex-wrap justify-between after:flex-auto">
          {images.map((img) => (
            <div className="relative m-2" key={img.id}>
              {/* {showOption ? (
                <div className="bg-gray-300 absolute top-0 right-0">
                  <IconButton size="small" onClick={handleEditClick}>
                    <RiImageEditFill className="size-full" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDownloadClick}>
                    <MdFileDownload className="size-full" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDownloadClick}>
                    <MdOutlineReply  className="size-full" />
                  </IconButton>
                </div>
              ) : undefined} */}
              <img
                className="rounded"
                src={img.url}
                style={{ height: imgHeight }}
                onClick={handleImageClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
