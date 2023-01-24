//@ts-nocheck
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
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";
import { DAS, att, colors, rects, rects2 } from "./test-data";
import { onDragStart, onDragEnd, onDragMove, mouseOut, mouseOver, handleResizer, removeRectangle, addDragHand, getStartCoordinates, changeRectColor, logDrag, logResize} from "./events";;
//--begin html container setup, and pixi core element setup
//const canvasElement = document.getElementById(`app`);
//const mainDivContainer = document.getElementById(`mainContainer`);
//--end html container setup, and pixi core element setup
const ele = document.getElementById(`test`);
//intialize pixi
const renderer = PIXI.autoDetectRenderer({});
let app = new PIXI.Application({
  autoStart: true,
  autoDensity: false,
  resolution: 1,
  backgroundColor: 0xffffff,
  backgroundAlpha: 1,
  resizeTo: canvasElement,
  antialias: false,
  hello: true,
});
var app = new PIXI.Container();
var mainContainer = app;
//csp change
//canvasElement.appendChild(renderer.view);
//canvasElement.appendChild(app.view);mainDivContainer

document.body.appendChild(renderer.view);
*/
const renderer = PIXI.autoDetectRenderer({
    //width: properties.bubble.width(),
   //height: properties.bubble.height(),
   backgroundColor: 0x2980b9

});
var app = new PIXI.Application({    resizeTo: window});
var mainContainer = new PIXI.Container();
mainContainer.x = app.screen.width / 2;
mainContainer.y = app.screen.height / 2;
mainContainer.pivot.x = window.innerWidth / 2;
mainContainer.pivot.y = window.innerHeight / 2;
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
const screenshot = PIXI.Texture.from(
  `https://d1muf25xaso8hp.cloudfront.net/https://dd7tel2830j4w.cloudfront.net/d110/f1667856689965x312820165751551200/3b557354f48767d0cc7efb785a512fd02d9d8c1f177e8fb51092dea464924812`
);

console.log(screenshot);
const webpageSprite = PIXI.Sprite.from(screenshot);
webpageSprite.filters = null;

webpageSprite.interactive = true;
mainContainer.addChild(webpageSprite);
//scale the container to the width of the canvas. This scales everything inside

const intialWebpageWidth = webpageSprite.width;
const intialWebpageHeight = webpageSprite.height;
webpageSprite.intialWidth = webpageSprite.width;
const intialCanvasWidth = app.view.width;
const intialCanvasHeight = app.view.height;
const intialScale = intialCanvasWidth / intialWebpageWidth;
console.log(`intialScale: ${intialScale}`);

webpageSprite.scale.set(app.view.width / webpageSprite.width);

app.stage.addChild(mainContainer);
//end of screenshot setup

//**begin creating the scrollbar */

//this function allows us to tap into the canvas's resize event and update the contents how we need to.
app.renderer.on(`resize`, handleResize);
let resizeTimeout = null;
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
  scrollbar.height = app.view.height;
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
    mainDivContainer.pressed = true;
    scrollbar.lastY = e.data.global.y;
    scrollbar.lastMouseY = e.client.y;
    console.log(e.client.y);

    scrollbar.lastTop = scrollbarY;
  });

  scrollbar.addEventListener("pointerup", (e) => {
    console.log(`scrollbar pointerup`);
    mainDivContainer.pressed = false;
    console.log(mainDivContainer.pressed);
  });

  scrollbar.addEventListener("pointerupoutside", (e) => {
    console.log(`scrollbar pointerupoutside`);
    mainDivContainer.pressed = false;
    console.log(mainDivContainer.pressed);
  });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (mainDivContainer.pressed) {
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
createScrollBar(mainContainer);

///START CHRIS CODE
//test data loaded from test-data.ts
//var DAS = properties.das;
//var att = properties.att
//var colors = properties.colors;

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

  // Save the ending position of the pointer
  endX = event.global.x - mainContainer.x;
  endY = event.global.y - mainContainer.y;
  isDrawing = false;
  console.log(`testest`);

    let createCoord = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("createCoord",createCoord) : null;

    //stop small box creation - Placeholder
    if (width < 20) return;
    if (height < 20) return;

    // Create a new rectangle graphic using the calculated dimensions
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xFFFF00, .5);
    rectangle.labelColor = "0xFFFF00";
    rectangle.drawRect(createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height);
    rectangle.endFill();
    rectangle.interactive = true;
    rectangle.dragging = false;
    rectangle.name = (Math.random().toString(16).substr(2, 8));
    rectangle.buttonMode = true;
    rectangle.resizingRadius = false;
    rectangle.myRectanglePosition = [
        createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height
    ];
    //set hitArea for dragging
    const hitArea = new PIXI.Rectangle(createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height);
    rectangle.hitArea = hitArea;

  //add a hand
  rectangle.cursor = "hand";

  if (logging) {
    console.log("rectangle creation", rectangle);
  }

    logging ? console.log('rectangle creation', rectangle, "hitArea", hitArea) : null;


    
 rectangle
        //.on('mouseover', mouseOver)
        //.on('mouseout', mouseOut)
        .on('pointerdown', function(e){
            logging ? console.log('rect-pointerdown',e.clientX, e.clientY) : null;
            this.selected = true;
            onDragStart(e,this,rectangles);}) 
        .on('pointerup', function(e){
            this.selected = false;
            onDragEnd(e,this,rectangles);}) 
        .on('pointerupoutside', function(e){
            this.selected = false;
            onDragEnd(e,this,rectangles);}) 
        .on('pointermove', function(e){onDragMove(e,this,rectangles);}) 
    // Add the rectangle to the stage and the list of rectangles
    rectangles.push(rectangle);
    
    mainContainer.addChild(rectangle);

    const x = rectangle.position.x;
    const y = rectangle.position.y;
    //    addLabel(rectangle, rectangle.name);
    const label = new PIXI.Text(rectangle.name, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000,
    });
    label.position.set(rectangle.getBounds().x + 20, rectangle.getBounds().y + 20);
    logging ? console.log("label", rectangle.x, rectangle.y, rectangle, rectangle.getBounds()) : null;
    rectangle.addChild(label);
    addDragHand(rectangle, mainContainer, rectangles, webpageSprite);

});

mainContainer.on('mousedown', (event) => {
    // Check if the mouse is over any of the rectangles
    logging ? console.log('listener mousedown') : null;
    logging ? console.log("rectangles", rectangles) : null;
    for (let rectangle of rectangles) {
        logging ? console.log('rectangle selected?', rectangle.selected) : null;
        if (rectangle.selected) {
            // The mouse is over the rectangle, don't start drawing
            //console.log('over rectangle, do not draw',"recthit",rectangle.hitArea,event.offsetX, event.offsetY);
            //rectangle.selected = true;
            //rectangle.interactive = true;
            changeRectColor(rectangle,"0x0000FF");
            logging ? console.log('returning',rectangle) : null;
            return;

        } 
        logging ? console.log("recthit",rectangle.hitArea,event.offsetX, event.offsetY) : null;
    }
    // The mouse is not over any of the rectangles, start drawing
    isDrawing = true;
    startX = event.clientX;
    startY = event.clientY;
});

mainContainer.on('mouseup', () => {
    isDrawing = false;
    rectangles.forEach((r) => r.selected = false);
    logging ? console.log('Lmouseup') : null;
});

mainContainer.on('pointermove', (event) => {
    if (!isDrawing) return;
    // Clear the stage
    mainContainer.removeChildren();
    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Calculate the current position of the pointer
    endX = event.clientX;
    endY = event.clientY;

    // Calculate the dimensions of the rectangle
    let coordinates = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("coord",coordinates) : null;
  // Calculate the current position of the pointer
  endX = event.global.x - mainContainer.position.x;
  endY = event.global.y - mainContainer.position.y;
  // Calculate the dimensions of the rectangle
  const width = endX - startX;
  const height = endY - startY;

  // Create a new rectangle graphic using the calculated dimensions

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0x0000FF, 0.5); // Transparent blue
    rectangle.drawRect(coordinates.startRectX, coordinates.startRectY, coordinates.width, coordinates.height);
    rectangle.endFill();

  // Add the rectangle to the stage
  mainContainer.addChild(rectangle);

  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));
});


