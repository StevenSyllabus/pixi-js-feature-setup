//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
import * as PIXI from "pixi.js";
import '@pixi/events';
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";
import { DAS, att, colors, rects, rects2 } from "./test-data"
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
//declare
let startX, startY, endX, endY;
let isDrawing = false;
let logging = true;
let selected, over;
const rectangles = [];

// Find the rectangle with the specified name
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
        createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
    })
}
//creates rectangles based on data PLACEHOLDER
function createRect(x, y, w, h, c, id) {
    // Create a new rectangle graphic using the calculated dimensions
    const graphics = new PIXI.Graphics();
    graphics.beginFill(c);
    graphics.drawRect(x, y, w, h);
    graphics.endFill();
    graphics.interactive = true;
    graphics.on('pointerdown', (event) => {
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
        })
    } else if (id = 1) {
        DAS.forEach((das, index) => {
            //console.log(Object.keys(das));
            var rect = Object.values(das);
            //console.log(rect);
            createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], "0xDE3249", 5);
        })
    } else {
        rects2.forEach((rect, index) => {
            createRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
        })
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
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000,
    });
    label.position.set(rect.x + 20, rect.y + 20);
    console.log("label", rect.x, rect.y, rect, rect.getBounds());
    rect.addChild(label);
}
//loadDAS(DAS);

//Listeners

mainContainer.on('pointerup', (event) => {
    if (!isDrawing) return;

    // Clear the stage
    mainContainer.removeChildren();

    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Add all previously added rectangles back to the stage
    rectangles.forEach((r) => mainContainer.addChild(r));

    // Save the ending position of the pointer
    endX = event.clientX;
    endY = event.clientY;
    isDrawing = false;
/*
    let coordinates = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("coord",coordinates) : null;
    // Calculate the dimensions of the rectangle
    const width = endX - startX;
    const height = endY - startY;
*///
    let createCoord = getStartCoordinates(startX,startY,endX,endY);
    logging ? console.log("createCoord",createCoord) : null;

    //stop small box creation - Placeholder
    if (createCoord.width < 20) return;
    if (createCoord.height < 20) return;

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
    rectangle.cursor = 'hand';

    if (logging) {
        console.log('rectangle creation', rectangle, "hitArea", hitArea);
    }

    ///drag events
    /*
    rectangle.on('mousedown', () => {
        rectangle.interactive = true; // Make the rectangle interactive
        if (logging) {
            console.log('mousedown-dragtrue');
        }
    });
    rectangle.on('mousemove', (event) => {
        if (!rectangle.interactive) return;
        if (isDrawing) return;
        // Update the position of the rectangle
        rectangle.position.x += event.data.originalEvent.movementX;
        rectangle.position.y += event.data.originalEvent.movementY;
        /*reset hitArea for dragging - NEEDS WORK
        console.log('oldhitArea', rectangle.position.x, rectangle.position.y,rectangle.hitArea);
        let hitArea = new PIXI.Rectangle(rectangle.position.x, rectangle.position.y, rectangle.hitArea.width, rectangle.hitArea.height);
        rectangle.hitArea = hitArea;
        console.log('newhitArea', rectangle.hitArea);
        
        if (logging) {
            console.log('mousemove');
        }
    });
    rectangle.on('mouseup', () => {
        rectangle.interactive = false; // Stop the dragging
        if (logging) {
            console.log('mouseup-dragfalse');
        }
        rectangles.forEach((r) => r.interactive = false);
    });
    */////
 rectangle
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    // Add the rectangle to the stage and the list of rectangles
    rectangles.push(rectangle);

    //console.log("pointerup", rectangle.x, rectangle.y, rectangle);
    mainContainer.addChild(rectangle);
    //console.log("afteradd", rectangle.x, rectangle.y, rectangle);

    const x = rectangle.position.x;
    const y = rectangle.position.y;
    //    addLabel(rectangle, rectangle.name);
    const label = new PIXI.Text(rectangle.name, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0x000000,
    });
    label.position.set(rectangle.getBounds().x + 20, rectangle.getBounds().y + 20);
    if (logging) {
        console.log("label", rectangle.x, rectangle.y, rectangle, rectangle.getBounds());
    }
    rectangle.addChild(label);

});

mainContainer.on('mousedown', (event) => {
    // Check if the mouse is over any of the rectangles
    if (logging) {
        console.log('listener mousedown');
    }
    for (const rectangle of rectangles) {
        //console.log('rectangle,event,over', rectangle, event, over);
        if (over = rectangle) {
            // The mouse is over the rectangle, don't start drawing
            console.log('over rectangle, do not draw',"recthit",rectangle.hitArea,event.offsetX, event.offsetY, over);
            rectangle.selected = true;
            rectangle.interactive = true;
            changeRectColor(rectangle,"0x0000FF");
            return;
        } else if (over != rectangle) {rectangle.selected = false;}
        console.log(rectangle,"recthit",rectangle.hitArea,event.offsetX, event.offsetY);
    }
    // The mouse is not over any of the rectangles, start drawing
    isDrawing = true;
    startX = event.clientX;
    startY = event.clientY;
});

mainContainer.on('mouseup', () => {
    isDrawing = false;
    if (logging) {
        console.log('Lmouseup');
    }
});

mainContainer.on('pointermove', (event) => {
    if (logging) {
       // console.log('Lpointermove', isDrawing);
    }
    if (!isDrawing) return;
   // if (selected != null) return;

    // Clear the stage
    mainContainer.removeChildren();

    // Add the image back to the stage
    mainContainer.addChild(webpageSprite);

    // Calculate the current position of the pointer
    endX = event.clientX;
    endY = event.clientY;

    // Calculate the dimensions of the rectangle
    let coordinates = getStartCoordinates(startX,startY,endX,endY);
    //logging ? console.log("coord",coordinates) : null;

    //const width = endX - startX;
    //height = endY - startY;

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

//function for drawing in different directions
function getStartCoordinates(startX,startY,endX,endY) {
    var width, height, startRectX, startRectY;
    (startX < endX) ? (width = endX - startX) : (width = startX - endX);
    (startY < endY) ? (height = endY - startY) : (height = startY - endY);
    (startX < endX) ? (startRectX = startX) : (startRectX = endX);
    (startY < endY) ? (startRectY = startY) : (startRectY = endY);
    return { startRectX, startRectY, width, height };
}

//dag events
var logDrag = true;
function onDragStart(e) {
    
    const mousePosition = e.data.global;
    this.interactive = true; // Make the rectangle interactive
    logDrag = true ? console.log("mousePosition",mousePosition) : null;
    logDrag = true ? console.log("myRectanglePosition",this.myRectanglePosition) : null;
    if ((mousePosition.x - this.myRectanglePosition[0]<30)
     && (mousePosition.y-this.myRectanglePosition[1]<30)
    ) {
        logDrag = true ? console.log('Resizing Radius') : null;
        this.resizingRadius=true
        this.dragging = true;    
        this.draggingOffset = [mousePosition.x - this.myRectanglePosition[0], mousePosition.y - this.myRectanglePosition[1]];
    } else {
        logDrag = true ? console.log('Dragging') : null;
        this.dragging = true;
        this.draggingOffset = [mousePosition.x - this.myRectanglePosition[0], mousePosition.y - this.myRectanglePosition[1]];
    }
}

function onDragEnd(e) {
    this.resizingRadius = false;
    this.dragging = false;
    this.selected = false;
    changeRectColor(this, this.labelColor);
    
    this.interactive = false; // Stop the dragging
        if (logging) {
            console.log('DragEnd-dragfalse',this.labelColor);
        }
        rectangles.forEach((r) => r.interactive = false);
}

function onDragMove(e) {
    //logDrag = true ? console.log('DraggingMove',this.selected,this,isDrawing) : null;
    const mousePosition = e.data.global;
    if (this.selected != true) return;
    if (isDrawing) return;
    logDrag = true ? console.log('DraggingMove',this.selected,this,isDrawing) : null;
    
        //var currentWidth = this.myRectanglePosition[2];

        //this.myRectanglePosition[0] = mousePosition.x - this.draggingOffset[0];
        //this.myRectanglePosition[1] = mousePosition.y - this.draggingOffset[1];
        //this.myRectanglePosition[2] = currentWidth;


        // Update the position of the rectangle
        this.position.x += e.data.originalEvent.movementX;
        this.position.y += e.data.originalEvent.movementY;
        /*reset hitArea for dragging - NEEDS WORK
        logDrag = true ? console.log('oldhitArea', rectangle.position.x, rectangle.position.y,rectangle.hitArea) : null;
        this.hitArea. = new PIXI.Rectangle(rectangle.position.x, rectangle.position.y, rectangle.hitArea.width, rectangle.hitArea.height);
        this.hitArea = hitArea;
        console.log('newhitArea', rectangle.hitArea);
        
        logDrag = true ? console.log('mousemove') : null;
        
        }
        */
    
}


function mouseOver (e) {
    
    over = this;
    console.log("mouseover, over",this,over);
}

function mouseOut (e) {
    
    over = null;
    this.selected = null;
    console.log("mouseout, this, over",this, over);
}

function changeRectColor (sq, color) {
    logging ? console.log("changeColor") : null;
    const square = sq;
    console.log(square);
    sq.clear();
sq.beginFill(color, .5);
sq.lineStyle(square.lineStyle);
sq.drawRect(square.myRectanglePosition[0], square.myRectanglePosition[1], square.myRectanglePosition[2],square.myRectanglePosition[3]);
logging ? console.log("squareDeets",square.myRectanglePosition[0], square.myRectanglePosition[1], square.myRectanglePosition[2],square.myRectanglePosition[3]) : null;
sq.endFill();
}
