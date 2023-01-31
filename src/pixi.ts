//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let startX, startY, endX, endY;
let isDrawing = false;
let logging = true;
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
  ticker
} from "./events";
export { reDraw, mainContainer,webpageSprite, rectangles, app};
import { Graphics } from "pixi.js";
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

  webpageSprite.scale.set(app.view.width / webpageSprite.width);

  intialCanvasWidth = app.view.width;
  intialCanvasHeight = app.view.height;
  intialScale = intialCanvasWidth / intialWebpageWidth;
  webpageSprite.intialScale = app.view.width / webpageSprite.width;
  scrollBar<PIXI.Graphics> = createScrollBar(mainContainer, app, ele);
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
      das["X Coordinate (960)"],
      das["Y Coordinate (960)"],
      das["Box Width 250"] * 3 ,
      das["Box Height 250"] * 3
    );
    logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

    createRectNew(createCoord, "DE3249", "temp");
    //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
  });
}


function createRectNew(createCoord, c, id){
  // Create graphics
  let currentRectangle = new PIXI.Graphics()
                      .beginFill(c, 0.5)
                      // returns initial graphis so we can daizy chaing
                      .lineStyle({ color: 0x111111, alpha: 0, width: 1 })
                      // we create rect in orgin for calculation simplification
                      .drawRect(createCoord.startRectX,
                        createCoord.startRectY,
                        createCoord.width,
                        createCoord.height)
                      .endFill()
                      currentRectangle.beginFill(0xffff00, 0.5);
                      currentRectangle.labelColor = "0x" + c;
                      currentRectangle.oldColor = "0xFFFF00";
  
  // then we move it to final position
  currentRectangle.name = Math.random().toString(16).substr(2, 8); //id;
  currentRectangle.intialScale = app.view.width / intialWebpageWidth;
  currentRectangle.position.copyFrom(new PIXI.Point(100,100))
  addLabel(currentRectangle);
  app.stage.addChild(currentRectangle)
  // make it hoverable
  currentRectangle.interactive = true;
  currentRectangle
      .on('pointerover', onRectangleOver)
      .on('pointerout', onRectangleOut);
  // remove it from current ceration and chose new color for next one
  currentRectangle = null
  rectangles.push(currentRectangle);
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
    fontFamily: "Inter",
    fontSize: 24,
    fill: 0x000000
  });
  label.position.set(label.position.x + 10, label.position.y + 10);
  logging ? console.log("label", rect, rect.getBounds()) : null;
  rect.addChild(label);
}
//Listeners
/*
app.stage.on("pointerup", (event) => {
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

app.stage.on("pointerdown", (event) => {
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

function reDraw() {
  mainContainer.removeChildren();
  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);
  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));
}
loadData ? loadDAS(DAS) : null;
//ticker.start();


/////////////////////NEW DRAWING
// Input modes for input
let InputModeEnum = {
  create: 1,
  select: 2,
  scale: 3,
  move: 4
}

// Create our application instance
/*
var app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x2c3e50
});

document.body.appendChild(app.view);
// Make main canvas interactable to tract events
*/
app.stage.interactive = true;
app.stage.hitArea = app.screen;

// Load textures for edit
const hrefMove = "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png"
const hrefScale = "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true"
const textureMove = PIXI.Texture.from(hrefMove);
const textureScale = PIXI.Texture.from(hrefScale);

// Start position of events
let startPosition = null
// Random color for next rect drawing
let currentColor =   0xffff00;

// Current edited or created rectangle
let currentRectangle = null;
// Set mode for whole input (by default we create rectangles)
let inputMode = InputModeEnum.create;

// Pointer to current active controll (Move or Scale icon)
let dragController = null;
// Active shown controls (can be shown both or one hovered / active)
let controls = [];

// Function that generates first rect (shows all steps needed for that)
function generateFirstRect(){
  // Create graphics
  currentRectangle = new PIXI.Graphics()
                      .beginFill(currentColor, 0.5)
                      // returns initial graphis so we can daizy chaing
                      .lineStyle({ color: 0x111111, alpha: 0, width: 1 })
                      // we create rect in orgin for calculation simplification
                      .drawRect(0,0,100,100)
                      .endFill()
  // then we move it to final position
  currentRectangle.labelColor = "0x";
  currentRectangle.oldColor = "0xFFFF00";
  currentRectangle.name = "0xFFFF00";
  currentRectangle.position.copyFrom(new PIXI.Point(100,100))
  addLabel(currentRectangle);
  app.stage.addChild(currentRectangle)
  // make it hoverable
  currentRectangle.interactive = true;
  currentRectangle
      .on('pointerover', onRectangleOver)
      .on('pointerout', onRectangleOut);
  // remove it from current ceration and chose new color for next one
  currentRectangle = null
  currentColor = Math.random() * 0xFFFFFF
}
//generateFirstRect()

app.stage.on('pointerdown', (e) => {
  // Initiate rect creation
  console.log(inputMode)
  if(inputMode == InputModeEnum.create)
      startPosition = new PIXI.Point().copyFrom(e.data.global)
      logging ? console.log("pointerdown",startPosition) : null;
});

app.stage.on('pointermove', (e) => {
  // Do this routine only if in create mode and have started creation
  // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
  if(inputMode == InputModeEnum.create && startPosition){
      // get new global position from event
      let currentPosition = e.data.global;
      let {start, size} = getStartAndSize(currentPosition, startPosition)
      if(size.x > 5 && size.y > 5){
          if(!currentRectangle){
             currentRectangle = new PIXI.Graphics()
                  .beginFill(currentColor, .5)
                  .lineStyle({ color: 0xFFFF00, alpha: 0.5, width: 1 })
                  .drawRect(0,0,size.x,size.y)
                  .endFill()
                  currentRectangle.labelColor = "0x";
                  currentRectangle.oldColor = "0xFFFF00";
                  currentRectangle.name = "0xFFFF00";
                  currentRectangle.position.copyFrom(start)
                  addLabel(currentRectangle);
              app.stage.addChild(currentRectangle)
          }
          else {
              scaleRectB(currentRectangle,currentPosition)
          }
      } else {
          if(currentRectangle){
              app.stage.removeChild(currentRectangle);
              currentRectangle = null
          }
      }

  }
});

app.stage.on('pointerup', (e) => {
  // Wrap up rect creation
  startPosition = null
  if(currentRectangle && currentRectangle.interactive == false){
      currentRectangle.interactive = true;
      currentRectangle
      // Mouse & touch events are normalized into
      // the pointer* events for handling different
      // Rectangle events.
          .on('pointerover', onRectangleOver)
          .on('pointerout', onRectangleOut);
  }
  currentRectangle = null
  currentColor = Math.random() * 0xFFFFFF
  onDragEndNew()
});

function controlOver(){
  this.isOver = true;
}
function controlOut(){
  this.isOver = false;
  removeIfUnused(this)
}
function onRectangleOver() {
  // Do not hover rectangle if we are moving
  if(inputMode == InputModeEnum.move || inputMode == InputModeEnum.scale){
      return
  }
  // Do not hover rectangle if we creating
  if(inputMode == InputModeEnum.create && startPosition){
      return
  }
  console.log("Over")
  this.isOver = true;
  inputMode = InputModeEnum.select
  // set current hovered rect to be on the top
  bringToFront(this)
  // Create button move
  const buttonMove = new PIXI.Sprite(textureMove);
  // Make make its codinate to be at center of sprite
  // Usualy it is in top left corner but this suit su better
  buttonMove.anchor.set(0.5);
  // Set controll top right
  buttonMove.x = this.x + this.width - 18;
  buttonMove.y = this.y + 23;

  // make the buttonMove interactive...
  buttonMove.interactive = true;
  buttonMove.cursor = 'pointer';
  // Add coresponding events
  // pass alternative this object to pointerdown event
  // so we know which controll is pressed
  buttonMove.on('pointerover', controlOver)
          .on('pointerout', controlOut)
          .on('pointerdown', onDragStartNew, {
              controller: buttonMove,
              edit: this,
              mode: InputModeEnum.move
              });
  app.stage.addChild(buttonMove);
  // add to controls queue
  controls.push(buttonMove);

  const buttonScale = new PIXI.Sprite(textureScale);
  // same as for move but on bottom right corner
  buttonScale.anchor.set(0.5);
  buttonScale.x = this.x + this.width - 20;
  buttonScale.y = this.y + this.height - 20;

  // make the buttonScale interactive...
  buttonScale.interactive = true;
  buttonScale.cursor = 'pointer';
  buttonScale.on('pointerover', controlOver)
          .on('pointerout', controlOut)
          .on('pointerdown', onDragStartNew, {
              controller: buttonScale,
              edit: this,
              mode: InputModeEnum.scale
              });

  app.stage.addChild(buttonScale);
  controls.push(buttonScale);
}
function cleanupcontrols(){
  controls = controls.filter(el=>el.parent)
  if(controls.length == 0){
      onDragEndNew()
  }
}

function removeIfUnused(controll){
  // Give time to PIXI to go trough events and add event on end
      setTimeout(()=>{ 
          // By this time isOver is updated so if we went from
          // square to conntroll controll.isOver become true
          // if we are draging controll and went out of it
          // we dont remove it because it is still used
          if(!controll.isOver && controll !== dragController){
              app.stage.removeChild(controll);
              cleanupcontrols()
          }
      },0)
}
// Event is triggered when we move mouse out of rectangle
function onRectangleOut() {
  this.isOver = false;
  console.log("OUT");
  controls.forEach(el=>removeIfUnused(el))
}
// Normalise start and size of square
// so we allways have top left corenr as start and size is allways positive
function getStartAndSize(pointA, pointB){
  let deltaX = pointB.x - pointA.x;
  let deltaY = pointB.y - pointA.y;
  let absDeltaX = Math.abs(deltaX)
  let absDeltaY = Math.abs(deltaY)
  let startX = deltaX > 0 ? pointA.x : pointB.x
  let startY = deltaY > 0 ? pointA.y : pointB.y
  return { start: new PIXI.Point(startX, startY),
      size: new PIXI.Point(absDeltaX, absDeltaY)
      }
}
function scaleRectB(resizeRectange, currentPosition){
  let {start, size} = getStartAndSize(startPosition, currentPosition)
  if(size.x<5 || size.y<5) return
  // When we scale rect we have to give it new cordinates so we redraw it
  // in case of sprite we would do this a bit differently with scale property,
  // for simple geometry this is better solution because scale propagates to children
  resizeRectange.clear()
  resizeRectange.position.copyFrom(start)
  resizeRectange.beginFill(currentColor, .5)
      .lineStyle({ color: 0x111111, alpha: 0.5, width: 1 })
      .drawRect(0,0,size.x,size.y)
      .endFill()
}


function scaleRect(resizeRectange, dragController ){
  //currentPosition){
  let {start, size} = getStartAndSize(startPosition, dragController.position)
  if(size.x<5 || size.y<5) return
  // When we scale rect we have to give it new cordinates so we redraw it
  // in case of sprite we would do this a bit differently with scale property,
  // for simple geometry this is better solution because scale propagates to children

  let startPositionController = new PIXI.Point(dragController.position.x - 20, dragController.position.y - 20);
  resizeRectange.clear()
  resizeRectange.position.copyFrom(start)
  resizeRectange.beginFill(currentColor, .5)
      .lineStyle({ color: 0x111111, alpha: 0.5, width: 1 })
      .drawRect(0,0,size.x,size.y)
      .endFill()

      dragController.position.copyFrom(startPositionController)
}

function moveRect(resizeRectange, dragController){
  // Move control is on right side
  // and our rect is anchored on the left we substact width of rect
  let startPosition = new PIXI.Point(dragController.position.x - resizeRectange.width, dragController.position.y);
  let startPositionController = new PIXI.Point(dragController.position.x - 18, dragController.position.y + 23);
  // we just move the start position
  resizeRectange.position.copyFrom(startPosition)
  dragController.position.copyFrom(startPositionController)
}

function onDragMoveNew(event) {
  if (dragController) {
      // move control icon (move or scale icon)
      dragController.parent.toLocal(event.data.global, null, dragController.position);
      if(inputMode == InputModeEnum.scale){
          // handle rect scale
          scaleRect(currentRectangle,dragController)
      }
      if(inputMode == InputModeEnum.move){
          // handle rect move
          moveRect(currentRectangle,dragController)
      }
  }
}

function onDragStartNew() {
  // start drag of controller
  // and set parameters
  this.controller.alpha = 0.5;
  dragController = this.controller;
  currentRectangle = this.edit
  startPosition = new PIXI.Point().copyFrom(this.edit.position)
  inputMode = this.mode
  app.stage.on('pointermove', onDragMoveNew);
}

function onDragEndNew() {
  // stop drag, remove parameters
  // return input mode to default
  if(dragController){
      app.stage.off('pointermove', onDragMoveNew);
      dragController.alpha = 1;
      currentRectangle = null;
      dragController = null;
  }
  startPosition = null;
  inputMode = InputModeEnum.create;
}

app.stage.on('pointerupoutside', onDragEndNew);

console.log("reload")

function bringToFront(sprite) {var sprite = (typeof(sprite) != "undefined") ? sprite.target || sprite : this;var parent = sprite.parent || {"children": false};if (parent.children) {    for (var keyIndex in sprite.parent.children) {         if (sprite.parent.children[keyIndex] === sprite) {            sprite.parent.children.splice(keyIndex, 1);            break;        }    }    parent.children.push(sprite);}}
