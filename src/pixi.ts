//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
//start C Declare before import
let startX, startY, endX, endY;
let isDrawing = false;
let logging = true;
let loadData = false;
const rectangles = [];
//end C Declare

import * as PIXI from "pixi.js";
import '@pixi/events';
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";
import { DAS, att, colors, rects, rects2 } from "./test-data";
import { onDragStart, onDragEnd, onDragMove, mouseOut, mouseOver, handleResizer, removeRectangle, addDragHand, getStartCoordinates, changeRectColor, logDrag, logResize} from "./events";
//--begin html container setup, and pixi core element setup
//const canvasElement = document.getElementById(`app`);
//const mainDivContainer = document.getElementById(`mainContainer`);
//--end html container setup, and pixi core element setup
const ele = document.getElementById(`test`);
//intialize pixi
/*
const renderer = PIXI.autoDetectRenderer({
    //width: properties.bubble.width(),
   //height: properties.bubble.height(),
   backgroundColor: 0x2980b9

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
  `https://dd7tel2830j4w.cloudfront.net/d110/f1667856689965x312820165751551200/3b557354f48767d0cc7efb785a512fd02d9d8c1f177e8fb51092dea464924812?ignore_imgix=true`
);
const webpageSprite = PIXI.Sprite.from(screenshot);
webpageSprite.interactive = true;
/*
*/
mainContainer.addChild(webpageSprite);
//scale the container to the width of the canvas. This scales everything inside
//mainContainer.scale.set(app.view.width / mainContainer.width);
app.stage.addChild(mainContainer);
//end of screenshot setup

//**begin creating the scrollbar
const maxScroll = mainContainer.height - app.view.height;
const scrollbar = new PIXI.Graphics();
app.stage.addChild(scrollbar);
//update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container
canvasElement.addEventListener("wheel", (event) => {
  // Update the container's y position based on the mouse wheel delta
  mainContainer.position.y += event.deltaY;

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
});
//*end of scrollbar setup */

//resize the container and scrollbar when the window is resized
//app.renderer.on(`resize`, handleResize);
function handleResize(e) {
  console.log(`resize`);
  const scrollPercent = -mainContainer.position.y / maxScroll;
  const scrollbarHeight =
    app.view.height * (app.view.height / mainContainer.height);
    if (logging) {console.log((app.view.height / mainContainer.height))}
  const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
  scrollbar.clear();
  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(app.view.width - 8, scrollbarY, 14, scrollbarHeight);
  scrollbar.endFill();
  if (app.view.width !== mainContainer.width) {
    mainContainer.scale.set(app.view.width / mainContainer.width);
  }
}

///START CHRIS CODE
//test data loaded from test-data.ts
//var DAS = properties.das;
//var att = properties.att
//var colors = properties.colors;

// Find the rectangle with the specified names
function findRect(name) {
  const foundRectangle = rectangles.find((r) => r.name === name);  
  if (foundRectangle) {return foundRectangle}
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
rectangle.interactive = true;
rectangle.dragging = false;
rectangle.name = id;
rectangle.buttonMode = true;
rectangle.resizingRadius = false;
rectangle.myRectanglePosition = [
    createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height
];
//set hitArea for dragging
const hitArea = new PIXI.Rectangle(createCoord.startRectX, createCoord.startRectY, createCoord.width, createCoord.height);
rectangle.hitArea = hitArea;

//add a hand
rectangle.cursor = 'hand';

logging ? console.log('rectangle creation', rectangle, "hitArea", hitArea) : null;

rectangle
    //.on('mouseover', mouseOver)
    //.on('mouseout', mouseOut)
    .on('pointerdown', function(e){
        logging ? console.log('rect-pointerdown',e.clientX, e.clientY) : null;
        this.selected = true;
        isDrawing = false;
        onDragStart(e,this,rectangles);}) 
    .on('pointerup', function(e){
        isDrawing = false;
        this.selected = false;
        onDragEnd(e,this,rectangles);}) 
    .on('pointerupoutside', function(e){
        isDrawing = false;
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
function addLabel(rect, label1, x, y) {
    const label = new PIXI.Text(label1, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000,
    });
    label.position.set(x + 20, y + 20);
    logging ? console.log("label", x, y, rect, rect.getBounds()) : null;
    rect.addChild(label);
}
loadData ? loadDAS(DAS) : null;

//Listeners

mainContainer.on('pointerup', (event) => {
    if (!isDrawing) return;

    // Clear the stage
    mainContainer.removeChildren();

    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Add all previously added rectangles back to the stage
    rectangles.forEach((r) => mainContainer.addChild(r));

    let createCoord = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("createCoord",createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

    createRectangle(createCoord, "DE3249", "temp");

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

