//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let startX, startY, endX, endY;
let isDrawing = false;
let logging = true;
let logRectEvents = true;
let loadData = true;
var initialMousePosX,initialMousePosY,currentMousePosY,currentMousePosX;
var initialRectWidth;
var initialRectHeight;
const rectangles = [];
//end C Declare

import * as PIXI from "pixi.js";
import "@pixi/events";
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
  getStartCoordinates,
  changeRectColor,
  logDrag,
  logResize,
  isResizing,
  addResizeHand
} from "./events";
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
const app = new PIXI.Application({ resizeTo: window });
const mainContainer = new PIXI.Container();

mainContainer.interactive = false;

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
  webpageSprite;

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
  createScrollBar(mainContainer);
});

app.renderer.on(`resize`, handleResize);

function handleResize(e) {
  const intialSize = app.view.width;
  console.log(`resize`);
  webpageSprite.scale.set(app.view.width / intialWebpageWidth);
  mainContainer.children.forEach((child) => {
    child.scale.set(app.view.width / intialWebpageWidth);
    console.log(`child.intialWidth: ${child.intialWidth}`);
  });
  //optional timeout to prevent the resize from firing too many times
  clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(() => {
    console.log(`resize timeout`);
    console.log(app.view.width / webpageSprite.intialWidth);
  }, 100);
}

function createScrollBar(mainContainer) {
  const maxScroll = mainContainer.height - app.view.height;
  const scrollbar = new PIXI.Graphics();
  let scrolling = false;
  let scrollingTimeout = null;
  scrollbar.interactive = true;

  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(
    app.view.width - 8,
    0,
    14,
    app.view.height * (app.view.height / mainContainer.height)
  );

  scrollbar.endFill();

  scrollbar.addEventListener("pointerdown", (e) => {
    const scrollPercent = -mainContainer.position.y / maxScroll;
    const scrollbarHeight =
      app.view.height * (app.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
    ele.pressed = true;
    scrollbar.lastY = e.data.global.y;
    scrollbar.lastMouseY = e.client.y;
    console.log(e.client.y);

    scrollbar.lastTop = scrollbarY;
  });

  scrollbar.addEventListener("pointerup", (e) => {
    console.log(`scrollbar pointerup`);
    ele.pressed = false;
    console.log(ele.pressed);
  });

  scrollbar.addEventListener("pointerupoutside", (e) => {
    console.log(`scrollbar pointerupoutside`);
    ele.pressed = false;
    console.log(ele.pressed);
  });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (ele.pressed) {
        const scrollPercent = -mainContainer.position.y / maxScroll;
        console.log(`scrollPercent: ${scrollPercent}`);

        const scrollbarHeight =
          app.view.height * (app.view.height / mainContainer.height);
        const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
        //this mousedif is way wrong. It should be the difference between the mouse's y position and the scrollbar's y position

        const mouseDif = e.y - scrollbar.lastMouseY;
        console.log(mouseDif);

        const newTop = mouseDif + scrollbar.lastTop;
        const scrollPercent2 = newTop / (app.view.height - scrollbarHeight);
        const newScroll = Math.max(-scrollPercent2 * maxScroll);

        if (scrollPercent2 > 0 && scrollPercent2 < 1) {
          mainContainer.position.y = newScroll;
          scrollbar.clear();
          scrollbar.beginFill(0x808080);
          scrollbar.drawRect(app.view.width - 8, newTop, 14, scrollbarHeight);
          scrollbar.endFill();
        }
      }
    },
    { passive: true }
  );

  app.stage.addChild(scrollbar);

  //update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container
  canvasElement.addEventListener("wheel", scrollCanvas, { passive: false });
  //*end of scrollbar setup */

  //resize the container and scrollbar when the window is resized

  function scrollCanvas(event) {
    event.preventDefault();
    document.body.style.overflow = "hidden";
    // Update the container's y position based on the mouse wheel delta
    mainContainer.position.y -= event.deltaY;

    // Clamp the container's position so that it can't scroll past the max scroll value
    mainContainer.position.y = Math.max(mainContainer.position.y, -maxScroll);
    mainContainer.position.y = Math.min(mainContainer.position.y, 0);

    // Update the scrollbar position and size based on the container's scroll position
    const scrollPercent = -mainContainer.position.y / maxScroll;
    const scrollbarHeight =
      app.view.height * (app.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
    scrollbar.clear();
    scrollbar.beginFill(0x808080);
    scrollbar.drawRect(app.view.width - 8, scrollbarY, 14, scrollbarHeight);
    scrollbar.endFill();
    clearTimeout(scrollingTimeout);
    scrollingTimeout = setTimeout(() => {
      console.log("Show the content again because the user stopped scrolling");
      document.body.style.overflow = "auto";
    }, 100);
  }
}
//*end of scrollbar setup */

///START CHRIS CODE
//test data loaded from test-data.ts
//var DAS = properties.das;
//var att = properties.att
//var colors = properties.colors;
//declare

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
        let createCoord = getStartCoordinates(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250']);
        logging ? console.log("createCoord",createCoord) : null;
    
        //stop small box creation - Placeholder
        if (createCoord.width < 20) return;
        if (createCoord.height < 20) return;
    
        createRectangle(createCoord, "DE3249", "temp");
        //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
    })
}
function createRectangle (createCoord, c, id) {
// Create a new rectangle graphic using the calculated dimensions
    isDrawing = false;

    //let createCoord = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("createCoord",createCoord) : null;

    // Create a new rectangle graphic using the calculated dimensions
const rectangle = new PIXI.Graphics();
rectangle.beginFill(0xFFFF00, .5);
rectangle.labelColor = "0x"+ c;
rectangle.drawRect(createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height);
rectangle.endFill();
//rectangle.interactive = true;
rectangle.dragging = false;
rectangle.name = id;
rectangle.buttonMode = true;
rectangle.resizingRadius = false;
rectangle.myRectanglePosition = [
    createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height
];
//set hitArea for dragging
//const hitArea = new PIXI.Rectangle(createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height);
//rectangle.hitArea = hitArea;

//add a hand
rectangle.cursor = 'hand';

//logging ? console.log('rectangle creation', rectangle, "hitArea", hitArea) : null;

/*rectangle
    //.on('mouseover', mouseOver)
    //.on('mouseout', mouseOut)
    .on('pointerdown', function(e){
        logRectEvents ? console.log('rect-pointerdown',e.clientX, e.clientY, e, this, (this.myRectanglePosition[0]+this.myRectanglePosition[2]), e.globalX, 
      ((this.myRectanglePosition[1]+this.myRectanglePosition[3])), e.globalY) : null;
        if (
          ((this.myRectanglePosition[0]+this.myRectanglePosition[2] - 48) < e.globalX)
           && 
          (((this.myRectanglePosition[1]+this.myRectanglePosition[3]) - 48) < e.globalY)
        ){
          //isResizing = true;
          console.log("reSizing");
        } else
        {

} })
    .on('pointerup', function(e){
       }) 
    .on('pointerupoutside', function(e){
      }) 
    .on('pointermove', function(e){}) 
    */
// Add the rectangle to the stage and the list of rectangles
rectangles.push(rectangle);

mainContainer.addChild(rectangle);

const x = rectangle.position.x;
const y = rectangle.position.y;
addLabel(rectangle);
/*
    const label = new PIXI.Text(rectangle.name, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0x000000,
});
label.position.set(
  rectangle.getBounds().x + 20 - mainContainer.position.x,
  rectangle.getBounds().y + 20 - mainContainer.position.y
);
logging ? console.log("label", rectangle.x, rectangle.y, rectangle, rectangle.getBounds()) : null;
rectangle.addChild(label);
*/
//addResizeHand(rectangle, mainContainer, rectangles, webpageSprite);
addDragHand(rectangle, mainContainer, rectangles, webpageSprite);
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
loadData ? loadDAS(DAS) : null;

//Listeners

mainContainer.on("pointerup", (event) => {
  if (!isDrawing) return;

  // Clear the stage
  mainContainer.removeChildren();

  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

    // Add all previously added rectangles back to the stage
    rectangles.forEach((r) => mainContainer.addChild(r));

  let createCoord = getStartCoordinates(startX, startY, endX, endY);
  logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

    createRectangle(createCoord, "DE3249", "temp");

});

mainContainer.on("mousedown", (event) => {
  // Check if the mouse is over any of the rectangles
  logging ? console.log("listener mousedown") : null;
  logging ? console.log("rectangles", rectangles) : null;
  for (let rectangle of rectangles) {
    logging ? console.log("rectangle selected?", rectangle.selected) : null;
    if (rectangle.selected || rectangle.resizing) {
      // The mouse is over the rectangle, don't start drawing
      //console.log('over rectangle, do not draw',"recthit",rectangle.hitArea,event.offsetX, event.offsetY);
      //rectangle.selected = true;
      //rectangle.interactive = true;
      changeRectColor(rectangle, "0x0000FF");
      logging ? console.log("returning", rectangle) : null;
      return;
    }
    logging
      ? console.log("recthit", rectangle.hitArea, event.offsetX, event.offsetY)
      : null;
  }
  // The mouse is not over any of the rectangles, start drawing
  isDrawing = true;
  startX = event.global.x - mainContainer.position.x;
  startY = event.global.y - mainContainer.position.y;
});

mainContainer.on("mouseup", () => {
  isDrawing = false;
  rectangles.forEach((r) => (r.selected = false));
  logging ? console.log("Lmouseup") : null;
});

mainContainer.on("pointermove", (event) => {
  if (!isDrawing) return;
  
  // Clear the stage
  mainContainer.removeChildren();
  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

  // Calculate the current position of the pointer
  endX = event.global.x - mainContainer.position.x;
  endY = event.global.y - mainContainer.position.y;

  // Calculate the dimensions of the rectangle
  let coordinates = getStartCoordinates(startX, startY, endX, endY);
  logging ? console.log("coord", coordinates) : null;

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
});
function addResizeHand(
  rectangle,
  mainContainer,
  rectangles,
  webpageSprite
) {
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
  logResize ? console.log("handle-hitarea", hitArea) : null;
  handle.scale.set(scaleHandle, scaleHandle);
  rectangle.addChild(handle);
  //handleEvents(handle, rectangle);
  handle
    .on("pointerdown", function (e) {
      rectangle.resizing = true;
      isDrawing = false;
      onDragStartH(e,rectangle);
    })
    .on('pointermove', function(e){
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
function onDragStartH(event, rectangle, handle) {
  //handle.off('mousedown')
  rectangle.interactive = true;
  initialMousePosX = rectangle.myRectanglePosition[0];
  initialMousePosY = rectangle.myRectanglePosition[1];
  initialRectWidth = rectangle.width;
  initialRectHeight = rectangle.height;
  //isResizing = true;
  console.log("dragStartH",isDrawing)
      
}

// mousemove event listener
function onDragMoveH(event, rect) {// Clear the stage
  mainContainer.removeChildren();

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

  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));
}
 
// mouseup event listener
function onDragEndH(e, rectangle) {
  rect.resizing = false; 
  //this.interactive = false;
  console.log("dragEnd",isDrawing)
}
