import { fabric } from "fabric";
import { pick } from "lodash";

const canvasProperties = ["id", "objects", "backgroundImage"];

const objectProperties = [
  "id",
  "parentId",
  "type",
  "angle",
  "flipX",
  "flipY",
  "scaleX",
  "scaleY",
  "left",
  "top",
  "opacity",
  "fill",
  "shadow",
  "stroke",
  "strokeWidth",
  "width",
  "height",
];

const imageProperties = [
  ...objectProperties,
  "cropX",
  "cropY",
  "filters",
  "src",
];

const bgImageProperties = [
  ...objectProperties,
  "filename"
]

const textboxProperties = [
  ...objectProperties,
  "fontFamily",
  "fontSize",
  "fontStyle",
  "fontWeight",
  "text",
];

const groupProperties = [...objectProperties, "objects"];

const extraProperties = ["id", "filename", "labelToScore", "parentId"];

export async function loadFabricImage(url) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, (img) => {
      resolve(img);
    });
  });
}

export async function getCanvasData(image) {
  const canvas = new fabric.Canvas();
  const baseImage = await loadFabricImage(image.dataURL);
  baseImage.set({ id: image.id, parentId: image.canvasId, filename: image.filename });
  canvas.set({ id: image.canvasId });
  canvas.setBackgroundImage(baseImage);
  const canvasData = pick(canvas.toObject(extraProperties), canvasProperties);
  canvas.backgroundImage = pick(canvas.backgroundImage, bgImageProperties);
  canvasData.objects = canvasData.objects.map((object) => {
    object.parentId = canvas.id;
    switch (object.type) {
      case "group":
        return pick(object, groupProperties);
      case "image":
        return pick(object, imageProperties);
      case "textbox":
        return pick(object, textboxProperties);
    }
  });
  return canvasData;
}

export async function loadObjectsFromData(objectsData) {
  return new Promise((resolve, reject) => {
    fabric.util.enlivenObjects(objectsData, (objects) => {
      resolve(objects);
    });
  });
}

export async function loadCanvasFromData(canvasData) {
  const canvas = new fabric.Canvas();
  const objects = await loadObjectsFromData(canvasData.objects);
  objects.forEach((object) => {
    canvas.add(object);
  });
  canvas.setWidth(objects[0].width);
  canvas.setHeight(objects[0].height);
  return canvas;
}
