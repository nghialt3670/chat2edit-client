import { IconButton } from "@mui/material";
import React, { memo, useState } from "react";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";
import { downloadFromDataURL } from "../utils/helpers";
import Skeleton from "@mui/material/Skeleton";

function Message({ isPending, sender, images, text, onReplyImage }) {
  console.log("Message");
  if (isPending)
    return (
      <div className="mb-10 flex flex-row float-left">
        <div className="mr-4">
          {sender === "user" ? (
            <FaUser className="m-1" />
          ) : (
            <RiRobot3Fill className="m-1" />
          )}
        </div>
        <div className="w-full">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      </div>
    );
  const handleEdit = (image) => {};

  const handleDownload = (image) => {
    downloadFromDataURL(image.url, "image");
    handleClose();
  };

  const handleReplyImage = (image) => {
    onReplyImage({ ...image });
  };

  // TODO: Fix bug when device width is smaller than the image's width
  const scaleFactor = 1 / Math.ceil(Math.sqrt(images.length));
  const imgMinHeight = 100;
  const imgMaxHeight = 400;
  const imgHeight = Math.max(
    imgMinHeight,
    Math.floor(imgMaxHeight * scaleFactor),
  );

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
        <div className="flex flex-wrap md:justify-between after:flex-auto gap-4 mt-2">
          {images.map((img) => (
            <div className="relative flex flex-row" key={img.id}>
              <img
                className="rounded-l h-20"
                src={img.url}
                style={{ height: imgHeight }}
              />
              <div className="m-0 flex flex-col bg-gray-100 bg-opacity-50 rounded-r">
                <IconButton size="small" onClick={() => handleEdit(img)}>
                  <RiImageEditFill className="size-full" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDownload(img)}>
                  <MdFileDownload className="size-full" />
                </IconButton>
                <IconButton size="small" onClick={() => handleReplyImage(img)}>
                  <MdOutlineReply className="size-full" />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(Message);
