import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { SlOptionsVertical } from "react-icons/sl";
import Skeleton from "@mui/material/Skeleton";
import Popover from "@mui/material/Popover";
import { downloadFromDataURL } from "../utils/helpers";

export default function Message({ sender, images, text, onReplyImage }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    onReplyImage(null);
    setAnchorEl(null);
  };

  const handleShowOptionClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleEditClick = (e) => {};

  const handleDownload = (image) => {
    downloadFromDataURL(image.url, "image");
    handleClose();
  };

  const handleReplyImage = (image) => {
    onReplyImage(image);
  };

  const factor = 4 / Math.ceil(Math.sqrt(images.length));
  const imgHeight = Math.ceil(100 * factor);
  const open = Boolean(anchorEl);

  return (
    <div className="mb-10 flex flex-row float-left">
      <div className="mr-4">
        {sender === "user" ? (
          <FaUser className="m-1" />
        ) : (
          <RiRobot3Fill className="m-1" />
        )}
      </div>
      <div>
        {text ? <p className="font-medium mb-2">{text}</p> : undefined}
        <div className="flex flex-wrap justify-between after:flex-auto gap-2 mt-2">
          {images.map((img) => (
            <div className="relative" key={img.id}>
              <div className="rounded absolute right-0 bg-gray-200 bg-opacity-80">
                <IconButton size="small" onClick={handleShowOptionClick}>
                  <SlOptionsVertical className="size-full" />
                </IconButton>
              </div>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <div className="m-0">
                  <IconButton size="small" onClick={handleEditClick}>
                    <RiImageEditFill className="size-full" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDownload(img)}>
                    <MdFileDownload className="size-full" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleReplyImage(img)}
                  >
                    <MdOutlineReply className="size-full" />
                  </IconButton>
                </div>
              </Popover>
              <img
                className="rounded h-20"
                src={img.url}
                style={{ height: imgHeight }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
