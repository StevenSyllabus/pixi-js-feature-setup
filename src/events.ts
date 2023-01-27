//drag events
//@ts-nocheck
let logDrag = false;
let logResize = true;
let isDrawing = false;
let isResizing = false;

import * as PIXI from "pixi.js";
export { logDrag, logResize, isResizing };

export function onDragStart(e, rectangle, rectangles) {
  const mousePosition = e.data.global;
  //rectangle.interactive = true; // Make the rectangle interactive
  //check for resize
  if (rectangle.resizing) {
    logResize ? console.log("resizing active", mousePosition) : null;
    return;
  }
  logDrag ? console.log("mousePosition", mousePosition) : null;
  logDrag
    ? console.log("myRectanglePosition", rectangle.myRectanglePosition)
    : null;
  if (
    mousePosition.x - rectangle.myRectanglePosition[0] < 30 &&
    mousePosition.y - rectangle.myRectanglePosition[1] < 30
  ) {
    logDrag ? console.log("Resizing Radius") : null;
    //rectangle.resizingRadius=true
    //rectangle.dragging = true;
    rectangle.draggingOffset = [
      mousePosition.x - rectangle.myRectanglePosition[0],
      mousePosition.y - rectangle.myRectanglePosition[1],
    ];
  } else {
    //logDrag ? console.log('Dragging') : null;
    rectangle.dragging = true;
    rectangle.draggingOffset = [
      mousePosition.x - rectangle.myRectanglePosition[0],
      mousePosition.y - rectangle.myRectanglePosition[1],
    ];
  }
}

export function onDragEnd(e, rectangle, rectangles) {
  //rectangle.selected = false;
  changeRectColor(rectangle, rectangle.labelColor);
  rectangles.forEach((r) => (r.selected = false));
  logDrag
    ? console.log(
        "DragEnd,color,interactive,selected",
        rectangle.labelColor,
        rectangle.interactive,
        rectangle.selected
      )
    : null;
}

export function onDragMove(e, rectangle, rectangles) {
  //const mousePosition = e.data.global;
  if (rectangle.selected != true) return;

  //logDrag ? console.log('DraggingMove',rectangle.selected,rectangle) : null;

  rectangle.position.x += e.data.originalEvent.movementX;
  rectangle.position.y += e.data.originalEvent.movementY;
  /*let createCoord = getStartCoordinates(rectangle._bounds.minX, rectangle._bounds.minY, rectangle.myRectanglePosition[2], rectangle.myRectanglePosition[3]);
  rectangle.myRectanglePosition = [
    createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height
];
console.log("createCoord",rectangle._bounds.minX, rectangle._bounds.minY, rectangle.myRectanglePosition[2], rectangle.myRectanglePosition[3]);
console.log("myRectPos", rectangle.myRectanglePosition);
*/
}
export function changeRectColor(sq, color) {
  logDrag ? console.log("changeColor") : null;
  const square = sq;
  logDrag ? console.log(square) : null;
  sq.clear();
  sq.beginFill(color, 0.5);
  sq.lineStyle(square.lineStyle);
  sq.drawRect(
    square.myRectanglePosition[0],
    square.myRectanglePosition[1],
    square.myRectanglePosition[2],
    square.myRectanglePosition[3]
  );
  logDrag
    ? console.log(
        "squareDeets",
        square.myRectanglePosition[0],
        square.myRectanglePosition[1],
        square.myRectanglePosition[2],
        square.myRectanglePosition[3]
      )
    : null;
  sq.endFill();
}

//function for drawing in different directions
export function getStartCoordinates(startX, startY, endX, endY) {
  var width, height, startRectX, startRectY;
  startX < endX ? (width = endX - startX) : (width = startX - endX);
  startY < endY ? (height = endY - startY) : (height = startY - endY);
  startX < endX ? (startRectX = startX) : (startRectX = endX);
  startY < endY ? (startRectY = startY) : (startRectY = endY);
  return { startRectX, startRectY, width, height };
}

export function addDragHand(rectangle, rectangles) {
  const png = PIXI.Texture.from(
    `https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png`
  );
  const handle = PIXI.Sprite.from(png);
  handle.interactive = true;
  var handlePosAdjustX = -30;
  var handlePosAdjustY = 0;
  var scaleHandle = 0.75;
  handle.position.set(
    rectangle.myRectanglePosition[0] +
      rectangle.myRectanglePosition[2] +
      handlePosAdjustX,
    rectangle.myRectanglePosition[1] + handlePosAdjustY
  );
  //console.log("rectBounds",(rectangle.myRectanglePosition[0] + rectangle.myRectanglePosition[2] - handlePosAdjustX), (rectangle.myRectanglePosition[1] + rectangle.myRectanglePosition[3] - handlePosAdjustY));
  const hitArea = new PIXI.Rectangle(0, 0, 64 * scaleHandle, 64 * scaleHandle);
  handle.hitArea = hitArea;
  handle.buttonMode = true;
  logResize ? console.log("handle-hitarea", hitArea) : null;
  handle.scale.set(scaleHandle, scaleHandle);
  rectangle.addChild(handle);
  //handleEvents(handle, rectangle);
  handle
    .on("pointerdown", function (e) {
      rectangle.selected = true;
      isDrawing = false;
      onDragStart(e, rectangle, rectangles);
    })
    .on("pointermove", function (e) {
      onDragMove(e, rectangle, rectangles);
    })
    .on("pointerup", function (e) {
      isDrawing = false;
      rectangle.selected = false;
      onDragEnd(e, rectangle, rectangles);
    })
    .on("pointerupoutside", function (e) {
      isDrawing = false;
      rectangle.selected = false;
      onDragEnd(e, rectangle, rectangles);
    });
}

export function handleResizerRect(
  e,
  rectangle,
  mainContainer,
  rectangles,
  webpageSprite
) {
  logResize
    ? console.log("handle-resizer", rectangle, rectangle.resizing)
    : null;
  if (isResizing) {
    // Clear the stage
    mainContainer.removeChildren();
    const rect = new PIXI.Graphics();
    rect.name = rectangle.name;
    removeRectangle(rectangle, rectangles);
    rectangle.clear();

    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Calculate the current position of the pointer
    let endX = e.globalX;
    let endY = e.globalY;
    logResize ? console.log("handle-endX-endY", endX, endY) : null;
    // Calculate the dimensions of the rectangle
    let coordinates = getStartCoordinates(
      rectangle.myRectanglePosition[0],
      rectangle.myRectanglePosition[1],
      endX,
      endY
    );
    logResize ? console.log("handle-coordinates", coordinates) : null;
    // Create a new rectangle graphic using the calculated dimensions

    rect.beginFill(0x0000ff, 0.5); // Transparent blue
    rect.drawRect(
      coordinates.startRectX,
      coordinates.startRectY,
      coordinates.width,
      coordinates.height
    );
    rect.endFill();
    // Add the rectangle to the stage
    //mainContainer.addChild(rect);
    rectangles.push(rect);
    // Add all previously added rectangles back to the stage

    rectangles.forEach((r) => mainContainer.addChild(r));
  }
}
export function handleResizerRect2(
  e,
  rectangle,
  mainContainer,
  rectangles,
  webpageSprite
) {
  var initialMousePosX = rectangle.myRectanglePosition[0];
  var initialMousePosY = rectangle.myRectanglePosition[1];
  var currentMousePosY, currentMousePosX;
  var initialRectWidth = rectangle.width;
  var initialRectHeight = rectangle.height;
  var currentMousePosX = e.data.global.x;
  var currentMousePosY = e.data.global.y;
  var deltaX = currentMousePosX - initialMousePosX;
  var deltaY = currentMousePosY - initialMousePosY;
  rectangle.width = initialRectWidth + deltaX;
  rectangle.height = initialRectHeight + deltaY;
  //handle.x = rectangle.width - handle.width/2;
  //handle.y = rectangle.height - handle.height/2;
  console.log("dragMove", isDrawing);
}

export function removeRectangle(rectangle, array) {
  logResize
    ? console.log(
        "removeRectangle",
        array.filter((rect) => rect.name == rectangle.name)
      )
    : null;
  array = array.filter((rect) => rect.name != rectangle.name);
  return array;
}
