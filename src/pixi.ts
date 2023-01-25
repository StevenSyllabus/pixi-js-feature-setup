//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let startX, startY, endX, endY;
let isDrawing = false;
let logging = false;
let selected, over;
const rectangles = [];
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
  getStartCoordinates,
  changeRectColor,
  logDrag,
  logResize,
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
var app = new PIXI.Application({ resizeTo: window });
var mainContainer = new PIXI.Container();

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

// Find the rectangle with the specified name
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
    createRect(
      das["X Coordinate (500)"],
      das["Y Coordinate (500)"],
      das["Box Width 250"],
      das["Box Height 250"],
      colors[index],
      das["_id"]
    );
  });
}
//creates rectangles based on data PLACEHOLDER
function createRect(x, y, w, h, c, id) {
  // Create a new rectangle graphic using the calculated dimensions
  const graphics = new PIXI.Graphics();
  graphics.beginFill(c);
  graphics.drawRect(x, y, w, h);
  graphics.endFill();
  graphics.interactive = true;
  graphics.on("pointerdown", (event) => {
    onClick(id);
    //console.log(id);
  });
  //set hitArea for dragging
  const hitArea = new PIXI.Rectangle(x, y, w, h);
  graphics.hitArea = hitArea;
  mainContainer.addChild(graphics);
  rectangles.push(graphics);
}
//click functions on rectangles
function onClick(id) {
  // Clear the stage
  mainContainer.removeChildren();

  mainContainer.addChild(screenshot);
  if (id > 2) {
    rects.forEach((rect, index) => {
      createRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
    });
  } else if ((id = 1)) {
    DAS.forEach((das, index) => {
      //console.log(Object.keys(das));
      var rect = Object.values(das);
      //console.log(rect);
      createRect(
        das["X Coordinate (500)"],
        das["Y Coordinate (500)"],
        das["Box Width 250"],
        das["Box Height 250"],
        "0xDE3249",
        5
      );
    });
  } else {
    rects2.forEach((rect, index) => {
      createRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
    });
  }
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
function addLabel(rect, label1) {
  const label = new PIXI.Text(label1, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x000000,
  });
  label.position.set(rect.x + 20, rect.y + 20);
  console.log("label", rect.x, rect.y, rect, rect.getBounds());
  rect.addChild(label);
}
//loadDAS(DAS);

//Listeners

mainContainer.on("pointerup", (event) => {
  if (!isDrawing) return;

  // Clear the stage
  mainContainer.removeChildren();

  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));

  // Save the ending position of the pointer
  endX = event.global.x - mainContainer.position.x;
  endY = event.global.y - mainContainer.position.y;
  isDrawing = false;

  let createCoord = getStartCoordinates(startX, startY, endX, endY);
  logging ? console.log("createCoord", createCoord) : null;

  //stop small box creation - Placeholder
  if (createCoord.width < 20) return;
  if (createCoord.height < 20) return;

  // Create a new rectangle graphic using the calculated dimensions
  const rectangle = new PIXI.Graphics();
  rectangle.beginFill(0xffff00, 0.5);
  rectangle.labelColor = "0xFFFF00";
  rectangle.drawRect(
    createCoord.startRectX,
    createCoord.startRectY,
    createCoord.width,
    createCoord.height
  );
  rectangle.endFill();
  rectangle.interactive = true;
  rectangle.dragging = false;
  rectangle.name = Math.random().toString(16).substr(2, 8);
  rectangle.buttonMode = true;
  rectangle.resizingRadius = false;
  rectangle.myRectanglePosition = [
    createCoord.startRectX,
    createCoord.startRectY,
    createCoord.width,
    createCoord.height,
  ];
  //set hitArea for dragging
  const hitArea = new PIXI.Rectangle(
    createCoord.startRectX,
    createCoord.startRectY,
    createCoord.width,
    createCoord.height
  );
  rectangle.hitArea = hitArea;

  //add a hand
  rectangle.cursor = "hand";

  logging
    ? console.log("rectangle creation", rectangle, "hitArea", hitArea)
    : null;

  rectangle
    //.on('mouseover', mouseOver)
    //.on('mouseout', mouseOut)
    .on("pointerdown", function (e) {
      logging ? console.log("rect-pointerdown", e.clientX, e.clientY) : null;
      this.selected = true;
      onDragStart(e, this, rectangles);
    })
    .on("pointerup", function (e) {
      this.selected = false;
      onDragEnd(e, this, rectangles);
    })
    .on("pointerupoutside", function (e) {
      this.selected = false;
      onDragEnd(e, this, rectangles);
    })
    .on("pointermove", function (e) {
      onDragMove(e, this, rectangles);
    });
  // Add the rectangle to the stage and the list of rectangles
  rectangles.push(rectangle);

  mainContainer.addChild(rectangle);

  const x = rectangle.position.x;
  const y = rectangle.position.y;
  //    addLabel(rectangle, rectangle.name);
  const label = new PIXI.Text(rectangle.name, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x000000,
  });
  label.position.set(
    rectangle.getBounds().x + 20 - mainContainer.position.x,
    rectangle.getBounds().y + 20 - mainContainer.position.y
  );
  logging
    ? console.log(
        "label",
        rectangle.x,
        rectangle.y,
        rectangle,
        rectangle.getBounds()
      )
    : null;
  rectangle.addChild(label);
  addDragHand(rectangle, mainContainer, rectangles, webpageSprite);
});

mainContainer.on("mousedown", (event) => {
  // Check if the mouse is over any of the rectangles
  logging ? console.log("listener mousedown") : null;
  logging ? console.log("rectangles", rectangles) : null;
  for (let rectangle of rectangles) {
    logging ? console.log("rectangle selected?", rectangle.selected) : null;
    if (rectangle.selected) {
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
