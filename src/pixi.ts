//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let startX, startY, endX, endY;
let isDrawing = false;
let logging = false;
let logRectEvents = false;
let loadData = true;
let logEvents = false;
let resizeActive = false;
var initialMousePosX, initialMousePosY, currentMousePosY, currentMousePosX;
var initialRectWidth;
var initialRectHeight;
const rectangles = [];
const resizeHandles = [];
//end C Declare

import * as PIXI from "pixi.js";
import "@pixi/events";
import {
  createScrollBar,
  updateScrollBarPosition,
  handleResize,
} from "./stevens-functions";
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";
import { DAS, att, colors, rects, rects2 } from "./test-data";
import {
  onDragStart,
  onDragEnd,
  onDragMove,
  mouseOut,
  mouseOver,
  handleResizer,
  removeRectangle,
  addDragHand,
  addResizeHand,
  addResizeHand,
  getStartCoordinates,
  changeRectColor,
  logDrag,
  logResize,
  isResizing,
  addResizeHand,
} from "./events";
import { Graphics } from "pixi.js";
//--begin html container setup, and pixi core element setup
const imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
//--end html container setup, and pixi core element setup
PIXI.settings.ROUND_PIXELS = true;
const ele = document.getElementById(`test`);
//intialize pixi

const renderer = PIXI.autoDetectRenderer({
  //width: properties.bubble.width(),
  //height: properties.bubble.height(),
  backgroundColor: 0x2980b9,
});
const app = new PIXI.Application({ resizeTo: ele });
const mainContainer = new PIXI.Container();

mainContainer.interactive = false;
mainContainer.name = "mainContainer";

var canvasElement = mainContainer;
app.stage.addChild(mainContainer);
//var element = document.getElementById('pixi');
ele.appendChild(app.view);

//create a container for the webpage and add it to the stage
//const mainContainer = new PIXI.Container();
//app.stage.addChild(mainContainer);
//console.log(canvasElement,mainContainer);
//create a sprite for the webpage and add it to the container
let intialWebpageWidth,
  intialWebpageHeight,
  intialCanvasWidth,
  intialCanvasHeight,
  intialScale,
  webpageSprite,
  scrollBar = <PIXI.Graphics>{};

let resizeTimeout = null;

const screenshot = PIXI.Texture.fromURL(
  `${imgixBaseURL}https://dd7tel2830j4w.cloudfront.net/d110/f1667856692397x548178556679867840/d04b59ce92d6c0885e8eea753a9283e72c1e0f97d9c6c56094f211a6abbdefb2?w=${canvasElement.clientWidth}`
).then((texture) => {
  console.log(`finished the texture`);
  console.log(texture);
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;

  webpageSprite = PIXI.Sprite.from(texture);
  console.log(`finished the sprite`);
  console.log(webpageSprite);
  intialWebpageWidth = webpageSprite.width;
  intialWebpageHeight = webpageSprite.height;
  webpageSprite.intialWidth = webpageSprite.width;
  mainContainer.addChild(webpageSprite);
  mainContainer.interactive = true;
  webpageSprite.name = `webpage`;

  webpageSprite.scale.set(app.view.width / webpageSprite.width);

  intialCanvasWidth = app.view.width;
  intialCanvasHeight = app.view.height;
  intialScale = intialCanvasWidth / intialWebpageWidth;
  webpageSprite.intialScale = app.view.width / webpageSprite.width;
  scrollBar<PIXI.Graphics> = createScrollBar(mainContainer, app, ele);
  loadData ? loadDAS(DAS) : null;
});

app.renderer.on(`resize`, function (event) {
  handleResize(event, app, mainContainer, webpageSprite, intialWebpageWidth);
  updateScrollBarPosition(mainContainer, app, scrollBar);
});

//*end of scrollbar setup */

///START CHRIS CODE
//test data loaded from test-data.ts
//var DAS = properties.das;
//var att = properties.att
//var colors = properties.colors;
//declare

// Find the rectangle with the specified names
// Find the rectangle with the specified names
function findRect(name) {
  const foundRectangle = rectangles.find((r) => r.name === name);
  if (foundRectangle) {
    return foundRectangle;
  }
}
//loads & reformats Drawn Attribute Snippets
function loadDAS(das) {
  das.forEach((das, index) => {
    //var rect = Object.values(das);
    //console.log(rect);
    //will need placeholder for color. may need to generate specific
    let createCoord = getStartCoordinates(
      das["X Coordinate (500)"],
      das["Y Coordinate (500)"],
      das["Box Width 250"],
      das["Box Height 250"]
    );
    logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

    createRectangle(createCoord, "DE3249", "temp");
    //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
  });
}
function createRectangle(createCoord, c, id) {
  // Create a new rectangle graphic using the calculated dimensions
  isDrawing = false;

  //let createCoord = getStartCoordinates(startX,startY,endX,endY);
  logging ? console.log("createCoord", createCoord) : null;

  // Create a new rectangle graphic using the calculated dimensions
  const rectangle = new PIXI.Graphics();
  rectangle.beginFill(0xffff00, 0.5);
  rectangle.labelColor = "0x" + c;
  rectangle.oldColor = "0xFFFF00";
  rectangle.drawRect(
    createCoord.startRectX,
    createCoord.startRectY,
    createCoord.width,
    createCoord.height
  );
  rectangle.endFill();
  rectangle.interactive = false;
  rectangle.dragging = false;
  rectangle.name = Math.random().toString(16).substr(2, 8); //id;
  rectangle.intialScale = app.view.width / intialWebpageWidth;
  rectangle.buttonMode = true;
  rectangle.resizingRadius = false;
  rectangle.sortSize = createCoord.width * createCoord.height;
  rectangle.myRectanglePosition = [
    createCoord.startRectX,
    createCoord.startRectY,
    createCoord.width,
    createCoord.height,
  ];

  rectangle.cursor = "hand";
  rectangles.push(rectangle);

  mainContainer.addChild(rectangle);

  const x = rectangle.position.x;
  const y = rectangle.position.y;
  addLabel(rectangle);
  resizeActive ? addResizeHand(rectangle) : null;
  addDragHand(rectangle, rectangles);
}

//image loader
function loadImage(im) {
  let ss = PIXI.Texture.from(im);
  let wpSprite = PIXI.Sprite.from(ss);
  wpSprite.interactive = true;
  // Add the image back to the container
  mainContainer.addChild(wpSprite);
}
//adds a label PLACEHOLDER
function addLabel(rect) {
  const label = new PIXI.Text(rect.name, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x000000,
  });
  label.position.set(
    rect.getBounds().x + 20 - mainContainer.position.x,
    rect.getBounds().y + 20 - mainContainer.position.y
  );
  logging ? console.log("label", rect, rect.getBounds()) : null;
  rect.addChild(label);
}
//Listeners

mainContainer.on("pointerup", (event) => {
  logEvents
    ? console.log("pointerup", event.target.name, "start", startX, startY)
    : null;
  if (event.target.name == "dragHandle") {
    isDrawing = false;
    event.target.parent.selected = false;
    onDragEnd(event, event.target.parent, rectangles);
    logDrag
      ? console.log(
          "pointerup-DragEvent,target,target-parent",
          event.target.name,
          event.target.parent.name
        )
      : null;
    mainContainer.off("pointermove");
    return;
  }
  if (event.target.name == "resizeHandle") {
    onDragStartH(event);
    return;
  }
  if (event.target.name == "mainContainer" && event.target.isDrawing) {
    //stop if comes from reset
    if (startX == 0 && startY == 0) {
      eventReset();
      return;
    }

    mainContainer.isDrawing = false;
    rectangles.forEach((r) => (r.selected = false));
    logging
      ? console.log("main-Cont-pointerUp", mainContainer.isDrawing)
      : null;
    mainContainer.off("pointermove");
    // Clear the stage
    isDrawing = false;
    mainContainer.removeChildren();

    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Add all previously added rectangles back to the stage
    rectangles.forEach((r) => mainContainer.addChild(r));

    let createCoord = getStartCoordinates(startX, startY, endX, endY);
    logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 40) {
      eventReset();
      return;
    }
    if (createCoord.height < 40) {
      eventReset();
      return;
    }

    createRectangle(createCoord, "DE3249", "temp");
    eventReset();
    return;
  }

  eventReset();
  logEvents
    ? console.log("pointerup", event.target.name, "start", startX, startY)
    : null;
});

mainContainer.on("pointerdown", (event) => {
  logDrag
    ? console.log(
        "pointerdown-Event,target,target-parent",
        event.target.name,
        event.target.parent.name
      )
    : null;
  if (event.target.name == "dragHandle") {
    event.target.parent.selected = true;
    event.target.isDrawing = false;
    onDragStart(event, event.target.parent, rectangles);
    wrapPointermove(event, event.target.parent);
    return;
  }
  if (event.target.name == "resizeHandle") {
    event.target.parent.resizing = true;
    isDrawing = false;
    onDragStartH(event);
    return;
  }
  // Check if the mouse is over any of the rectangles
  if (event.target.name == "mainContainer") {
    logging ? console.log("listener pointerdown-mainCont") : null;
    event.target.isDrawing = true;
    startX = event.global.x - mainContainer.position.x;
    startY = event.global.y - mainContainer.position.y;
    endX = event.global.x - mainContainer.position.x;
    endY = event.global.y - mainContainer.position.y;

    wrapPointermove(event);
    return;
  }
});
/*
mainContainer.on("mouseup", (event) => {
  if (event.target.name == "dragHandle") {
    isDrawing = false;
    event.target.parent.selected = false;
    onDragEnd(event,event.target.parent,rectangles);
    logDrag ? console.log("mouseup-DragEvent,target,target-parent", event.target.name, event.target.parent.name ) : null;
    mainContainer.off("pointermove");
  }
  if (event.target.name == "resizeHandle") return;
  if (event.target.name == "mainContainer" && event.target.isDrawing) {
    event.target.isDrawing = false;
    rectangles.forEach((r) => (r.selected = false));
    logging ? console.log("main-Cont-Lmouseup") : null;
    mainContainer.off("pointermove");
    // Clear the stage
  isDrawing = false;
  mainContainer.removeChildren();

  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

    // Add all previously added rectangles back to the stage
    rectangles.forEach((r) => mainContainer.addChild(r));

  //let createCoord = getStartCoordinates(startX,startY,endX,endY);
  logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

    createRectangle(createCoord, "DE3249", "temp");
}
eventReset();
});
*/
function eventReset() {
  rectangles.forEach((r) => (r.dragging = false));
  rectangles.forEach((r) => changeRectColor(r, r.oldColor));
  rectangles.forEach((r) => (r.resizing = false));
  resizeHandles.forEach((r) => r.off("pointermove"));
  mainContainer.off("pointermove");
  mainContainer.isDrawing = false;
}

function wrapPointermove(event) {
  event.target.on("pointermove", (event) => {
    logDrag ? console.log("pmactive", event.target.name) : null;
    if (event.target.name == "dragHandle") {
      onDragMove(event, event.target.parent, rectangles);
      logDrag
        ? console.log(
            "pointermove-DragEvent,target,target-parent",
            event.target.name,
            event.target.parent.name
          )
        : null;
      app.render(app.stage);
      return;
    }
    if (event.target.name == "resizeHandle") return;
    if (event.target.name == "mainContainer" && event.target.isDrawing) {
      logDrag
        ? console.log(
            "pointermove-mainContainer,target,target-parent",
            event.target.name
          )
        : null;
      // Clear the stage
      mainContainer.removeChildren();
      // Add the image back to the stage
      mainContainer.addChild(webpageSprite);

      // Calculate the current position of the pointer
      endX = event.global.x - mainContainer.position.x;
      endY = event.global.y - mainContainer.position.y;

      // Calculate the dimensions of the rectangle
      let coordinates = getStartCoordinates(startX, startY, endX, endY);
      //logging ? console.log("coord", coordinates) : null;

      // Create a new rectangle graphic using the calculated dimensions
      const rectangle = new PIXI.Graphics();
      rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
      rectangle.drawRect(
        coordinates.startRectX,
        coordinates.startRectY,
        coordinates.width,
        coordinates.height
      );
      rectangle.endFill();

      // Add the rectangle to the stage
      mainContainer.addChild(rectangle);

      // Add all previously added rectangles back to the stage
      rectangles.forEach((r) => mainContainer.addChild(r));
    }
  });
}

function addResizeHand(rectangle) {
  const png = PIXI.Texture.from(
    `https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true`
  );
  const handle = PIXI.Sprite.from(png);
  handle.interactive = true;
  var handlePosAdjustX = 40;
  var handlePosAdjustY = 40;
  var scaleHandle = 0.75;
  handle.position.set(
    rectangle.myRectanglePosition[0] +
      rectangle.myRectanglePosition[2] -
      handlePosAdjustX,
    rectangle.myRectanglePosition[1] +
      rectangle.myRectanglePosition[3] -
      handlePosAdjustY
  );
  //console.log("rectBounds",(rectangle.myRectanglePosition[0] + rectangle.myRectanglePosition[2] - handlePosAdjustX), (rectangle.myRectanglePosition[1] + rectangle.myRectanglePosition[3] - handlePosAdjustY));
  const hitArea = new PIXI.Rectangle(0, 0, 64 * scaleHandle, 64 * scaleHandle);
  handle.hitArea = hitArea;
  handle.buttonMode = true;
  handle.name = "resizeHandle";
  logResize ? console.log("handle-hitarea", hitArea) : null;
  handle.scale.set(scaleHandle, scaleHandle);
  resizeHandles.push(handle);
  rectangle.addChild(handle);
  /*handleEvents(handle, rectangle);
  handle
    .on("pointerdown", function (e) {
      rectangle.resizing = true;
      isDrawing = false;
      onDragStartH(e,rectangle);
    })
    .on('pointermove', function(e){
      rectangle.resizing = true;
      isDrawing = false;
      onDragMoveH(e,rectangle);
  }) 
    .on("pointerup", function (e) {
      isDrawing = false;
      rectangle.resizing = false;
      onDragEndH(e,rectangle);
    })
    .on('pointerupoutside', function(e){
      isDrawing = false;
      rectangle.resizing = false;
      onDragEndH(e,rectangle);
      }) 
      */
}

/*
function handleEvents (handle, rectangle) {
  handle.interactive = true;
  handle.on('pointerdown', (e) => {
    console.log(`handleEventsStartH`);
    onDragStartH(e, rectangle, handle);
    e.stopPropagation();
  })
      //.on('mousemove', onDragMove)
}
*/
// mousedown event listener
function onDragStartH(event) {
  event.target.parent.interactive = true;

  initialMousePosX = event.target.parent.x;
  initialMousePosY = event.target.parent.y;
  initialRectWidth = event.target.parent.width;
  initialRectHeight = event.target.parent.height;
  //isResizing = true;.tgppare
  //console.log("dragStartH",isDrawing,event.target.parent.name);
  event.target.on("pointermove", function (event) {
    event.target.parent.resizing = true;
    isDrawing = false;
    onDragMoveH(event);
  });
}

// mousemove event listener
function onDragMoveH(event) {
  /*
  mainContainer.removeChildren();
      // Add the image back to the stage
      mainContainer.addChild(webpageSprite);

      // Calculate the current position of the pointer
      endX = event.global.x - mainContainer.position.x;
      endY = event.global.y - mainContainer.position.y;

      // Calculate the dimensions of the rectangle
      let coordinates = getStartCoordinates(event.target.parent.x, event.target.parent.y, endX, endY);
      //logging ? console.log("coord", coordinates) : null;

      // Create a new rectangle graphic using the calculated dimensions
      const rectangle = new PIXI.Graphics();
      rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
      rectangle.drawRect(
          coordinates.startRectX,
          coordinates.startRectY,
          coordinates.width,
          coordinates.height
      );
      rectangle.endFill();

      // Add the rectangle to the stage
      mainContainer.addChild(rectangle);

      // Add all previously added rectangles back to the stage
      rectangles.forEach((r) => mainContainer.addChild(r));
  
    currentMousePosX = event.data.global.x;
    currentMousePosY = event.data.global.y;
    var deltaX = currentMousePosX - initialMousePosX;
    var deltaY = currentMousePosY - initialMousePosY;
    logResize ? console.log(event.data,"initialMouse", initialMousePosX,initialMousePosY,"initialRect", initialRectWidth,initialRectHeight,"currentMouse",
    currentMousePosX,currentMousePosY,"currentRectSizes",event.target.parent.width,event.target.parent.height,event.data.originalEvent) : null;
    //event.target.parent.width = initialRectWidth + deltaX;
    //event.target.parent.height = initialRectHeight + deltaY;
    event.target.parent.x += event.data.originalEvent.movementX;
    event.target.parent.y += event.data.originalEvent.movementX;

    logResize ? console.log("initialMouse", initialMousePosX,initialMousePosY,"initialRect", initialRectWidth,initialRectHeight,"currentMouse",
    currentMousePosX,currentMousePosY,"currentRectSizes",event.target.parent.width,event.target.parent.height,event.data.originalEvent) : null;
    event.target.x =  event.target.parent.width - event.target.width/2;
    event.target.y = event.target.parent.height - event.target.height/2;
*/
  // Clear the stage
  /*mainContainer.removeChildren();

  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

  // Calculate the current position of the pointer
  var endX = event.global.x - mainContainer.position.x;
  var endY = event.global.y - mainContainer.position.y;

  // Calculate the dimensions of the rectangle
  let coordinates = getStartCoordinates(rect.myRectanglePosition[0], rect.myRectanglePosition[1], endX, endY);
  logResize ? console.log("coord", coordinates) : null;

  // Create a new rectangle graphic using the calculated dimensions
  
 
  const rectangle = new PIXI.Graphics();
  rectangle.name = rect.name;
  rectangle.intialScale = app.view.width / intialWebpageWidth;
  rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
  rectangle.drawRect(
    coordinates.startRectX,
    coordinates.startRectY,
    coordinates.width,
    coordinates.height
  );
  rectangle.endFill();
  removeRectangle(rect, rectangles);

  // Add the rectangle to the stage
  rectangles.push(rectangle);
  //let rectanglesSorted = reorderRectangles(rectangles);
  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));
  //rectanglesSorted.forEach((r) => mainContainer.addChild(r));
  //rectanglesSorted.forEach((r) => console.log(r.sortSize));
  */
  logging ? console.log("resizemove") : null;
}

// mouseup event listener
function onDragEndH(event) {
  event.target.parent.resizing = false;
  event.target.off("pointermove");
  //this.interactive = false;
  logDrag ? console.log("ResizeEnd", event.target.parent.resizing) : null;
}

function reorderRectangles(rectangles) {
  rectangles.sort((a, b) => {
    return a.sortSize - b.sortSize;
  });
}
