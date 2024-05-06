import { fabric } from "fabric";
// import { getScaleRatioToFit } from "./process";

export async function loadFabricImage(url) {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(url, (img) => {
      resolve(img);
    });
  });
}

export async function initCanvasFromImage(image) {
  const canvas = new fabric.Canvas();
  const bgImg = await loadFabricImage(image.url);
  canvas.set({
    filename: image.filename,
    uid: image.uid,
    centeredRotation: true,
    centeredScaling: true,
  });
  bgImg.set({ category: "composite-image", uid: image.id });
  canvas.setBackgroundImage(bgImg);
  canvas.setWidth(bgImg.getScaledWidth());
  canvas.setHeight(bgImg.getScaledHeight());
  return canvas;
}

export async function uploadedImagesToCanvasesData(images) {
  return Object.assign(
    {},
    ...(await Promise.all(
      images.map(async (img) => {
        const canvas = new fabric.Canvas();
        const bgImg = await loadFabricImage(img.url);
        canvas.set({
          filename: img.filename,
          uid: img.canvasId,
          centeredRotation: true,
          centeredScaling: true,
        });
        bgImg.set({ category: "composite-image", uid: img.id });
        canvas.setBackgroundImage(bgImg);
        canvas.setWidth(bgImg.getScaledWidth());
        canvas.setHeight(bgImg.getScaledHeight());
        const canvasData = canvas.toObject(["filename", "uid"]);
        return { [canvas.uid]: canvasData };
      }),
    )),
  );
}

export function transferCanvasData(srcCanvas, destCanvas) {
  destCanvas.renderOnAddRemove = false;
  destCanvas.setBackgroundImage(srcCanvas.backgroundImage);
  destCanvas.setWidth(srcCanvas.getWidth());
  destCanvas.setHeight(srcCanvas.getHeight());
  srcCanvas.forEachObject((obj) => {
    destCanvas.add(obj);
  });
  destCanvas.renderOnAddRemove = true;
}

// export function resizeCanvas(canvas, maxWidth, maxHeight) {
//   const scaleRatio = getScaleRatioToFit(
//     canvas.getWidth(),
//     canvas.getHeight(),
//     maxWidth,
//     maxHeight,
//   );
//   canvas.setWidth(canvas.getWidth() * scaleRatio);
//   canvas.setHeight(canvas.getHeight() * scaleRatio);
//   canvas.setZoom(scaleRatio);
// }
