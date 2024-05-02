import React, { useEffect, useRef, useState } from "react";
import { MdAddPhotoAlternate } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { IoIosAddCircle } from "react-icons/io";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { v4 as uuid4 } from "uuid";
import { readFilesToDataURL } from "../utils/helpers";

export default function MessageInput({ replyImage, onSendMessage }) {
  const [images, setImages] = useState([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingMore, setIsAddingMore] = useState(false);
  const filesInputRef = useRef(null);
  const textInputRef = useRef(null);
  const imagePreviewAreaRef = useRef(null);
  const prevImagesLength = useRef(0);

  useEffect(() => {
    const newImage = { ...replyImage, id: uuid4() };
    if (replyImage) setImages([...images, newImage]);
  }, [replyImage]);

  useEffect(() => {
    // Scroll the image preview area to bottom only if more images are added
    if (prevImagesLength.current < images.length) {
    }
    imagePreviewAreaRef.current.scroll({
      top: imagePreviewAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
    textInputRef.current.focus();
    prevImagesLength.current = images.length;
  }, [images]);

  useEffect(() => {
    const loadImagesFromFiles = async () => {
      try {
        const urls = await readFilesToDataURL(files);
        const images = urls.map((url) => ({
          id: uuid4(),
          url: url,
        }));
        setIsUploading(false);
        if (isAddingMore) setImages((prev) => [...prev, ...images]);
        else setImages(images);
        setIsAddingMore(false);
      } catch (e) {
        console.log("Error loading images: ", e);
      }
    };
    setTimeout(loadImagesFromFiles, 500);
  }, [files]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleUploadBtnClick = (e) => {
    filesInputRef.current.click();
  };

  const handleAddMoreClick = (e) => {
    setIsAddingMore(true);
    filesInputRef.current.click();
  };

  const handleFilesChange = async (e) => {
    const files = Array(e.target.files.length)
      .fill(null)
      .map((item, idx) => e.target.files[idx]);
    filesInputRef.current.value = null;
    setFiles(files);
    if (!isAddingMore) setImages([]);
    setIsUploading(true);
  };

  const handleDeleteImage = (imgIdx) => {
    setImages(images.filter((img, idx) => idx !== imgIdx));
    filesInputRef.current.value = null;
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const message = {
      id: uuid4(),
      sender: "user",
      images: images,
      text: text,
    };
    onSendMessage(message);
    setImages([]);
    setText("");
  };

  const borderRadiusStyle =
    images.length || isUploading > 0 ? "rounded-xl" : "rounded-full";

  return (
    <form
      className={`absolute bottom-10 ${borderRadiusStyle} bg-slate-200 lg:w-1/3 sm:w-3/4 h-fit`}
    >
      <div
        className="flex flex-wrap items-center max-h-60 overflow-y-scroll no-scrollbar justify-between after:flex-auto gap-1"
        ref={imagePreviewAreaRef}
      >
        {images.map((img, idx) => (
          <div className="relative" key={img.id}>
            <img
              className="max-w-20 max-h-14 m-2 rounded opacity-50"
              src={img.url}
            />
            <div className="absolute top-0 right-0">
              <IconButton size="small" onClick={() => handleDeleteImage(idx)}>
                <TiDelete className="size-full" />
              </IconButton>
            </div>
          </div>
        ))}
        {isUploading ? (
          <CircularProgress className="m-5" size={20} />
        ) : undefined}
        {images.length > 0 ? (
          <IconButton
            className="w-14 h-14"
            size="large"
            onClick={handleAddMoreClick}
          >
            <IoIosAddCircle className="size-full" opacity={0.4} />
          </IconButton>
        ) : undefined}
      </div>
      <div className="flex justify-between items-center">
        <IconButton size="large" onClick={handleUploadBtnClick}>
          <MdAddPhotoAlternate className="size-full" />
          <input
            className="hidden"
            type="file"
            accept="image/*"
            ref={filesInputRef}
            multiple
            onChange={handleFilesChange}
          />
        </IconButton>
        <input
          className="bg-transparent h-2/3 w-11/12 outline-none text-m font-medium"
          type="text"
          spellCheck="false"
          ref={textInputRef}
          value={text}
          onChange={handleTextChange}
        />
        <IconButton size="large" type="submit" onClick={handleSubmitClick}>
          <BiSolidSend className="size-full" />
        </IconButton>
      </div>
    </form>
  );
}
