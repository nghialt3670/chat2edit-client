import { fabric } from "fabric";
import { toBase64Str, toBase64Url } from "./helpers";
import { loadFabricImage } from "./fabricUtils";


export async function getBase64FromFabricObject(obj) {
  return new Promise((resolve, reject) => {
    const url = obj.toDataURL();
    const data_url = toBase64Str(url);
    resolve(data_url);
  });
}


export async function objectToCompositeImage(object, parent) {
  if (object.type === 'group') {
    return {
      "id": object.id,
      "parent": parent ? {
        "id": "string",
        "parent": "string",
        "transform": {
          "angle": 0,
          "pos_x": 0,
          "pos_y": 0,
          "scale_x": 1,
          "scale_y": 1,
          "flip_x": false,
          "flip_y": false,
          "opacity": 1,
          "filters": [
            {
              "name": "brightness",
              "value": 0
            }
          ]
        },
        "width": 0,
        "height": 0
      },
      "transform": {
        "angle": 0,
        "pos_x": 0,
        "pos_y": 0,
        "scale_x": 1,
        "scale_y": 1,
        "flip_x": false,
        "flip_y": false,
        "opacity": 1,
        "filters": [
          {
            "name": "brightness",
            "value": 0
          }
        ]
      },
      "width": 0,
      "height": 0,
      "type": "image",
      "filename": "image.png",
      "graphics": [
        {},
        {
          "id": "string",
          "parent": {
            "id": "string",
            "parent": "string",
            "transform": {
              "angle": 0,
              "pos_x": 0,
              "pos_y": 0,
              "scale_x": 1,
              "scale_y": 1,
              "flip_x": false,
              "flip_y": false,
              "opacity": 1,
              "filters": [
                {
                  "name": "brightness",
                  "value": 0
                }
              ]
            },
            "width": 0,
            "height": 0
          },
          "transform": {
            "angle": 0,
            "pos_x": 0,
            "pos_y": 0,
            "scale_x": 1,
            "scale_y": 1,
            "flip_x": false,
            "flip_y": false,
            "opacity": 1,
            "filters": [
              {
                "name": "brightness",
                "value": 0
              }
            ]
          },
          "width": 0,
          "height": 0,
          "type": "object",
          "inpainted": false,
          "label2score": {
            "additionalProp1": 0,
            "additionalProp2": 0,
            "additionalProp3": 0
          }
        },
        {
          "id": "string",
          "parent": {
            "id": "string",
            "parent": "string",
            "transform": {
              "angle": 0,
              "pos_x": 0,
              "pos_y": 0,
              "scale_x": 1,
              "scale_y": 1,
              "flip_x": false,
              "flip_y": false,
              "opacity": 1,
              "filters": [
                {
                  "name": "brightness",
                  "value": 0
                }
              ]
            },
            "width": 0,
            "height": 0
          },
          "transform": {
            "angle": 0,
            "pos_x": 0,
            "pos_y": 0,
            "scale_x": 1,
            "scale_y": 1,
            "flip_x": false,
            "flip_y": false,
            "opacity": 1,
            "filters": [
              {
                "name": "brightness",
                "value": 0
              }
            ]
          },
          "width": 0,
          "height": 0,
          "type": "text",
          "font_family": "string",
          "font_style": "string",
          "font_size": "string",
          "font_weight": "string",
          "content": ""
        }
      ]
    }
    }
  }
} 

export async function canvasDataToCompositeImage(canvasData) {
  const backgroundImage = canvasData.backgroundImage;

  let compositeImage = {
    ...objectToGraphic(backgroundImage),
    data_url: await getBase64FromFabricObject(backgroundImage),
    graphics: [],
  };

  compositeImage.graphics = await Promise.all(
    canvasData.getObjects().map(async (obj) => {
      switch (obj.category) {
        case "image":
          return await canvasDataToCompositeImage(obj.canvasInstance);

        case "object":
          return {
            ...objectToGraphic(obj),
            data_url: getBase64FromFabricObject(obj),
            inpainted: obj.inpainted,
            label2score: obj.label2score,
          };

        case "text":
          return {
            ...objectToGraphic(obj),
            color: obj.backgroundColor,
            content: obj.text,
            font_family: obj.fontFamily,
            font_style: obj.fontStyle,
            font_size: obj.fontSize,
            font_weight: obj.fontWeight,
          };
      }
    }
  ));

  return compositeImage;
}

function objectToGraphic(obj) {
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

export async function createCanvasFromImageCompositeImage(image) {
  const canvas = new fabric.Canvas();
  const backgroundImage = await loadFabricImage(image.data_url);
  setGraphicPropsToFabricObject(image, backgroundImage);
  canvas.set({ uid: image.id });
  canvas.setBackgroundImage(backgroundImage);
  canvas.setWidth(backgroundImage.width);
  canvas.setHeight(backgroundImage.height);
  for (const graphic of image.graphics) {
    let object;
    switch (graphic.type) {
      case "image":
        const overlayCanvas = await createCanvasFromResponseImage(graphic);
        object = await loadFabricImage(overlayCanvas.toDataURL());
        object.set({ canvasInstance: overlayCanvas });
        break;

      case "object":
        object = await loadFabricImage(toBase64Url(graphic.data_url));
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
        if (graphic.font_family) object.set({ fontFamily: graphic.font_family });
        if (graphic.font_style) object.set({ fontStyle: graphic.font_style });
        if (graphic.font_size) object.set({ fontSize: graphic.font_size});
        if (graphic.font_weight) object.set({ fontWeight: graphic.font_weight});
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
  if (object instanceof fabric.Image)
    object.applyFilters();
}
