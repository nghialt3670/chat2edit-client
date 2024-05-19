import { IconButton } from "@mui/material";
import React, { memo, useState } from "react";
import { RiImageEditFill } from "react-icons/ri";
import { MdFileDownload } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { downloadFileFromDataURL } from "../utils/helpers";
import Skeleton from "@mui/material/Skeleton";
import UserAvatar from "./UserAvatar";
import AppLogo from "./AppLogo";

function Message({ isPending, sender, images, text, onReplyImage }) {
  const handleEditImage = (image) => {};

  const handleDownloadImage = (image) => {
    downloadFileFromDataURL(image.dataURL, image.filename);
  };

  const handleReplyImage = (image) => {
    onReplyImage({ ...image });
  };

  let imgHeight;
  if (!isPending) {
    // TODO: Fix bug when device width is smaller than the image's width
    const scaleFactor = 1 / Math.ceil(Math.sqrt(images.length));
    const imgMinHeight = 100;
    const imgMaxHeight = 400;
    imgHeight = Math.max(imgMinHeight, Math.floor(imgMaxHeight * scaleFactor));
  }

  return (
    <div className="mb-5 flex flex-row float-left">
      <div className="mr-4 w-8 flex justify-center">
        {sender === "user" ? <UserAvatar size={24} /> : <AppLogo size={24} />}
      </div>
      {isPending ? (
        <div className="w-full">
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </div>
      ) : (
        <div className="flex flex-col">
          {text ? <p className="font-medium mt-1">{text}</p> : undefined}
          <div className="flex flex-wrap after:flex-auto gap-4 mt-2">
            {images.map((img) => (
              <div className="relative flex flex-row" key={img.id}>
                <img src={img.dataURL} style={{ height: imgHeight }} />
                <div className="m-0 flex flex-col bg-gray-100 bg-opacity-50 rounded-r w-8">
                  <IconButton size="small" onClick={() => handleEditImage(img)}>
                    <RiImageEditFill className="size-full" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDownloadImage(img)}
                  >
                    <MdFileDownload className="size-full" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleReplyImage(img)}
                  >
                    <MdOutlineReply className="size-full" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Message);
