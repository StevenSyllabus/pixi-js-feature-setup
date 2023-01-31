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
  ticker,
} from "./events";
export { reDraw, mainContainer, webpageSprite, rectangles, app };
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
const app = new PIXI.Application({
  resizeTo: ele,
});
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
      das["Box Width 250"] * 3,
      das["Box Height 250"] * 3
    );
    logging ? console.log("createCoord", createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;
    console.log("att", att[0]);
    createExistingRect(createCoord, colors[index], att[index].Name);
    //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
  });
}

/////////////////////NEW DRAWING
// Input modes for input
let InputModeEnum = {
  create: 1,
  select: 2,
  scale: 3,
  move: 4,
};

mainContainer.interactive = true;
mainContainer.hitArea = mainContainer.screen;

// Load textures for edit
const hrefMove =
  "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
const hrefScale =
  "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
const textureMove = PIXI.Texture.from(hrefMove);
const textureScale = PIXI.Texture.from(hrefScale);
const highlightColor = "FFFF00"; //yellow
const dragColor = "DE3249"; //red
const resizeColor = "FFFF00"; //"0000FF"; //blue

// Start position of events
let startPosition = null;

// Current edited or created rectangle
let currentRectangle = null;
// Set mode for whole input (by default we create rectangles)
let inputMode = InputModeEnum.create;

// Pointer to current active control (Move or Scale icon)
let dragController = null;
// Active shown controls (can be shown both or one hovered / active)
let controls = [];

function addLabel(rect) {
  const label = new PIXI.Text(rect.name, {
    fontFamily: "Inter",
    fontSize: 24,
    stroke: 0x000000,
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: 0xffffff,
    dropShadowDistance: 0,
    dropShadowBlur: 2,
    wordWrap: true,
    wordWrapWidth: rect.width,
    breakWords: true,
  });
  true ? console.log("label", label, rect, rect.getBounds()) : null;
  rect.addChild(label);
  label.position.set(10, 10);
}

function createExistingRect(createCoord, color, name) {
  // Create graphics
  if (color == "") {
    color = highlightColor;
  }
  currentRectangle = new PIXI.Graphics()
    .beginFill("0x" + color, 0.5)
    // returns initial graphis so we can daizy chaing
    .lineStyle({
      color: 0x111111,
      alpha: 0,
      width: 1,
    })
    //create rect in orgin for calculation simplification
    .drawRect(0, 0, createCoord.width, createCoord.height)
    .endFill();

  currentRectangle.labelColor = "0x" + color;
  currentRectangle.oldColor = "0x" + color;
  currentRectangle.name = name;
  // then we move it to final position
  currentRectangle.position.copyFrom(
    new PIXI.Point(createCoord.startRectX, createCoord.startRectY)
  );
  //addLabel(currentRectangle);
  mainContainer.addChild(currentRectangle);
  // make it hoverable
  currentRectangle.interactive = true;
  currentRectangle
    .on("pointerover", onRectangleOver)
    .on("pointerout", onRectangleOut);
  // remove it from current ceration and chose new color for next one
  addLabel(currentRectangle);
  console.log("currentRect", currentRectangle);
  currentRectangle = null;
}

// Function that generates test rect
function testRect() {
  // Create graphics
  currentRectangle = new PIXI.Graphics()
    .beginFill("0x" + highlightColor, 0.5)
    // returns initial graphis so we can daizy chaing
    .lineStyle({
      color: 0x111111,
      alpha: 0,
      width: 1,
    })
    // we create rect in orgin for calculation simplification
    .drawRect(0, 0, 100, 100)
    .endFill();
  // then we move it to final position
  currentRectangle.labelColor = "0x";
  currentRectangle.oldColor = "0xFFFF00";
  currentRectangle.name = "0xFFFF00";
  currentRectangle.position.copyFrom(new PIXI.Point(100, 100));
  addLabel(currentRectangle);
  mainContainer.addChild(currentRectangle);
  // make it hoverable
  currentRectangle.interactive = true;
  addLabel(currentRectangle);
  currentRectangle
    .on("pointerover", onRectangleOver)
    .on("pointerout", onRectangleOut);
  currentRectangle = null;
}
//testRect()

mainContainer.on("pointerdown", (e) => {
  // Initiate rect creation
  console.log(inputMode);
  if (inputMode == InputModeEnum.create) {
    startPosition = new PIXI.Point().copyFrom(e.global);
    logging ? console.log("pointerdown", startPosition) : null;
  }
  if (inputMode == InputModeEnum.select) {
    //PLACEHOLDER for select function
    selectRect(this);
  }
});

mainContainer.on("pointermove", (e) => {
  // Do this routine only if in create mode and have started creation
  // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
  if (inputMode == InputModeEnum.create && startPosition) {
    // get new global position from event
    let currentPosition = e.global;
    let { start, size } = getStartAndSize(currentPosition, startPosition);
    if (size.x > 5 && size.y > 5) {
      if (!currentRectangle) {
        currentRectangle = new PIXI.Graphics()
          .beginFill("0x" + highlightColor, 0.5)
          .lineStyle({
            color: "0x" + highlightColor,
            alpha: 0.5,
            width: 1,
          })
          .drawRect(0, 0, size.x, size.y)
          .endFill();
        currentRectangle.labelColor = "0x" + highlightColor;
        currentRectangle.oldColor = highlightColor;
        currentRectangle.name = "";
        currentRectangle.position.copyFrom(start);

        addLabel(currentRectangle);

        mainContainer.addChild(currentRectangle);
      } else {
        scaleRectB(currentRectangle, currentPosition);
      }
    } else {
      if (currentRectangle) {
        mainContainer.removeChild(currentRectangle);
        currentRectangle = null;
      }
    }
  }
});

mainContainer.on("pointerup", (e) => {
  // Wrap up rect creation
  startPosition = null;
  if (currentRectangle && currentRectangle.interactive == false) {
    currentRectangle.interactive = true;
    currentRectangle
      // Mouse & touch events are normalized into
      // the pointer* events for handling different
      // Rectangle events.
      .on("pointerover", onRectangleOver)
      .on("pointerout", onRectangleOut);
    console.log("currentRect", currentRectangle);
    currentRectangle.initialScale = app.view.width / intialWebpageWidth;
    console.log("currentRect initialScale", currentRectangle.initialScale);
    console.log("currentRectangle scale", currentRectangle);
  }
  currentRectangle = null;
  onDragEndNew();
});

function controlOver() {
  this.isOver = true;
}

function controlOut() {
  this.isOver = false;
  removeIfUnused(this);
}

function onRectangleOver() {
  // Do not hover rectangle if we are moving
  if (inputMode == InputModeEnum.move || inputMode == InputModeEnum.scale) {
    return;
  }
  // Do not hover rectangle if we creating
  if (inputMode == InputModeEnum.create && startPosition) {
    return;
  }
  console.log("Over");
  this.isOver = true;
  inputMode = InputModeEnum.select;
  // set current hovered rect to be on the top
  bringToFront(this);
  // Create button move
  const buttonMove = new PIXI.Sprite(textureMove);
  // set anchor middle
  buttonMove.anchor.set(0.5);
  // Set control top right
  buttonMove.x = this.x + this.width - 18;
  buttonMove.y = this.y + 23;

  // make interactive...
  buttonMove.interactive = true;
  buttonMove.cursor = "grab";
  // Add events/pass object to pointerdown event so we know which button/control is pressed
  buttonMove
    .on("pointerover", controlOver)
    .on("pointerout", controlOut)
    .on("pointerdown", onDragStartNew, {
      controller: buttonMove,
      edit: this,
      mode: InputModeEnum.move,
    });
  mainContainer.addChild(buttonMove);
  // add to control queue
  controls.push(buttonMove);

  const buttonScale = new PIXI.Sprite(textureScale);
  // same as for move but on bottom right corner
  buttonScale.anchor.set(0.5);
  buttonScale.x = this.x + this.width - 20;
  buttonScale.y = this.y + this.height - 20;

  // make the buttonScale interactive...
  buttonScale.interactive = true;
  buttonScale.cursor = "nw-resize";
  buttonScale
    .on("pointerover", controlOver)
    .on("pointerout", controlOut)
    .on("pointerdown", onDragStartNew, {
      controller: buttonScale,
      edit: this,
      mode: InputModeEnum.scale,
    });

  mainContainer.addChild(buttonScale);
  controls.push(buttonScale);
}

function cleanupcontrols() {
  controls = controls.filter((el) => el.parent);
  if (controls.length == 0) {
    onDragEndNew();
  }
}

function removeIfUnused(control) {
  // Give time to PIXI to go trough events and add event on end
  setTimeout(() => {
    // By this time isOver is updated so if we went from
    // square to conntroll controll.isOver become true
    // if we are draging controll and went out of it
    // we dont remove it because it is still used
    if (!control.isOver && control !== dragController) {
      mainContainer.removeChild(control);
      cleanupcontrols();
    }
  }, 0);
}

// Event is triggered when we move mouse out of rectangle
function onRectangleOut() {
  this.isOver = false;
  console.log("OUT");
  controls.forEach((control) => removeIfUnused(control));
}

// Normalize start and size of square so we always have top left corner as start and size is always +
function getStartAndSize(pointA, pointB) {
  let deltaX = pointB.x - pointA.x;
  let deltaY = pointB.y - pointA.y;
  let absDeltaX = Math.abs(deltaX);
  let absDeltaY = Math.abs(deltaY);
  let startX = deltaX > 0 ? pointA.x : pointB.x;
  let startY = deltaY > 0 ? pointA.y : pointB.y;
  return {
    start: new PIXI.Point(
      startX - mainContainer.position.x,
      startY - mainContainer.position.y
    ),
    size: new PIXI.Point(absDeltaX, absDeltaY),
  };
}

//these two are slightly different, could probably be combined
function scaleRect(resizeRectange, dragController) {
  //currentPosition){
  let { start, size } = getStartAndSize(startPosition, dragController.position);
  if (size.x < 20 || size.y < 20) return;
  // When we scale rect we have to give it new cordinates so we redraw it
  // in case of sprite we would do this a bit differently with scale property,
  // for simple geometry this is better solution because scale propagates to children

  let startPositionController = new PIXI.Point(
    dragController.position.x - 20,
    dragController.position.y - 20
  );
  resizeRectange.clear();
  resizeRectange.position.copyFrom(start);
  resizeRectange
    .beginFill("0x" + resizeColor, 0.5)
    .lineStyle({
      color: 0x111111,
      alpha: 0.5,
      width: 1,
    })
    .drawRect(0, 0, size.x, size.y)
    .endFill();

  dragController.position.copyFrom(startPositionController);
}

function scaleRectB(resizeRectange, currentPosition) {
  let { start, size } = getStartAndSize(startPosition, currentPosition);

  if (size.x < 5 || size.y < 5) return;
  // When we scale rect we have to give it new cordinates
  resizeRectange.clear();
  resizeRectange.position.copyFrom(start);
  resizeRectange
    .beginFill("0x" + resizeColor, 0.5)
    .lineStyle({
      color: "0x" + resizeColor,
      alpha: 0.5,
      width: 1,
    })
    .drawRect(0, 0, size.x, size.y)
    .endFill();
}

function moveRect(resizeRectange, dragController) {
  // Move control is on right side
  // and our rect is anchored on the left we substact width of rect
  let startPosition = new PIXI.Point(
    dragController.position.x - resizeRectange.width,
    dragController.position.y
  );
  let startPositionController = new PIXI.Point(
    dragController.position.x - 18,
    dragController.position.y + 23
  );
  // we just move the start position
  resizeRectange.position.copyFrom(startPosition);
  dragController.position.copyFrom(startPositionController);
}
function selectRect(rectangle) {
  //rectangle.isSelected = true;
}

function onDragMoveNew(event) {
  if (dragController) {
    // move control icon (move or scale icon)
    dragController.parent.toLocal(
      event.data.global,
      null,
      dragController.position
    );
    if (inputMode == InputModeEnum.scale) {
      // handle rect scale
      scaleRect(currentRectangle, dragController);
    }
    if (inputMode == InputModeEnum.move) {
      // handle rect move
      moveRect(currentRectangle, dragController);
    }
  }
}

function onDragStartNew() {
  // start drag of controller
  // and set parameters
  this.controller.alpha = 0.5;
  dragController = this.controller;
  currentRectangle = this.edit;
  startPosition = new PIXI.Point().copyFrom(this.edit.position);
  inputMode = this.mode;
  mainContainer.on("pointermove", onDragMoveNew);
}

function onDragEndNew() {
  // stop drag, remove parameters
  // return input mode to default
  if (dragController) {
    mainContainer.off("pointermove", onDragMoveNew);
    dragController.alpha = 1;
    currentRectangle = null;
    dragController = null;
  }
  startPosition = null;
  inputMode = InputModeEnum.create;
}

mainContainer.on("pointerupoutside", onDragEndNew);

console.log("reload");

///experimental
function bringToFront(sprite) {
  var sprite = typeof sprite != "undefined" ? sprite.target || sprite : this;
  var parent = sprite.parent || {
    children: false,
  };
  if (parent.children) {
    for (var keyIndex in sprite.parent.children) {
      if (sprite.parent.children[keyIndex] === sprite) {
        sprite.parent.children.splice(keyIndex, 1);
        break;
      }
    }
    parent.children.push(sprite);
  }
}
//load our data
