import { fabric } from "fabric";
import { loadFabricImage } from "./fabricUtils";

export async function canvasDataToCompositeImage(canvas) {
  const bgImg = canvas.backgroundImage;

  let compositeImage = {
    ...fabricObjectToGraphic(bgImg),
    url: bgImg.src,
    filename: canvas.filename,
    graphics: [],
  };

  compositeImage.graphics = await Promise.all(
    canvas.objects.map(async (obj) => {
      switch (obj.category) {
        case "composite-image":
          return await canvasDataToCompositeImage(obj.canvasInstance);

        case "image-object":
          return {
            ...fabricObjectToGraphic(obj),
            url: obj.toDataURL(),
            inpainted: obj.inpainted,
            label2score: obj.label2score,
          };

        case "text":
          return {
            ...fabricObjectToGraphic(obj),
            color: obj.backgroundColor,
            content: obj.text,
            font_family: obj.fontFamily,
            font_style: obj.fontStyle,
            font_size: obj.fontSize,
            font_weight: obj.fontWeight,
          };
      }
    }),
  );

  return compositeImage;
}

function fabricObjectToGraphic(obj) {
  return {
    uid: obj.uid,
    transform: {
      width: obj.width,
      height: obj.height,
      angle: obj.angle,
      pos_x: obj.left,
      pos_y: obj.top,
      scale_x: obj.scaleX,
      scale_y: obj.scaleY,
      flip_x: obj.flipX,
      flip_y: obj.flipY,
    },
    filters: [],
    category: obj.category,
  };
}

export async function compositeImageToCanvasData(image) {
  const canvas = new fabric.Canvas();
  const bgImg = await loadFabricImage(image.url);
  setGraphicPropsToFabricObject(image, bgImg);
  canvas.set({ uid: image.id });
  canvas.setBackgroundImage(bgImg);
  canvas.setWidth(bgImg.width);
  canvas.setHeight(bgImg.height);
  for (const graphic of image.graphics) {
    let object;
    switch (graphic.category) {
      case "composite-image":
        const overlayCanvas = await createCanvasFromResponseImage(graphic);
        object = await loadFabricImage(overlayCanvas.toDataURL());
        object.set({ canvasInstance: overlayCanvas });
        break;

      case "image-object":
        object = await loadFabricImage(graphic.url);
        object.set({
          inpainted: graphic.inpainted,
          label2score: graphic.label2score,
        });
        if (!object.inpainted) {
          object.set({
            selectable: false,
            hoverCursor: "mouse",
          });
        }
        break;

      case "text":
        object = new fabric.Text(graphic.content);
        if (graphic.color) object.set({ fill: graphic.color });
        if (graphic.font_family)
          object.set({ fontFamily: graphic.font_family });
        if (graphic.font_style) object.set({ fontStyle: graphic.font_style });
        if (graphic.font_size) object.set({ fontSize: graphic.font_size });
        if (graphic.font_weight)
          object.set({ fontWeight: graphic.font_weight });
        break;
    }
    setGraphicPropsToFabricObject(graphic, object);
    canvas.add(object);
  }
  return canvas;
}

export function setGraphicPropsToFabricObject(graphic, object) {
  const newFilters = [];
  for (const filterData of graphic.filters) {
    const value = parseFloat(filterData.value) - 1;
    let filter;
    switch (filterData.name) {
      case "brightness":
        filter = new fabric.Image.filters.Brightness({ brightness: value });
        break;
      case "blur":
        filter = new fabric.Image.filters.Blur({ blur: blur });
        break;
      case "grayscale":
        filter = new fabric.Image.filters.Grayscale();
        break;
      case "contrast":
        filter = new fabric.Image.filters.Contrast({ contrast: value });
        break;
      case "invert":
        filter = new fabric.Image.filters.Invert();
        break;
      case "noise":
        filter = new fabric.Image.filters.Noise({ noise: value });
        break;
      case "pixelate":
        filter = new fabric.Image.filters.Pixelate({ blocksize: value });
        break;
      case "saturation":
        filter = new fabric.Image.filters.Saturation({ saturation: value });
        break;
    }
    newFilters.push(filter);
  }
  object.set({
    uid: graphic.uid,
    angle: graphic.transform.angle,
    left: graphic.transform.pos_x,
    top: graphic.transform.pos_y,
    scaleX: graphic.transform.scale_x,
    scaleY: graphic.transform.scale_y,
    flipX: graphic.transform.flip_x,
    flipY: graphic.transform.flip_y,
    category: graphic.category,
    filters: newFilters,
  });
  if (object instanceof fabric.Image) object.applyFilters();
}
