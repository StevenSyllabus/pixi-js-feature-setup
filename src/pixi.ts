//@ts-nocheck this turns off typesccript checks for the entire file
import * as PIXI from "pixi.js";

//simply import the Bubble testing functions from the other file.
import { DAS, att, colors, rects, rects2 } from "./test-data";

// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let logging = true;
let logDrag = false;
let logResize = false;
let logRectEvents = false;
let loadData = true;
let logEvents = false;

const rectangles = [];
const resizeHandles = [];
const imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
const mainContainer = new PIXI.Container();
const ele = document.getElementById(`test`);

const app = new PIXI.Application({
  resizeTo: ele,
});

var canvasElement = mainContainer;
let intialWebpageWidth,
  intialWebpageHeight,
  intialCanvasWidth,
  intialCanvasHeight,
  intialScale,
  webpageSprite,
  scrollBar = <PIXI.Graphics>{};

let resizeTimeout = null;
/////////////////////NEW DRAWING
// Input modes for input
let InputModeEnum = {
  create: 1,
  select: 2,
  scale: 3,
  move: 4,
};

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

//end C Declare

//--begin html container setup, and pixi core element setup
//--end html container setup, and pixi core element setup
PIXI.settings.ROUND_PIXELS = true;
mainContainer.name = "mainContainer";
app.stage.addChild(mainContainer);
ele.appendChild(app.view);

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

const createScrollBar = function (
  mainContainer: PIXI.Container,
  pixiApp: PIXI.Application,
  div: HTMLDivElement
) {
  const scrollBarWidth = 14;
  const scrollbar = new PIXI.Graphics();
  scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

  let scrollingTimeout: number;
  scrollbar.interactive = true;

  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(
    pixiApp.view.width - scrollBarWidth,
    0,
    scrollBarWidth,
    pixiApp.view.height * (pixiApp.view.height / mainContainer.height)
  );

  scrollbar.endFill();

  scrollbar.addEventListener("pointerdown", (e) => {
    const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
    const scrollbarHeight =
      pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);
    div.pressed = true;
    scrollbar.lastY = e.data.global.y;
    scrollbar.lastMouseY = e.client.y;
    console.log(e.client.y);

    scrollbar.lastTop = scrollbarY;
    scrollbar.tint = 0x808080;
  });

  scrollbar.addEventListener("pointerup", (e) => {
    console.log(`scrollbar pointerup`);
    div.pressed = false;
    console.log(div.pressed);
    scrollbar.tint = 0xffffff;
  });

  scrollbar.addEventListener("pointerupoutside", (e) => {
    console.log(`scrollbar pointerupoutside`);
    div.pressed = false;
    console.log(div.pressed);
    scrollbar.tint = 0xffffff;
  });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (div.pressed) {
        const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
        console.log(`scrollPercent: ${scrollPercent}`);

        const scrollbarHeight =
          pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
        const scrollbarY =
          scrollPercent * (pixiApp.view.height - scrollbarHeight);

        const mouseDif = e.y - scrollbar.lastMouseY;
        console.log(mouseDif);

        const newTop = mouseDif + scrollbar.lastTop;
        const scrollPercent2 = newTop / (pixiApp.view.height - scrollbarHeight);
        const newScroll = Math.min(-scrollPercent2 * scrollbar.maxScroll, 0);

        if (scrollPercent2 > 0 && scrollPercent2 < 1) {
          mainContainer.position.y = newScroll;
          scrollbar.clear();
          scrollbar.beginFill(0x808080);
          scrollbar.drawRect(
            pixiApp.view.width - 14,
            newTop,
            14,
            scrollbarHeight
          );
          scrollbar.endFill();
        }
      }
    },
    { passive: true }
  );
  div.addEventListener("wheel", scrollCanvas, { passive: true });

  pixiApp.stage.addChild(scrollbar);

  //update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container

  //resize the container and scrollbar when the window is resized

  function scrollCanvas(event) {
    document.body.style.overflow = "hidden";
    // Update the container's y position based on the mouse wheel delta
    mainContainer.position.y -= event.deltaY;

    // Clamp the container's position so that it can't scroll past the max scroll value
    if (mainContainer.position.y <= mainContainer.height) {
      mainContainer.position.y = Math.max(
        mainContainer.position.y,
        -scrollbar.maxScroll
      );
      mainContainer.position.y = Math.min(mainContainer.position.y, 0);
    }

    // Update the scrollbar position and size based on the container's scroll position
    const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
    const scrollbarHeight =
      pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);
    if (scrollbar.clear) {
      scrollbar.clear();
    }
    scrollbar.beginFill(0x808080);
    scrollbar.drawRect(
      pixiApp.view.width - scrollBarWidth,
      scrollbarY,
      scrollBarWidth,
      scrollbarHeight
    );
    scrollbar.endFill();
    clearTimeout(scrollingTimeout);
    scrollingTimeout = setTimeout(() => {
      console.log("Show the content again because the user stopped scrolling");
      document.body.style.overflow = "auto";
    }, 100);
  }
  return scrollbar;
};
const updateScrollBarPosition = function (
  mainContainer: PIXI.Container,
  pixiApp: PIXI.Application,
  scrollbar: PIXI.Graphics
) {
  scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

  const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
  scrollbar.scrollPercent = scrollPercent;
  console.log(`scrollPercent: ${scrollPercent}`);
  const scrollbarHeight =
    pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
  const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);
  scrollbar.clear();
  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(pixiApp.view.width - 14, scrollbarY, 14, scrollbarHeight);
  scrollbar.endFill();
  //clamp the container's position so that it can't scroll past the max scroll value
  if (mainContainer.position.y <= mainContainer.height) {
    console.log(`clamp`);
    mainContainer.position.y = Math.max(
      mainContainer.position.y,
      -scrollbar.maxScroll
    );
    mainContainer.position.y = Math.min(mainContainer.position.y, 0);
  }
};

const handleResize = function (
  event: Event,
  pixiApp: PIXI.Application,
  mainContainer: PIXI.Container,
  webpageSprite: PIXI.Sprite,
  intialWebpageWidth: number
) {
  let intialScale = pixiApp.view.width / intialWebpageWidth;
  let endingWidth, newPercent;

  mainContainer.children.forEach((child) => {
    let childIntialScale = child.intialScale;
    let childIntialPosition = child.position.x;

    let newScale = intialScale / childIntialScale;
    console.log(
      `initialScale: ${intialScale}, childIntialScale: ${childIntialScale}`
    );
    console.log(`newScale: ${newScale}, childName: ${child.name}`);
    let startingWidth = webpageSprite.width;

    if (child.name === `webpage`) {
      child.scale.set(newScale);
      endingWidth = webpageSprite.width;
      newPercent = endingWidth / startingWidth;
    } else {
      console.log(`newScale`, newScale);
      child.scale.set(newScale);
      child.position.x = childIntialPosition * newPercent;
      child.position.y = child.position.y * newPercent;
    }
  });

  //   resizeTimeout = setTimeout(() => {
  //     console.log(`resize timeout`);
  //     console.log(pixiApp.view.width / webpageSprite.intialWidth);
  //   }, 100);
};
const onDragStart = function (e, rectangle, rectangles) {
  const mousePosition = e.data.global;
  changeRectColor(rectangle, rectangle.labelColor);
  rectangle.interactive = true; // Make the rectangle interactive
  rectangle.dragging = true;
  if (rectangle.resizing) {
    logResize ? console.log("resizing active", mousePosition) : null;
    return;
  }
  logDrag ? console.log("mousePosition", mousePosition) : null;
  logDrag
    ? console.log("myRectanglePosition", rectangle.myRectanglePosition)
    : null;

  rectangle.draggingOffset = [
    mousePosition.x - rectangle.myRectanglePosition[0],
    mousePosition.y - rectangle.myRectanglePosition[1],
  ];
};

const onDragEnd = function (e, rectangle, rectangles) {
  //rectangle.selected = false;

  changeRectColor(rectangle, rectangle.oldColor);
  rectangles.forEach((r) => (r.dragging = false));
  rectangles.forEach((r) => (r.interactive = false));
  logDrag
    ? console.log(
        "DragEnd,color,interactive,selected",
        rectangle.labelColor,
        rectangle.interactive,
        rectangle.selected
      )
    : null;
  rectangle.off("pointermove");
};

const onDragMove = function (e, rectangle, rectangles) {
  //if (rectangle.dragging != true) return;
  if (rectangle.dragging) {
    rectangle.position.x += e.data.originalEvent.movementX;
    rectangle.position.y += e.data.originalEvent.movementY;
    rectangle.lastMoveX = rectangle.position.x;
    rectangle.lastMoveY = rectangle.position.y;

    logDrag ? console.log("onDragMove") : null;
    changeRectColor(rectangle, rectangle.labelColor);
  }
};
const changeRectColor = function (sq, color) {
  logDrag ? console.log("changeColor") : null;
  const square = sq;
  //logDrag ? console.log(square) : null;
  sq.clear();
  sq.beginFill(color, 0.5);
  sq.lineStyle(square.lineStyle);
  sq.drawRect(
    square.myRectanglePosition[0],
    square.myRectanglePosition[1],
    square.myRectanglePosition[2],
    square.myRectanglePosition[3]
  );
  /*logDrag
    ? console.log(
        "squareDeets",
        square.myRectanglePosition[0],
        square.myRectanglePosition[1],
        square.myRectanglePosition[2],
        square.myRectanglePosition[3]
      )
    : null;
    */
  sq.endFill();
};

//function for drawing in different directions
const getStartCoordinates = function (startX, startY, endX, endY) {
  var width, height, startRectX, startRectY;
  startX < endX ? (width = endX - startX) : (width = startX - endX);
  startY < endY ? (height = endY - startY) : (height = startY - endY);
  startX < endX ? (startRectX = startX) : (startRectX = endX);
  startY < endY ? (startRectY = startY) : (startRectY = endY);
  return { startRectX, startRectY, width, height };
};

const addDragHand = function (rectangle, rectangles) {
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
  handle.name = "dragHandle";
  logResize ? console.log("handle-hitarea", hitArea) : null;
  handle.scale.set(scaleHandle, scaleHandle);
  rectangle.addChild(handle);
};

const handleResizerRect = function (
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
};
const handleResizerRect2 = function (
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
  //console.log("dragMove",isDrawing)
};

const removeRectangle = function (rectangle, array) {
  logResize
    ? console.log(
        "removeRectangle",
        array.filter((rect) => rect.name == rectangle.name)
      )
    : null;
  array = array.filter((rect) => rect.name != rectangle.name);
  return array;
};

//begin functions
const findRect = function (name) {
  const foundRectangle = rectangles.find((r) => r.name === name);
  if (foundRectangle) {
    return foundRectangle;
  }
};
//loads & reformats Drawn Attribute Snippets
const loadDAS = function (das) {
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
};

const addLabel = function (rect) {
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
};

const createExistingRect = function (createCoord, color, name) {
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
  console.log("currentRect that im testing", currentRectangle);
  currentRectangle.intialScale = app.view.width / intialWebpageWidth;

  currentRectangle = null;
};

// Function that generates test rect
const testRect = function () {
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
};
//testRect()
const controlOver = function () {
  this.isOver = true;
};

const controlOut = function () {
  this.isOver = false;
  removeIfUnused(this);
};

const onRectangleOver = function () {
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
};

const cleanupcontrols = function () {
  controls = controls.filter((el) => el.parent);
  if (controls.length == 0) {
    onDragEndNew();
  }
};

const removeIfUnused = function (control) {
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
};

// Event is triggered when we move mouse out of rectangle
const onRectangleOut = function () {
  this.isOver = false;
  console.log("OUT");
  controls.forEach((control) => removeIfUnused(control));
};

// Normalize start and size of square so we always have top left corner as start and size is always +
const getStartAndSize = function (pointA, pointB, type) {
  let deltaX = pointB.x - pointA.x;
  let deltaY = pointB.y - pointA.y;
  let absDeltaX = Math.abs(deltaX);
  let absDeltaY = Math.abs(deltaY);
  let startX = deltaX > 0 ? pointA.x : pointB.x;
  let startY = deltaY > 0 ? pointA.y : pointB.y;

  //when the rectangle gets scaled, I need to factor that into the size of the rectangle
  //When the page gets bigger, I need the rectangle to get drawn smaller,
  //so I need to factor in the scale of the rectangle
  //i know the rectangles scale ratio. I can get it with currentRectangle.scale

  if (type == "scaleRect") {
    let currentScaleRatio = currentRectangle.scale.x;
    let scaleRatio = 1 / currentScaleRatio;
    return {
      start: new PIXI.Point(startX, startY),
      size: new PIXI.Point(absDeltaX * scaleRatio, absDeltaY * scaleRatio),
    };
  } else if (type == "draw") {
    return {
      start: new PIXI.Point(
        startX - mainContainer.position.x,
        startY - mainContainer.position.y
      ),
      size: new PIXI.Point(absDeltaX, absDeltaY),
    };
  }
};

//these two are slightly different, could probably be combined
const scaleRect = function (resizeRectange, dragController) {
  //currentPosition)
  let { start, size } = getStartAndSize(
    startPosition,
    dragController.position,
    "scaleRect"
  );
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
  console.log(
    "scaleRect, startPos, startPosController,dragcontroller,mainContainer",
    startPosition,
    startPositionController,
    dragController.position,
    mainContainer.position
  );
};

const scaleRectB = function (resizeRectange, currentPosition) {
  let { start, size } = getStartAndSize(startPosition, currentPosition, "draw");
  console.log("scaleRectB");
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
};

const moveRect = function (resizeRectange, dragController) {
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
};
const selectRect = function (rectangle) {
  alert("Hello, " + rectangle.name + "!"); //rectangle.isSelected = true;
};

const onDragMoveNew = function (event) {
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
};

const onDragStartNew = function () {
  // start drag of controller
  // and set parameters
  this.controller.alpha = 0.5;
  dragController = this.controller;
  currentRectangle = this.edit;
  startPosition = new PIXI.Point().copyFrom(this.edit.position);
  inputMode = this.mode;
  mainContainer.on("pointermove", onDragMoveNew);
};

const onDragEndNew = function () {
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
};

///experimental
const bringToFront = function (sprite) {
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
};
//load our data

mainContainer.on("pointerupoutside", onDragEndNew);
mainContainer.on("pointerdown", (e) => {
  // Initiate rect creation
  console.log(inputMode);
  if (inputMode == InputModeEnum.create) {
    startPosition = new PIXI.Point().copyFrom(e.global);

    logging ? console.log("pointerdown", startPosition) : null;
  }
  if (inputMode == InputModeEnum.select) {
    //PLACEHOLDER for select function
    selectRect(e.target);
  }
});

mainContainer.on("pointermove", (e) => {
  // Do this routine only if in create mode and have started creation
  // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
  if (inputMode == InputModeEnum.create && startPosition) {
    // get new global position from event
    let currentPosition = e.global;
    let { start, size } = getStartAndSize(
      currentPosition,
      startPosition,
      "draw"
    );
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
        currentRectangle.intialScale = app.view.width / intialWebpageWidth;
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
