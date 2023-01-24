//@ts-nocheck
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
import * as PIXI from "pixi.js";
import "@pixi/events";
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";
import { DAS, att, colors, rects, rects2 } from "./test-data";
//--begin html container setup, and pixi core element setup
const canvasElement = <HTMLDivElement>document.getElementById(`app`);
const mainDivContainer = <HTMLDivElement>(
  document.getElementById(`mainContainer`)
);
const imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
//--end html container setup, and pixi core element setup
PIXI.settings.ROUND_PIXELS = true;

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
//csp change
//canvasElement.appendChild(renderer.view);
canvasElement.appendChild(app.view);

//create a container for the webpage and add it to the stage
const mainContainer = new PIXI.Container();
app.stage.addChild(mainContainer);

//create a sprite for the webpage and add it to the container
let intialWebpageWidth,
  intialWebpageHeight,
  intialCanvasWidth,
  intialCanvasHeight,
  intialScale,
  webpageSprite;

let startX, startY, endX, endY;
let isDrawing = false;
let logging = true;
const rectangles = [];
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

  // Save the ending position of the pointer
  endX = event.global.x - mainContainer.x;
  endY = event.global.y - mainContainer.y;
  isDrawing = false;
  console.log(`testest`);

  // Calculate the dimensions of the rectangle
  const width = endX - startX;
  const height = endY - startY;

  //stop small box creation - Placeholder
  if (width < 20) return;
  if (height < 20) return;

  // Create a new rectangle graphic using the calculated dimensions
  const rectangle = new PIXI.Graphics();
  rectangle.beginFill(0xffff00, 0.5);
  rectangle.drawRect(startX, startY, width, height);
  rectangle.endFill();
  rectangle.interactive = true;
  rectangle.interactive = false;
  rectangle.intialWidth = width;

  rectangle.name = Math.random().toString(16).substr(2, 8);

  //set hitArea for dragging
  const hitArea = new PIXI.Rectangle(startX, startY, width, height);
  rectangle.hitArea = hitArea;

  //add a hand
  rectangle.cursor = "hand";

  if (logging) {
    console.log("rectangle creation", rectangle);
  }

  ///drag events
  rectangle.on("mousedown", () => {
    rectangle.interactive = true; // Make the rectangle interactive
    if (logging) {
      console.log("mousedown-dragtrue");
    }
  });
  rectangle.on("mousemove", (event) => {
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
        */
    if (logging) {
      console.log("mousemove");
    }
  });
  rectangle.on("mouseup", () => {
    rectangle.interactive = false; // Stop the dragging
    if (logging) {
      console.log("mouseup-dragfalse");
    }
    rectangles.forEach((r) => (r.interactive = false));
  });

  // Add the rectangle to the stage and the list of rectangles
  rectangles.push(rectangle);

  //console.log("pointerup", rectangle.x, rectangle.y, rectangle);
  mainContainer.addChild(rectangle);
  //console.log("afteradd", rectangle.x, rectangle.y, rectangle);

  const x = rectangle.position.x;
  const y = rectangle.position.y;
  //    addLabel(rectangle, rectangle.name);
  const label = new PIXI.Text(rectangle.name, {
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0x000000,
  });
  label.position.set(startX + 20, startY + 20);
  if (logging) {
    console.log(
      "label",
      rectangle.x,
      rectangle.y,
      rectangle,
      rectangle.getBounds()
    );
  }
  rectangle.addChild(label);
});

mainContainer.addEventListener("pointerdown", (event) => {
  // Check if the mouse is over any of the rectangles
  if (logging) {
    console.log("listener mousedown");
  }
  for (const rectangle of rectangles) {
    //console.log('rectangle,event', rectangle, event);
    if (rectangle.hitArea.contains(event.offsetX, event.offsetY)) {
      // The mouse is over the rectangle, don't start drawing
      //console.log('over rectangle, do not draw');
      return;
    }
  }
  // The mouse is not over any of the rectangles, start drawing
  console.log(`clicky`);
  isDrawing = true;

  startX = event.global.x - mainContainer.position.x;
  startY = event.global.y - mainContainer.position.y;
});

mainContainer.on("mouseup", () => {
  isDrawing = false;
  if (logging) {
    console.log("Lmouseup");
  }
});

mainContainer.addEventListener("pointermove", (event) => {
  if (logging) {
    console.log("Lpointermove", isDrawing);
  }
  if (!isDrawing) return;

  // Clear the stage
  mainContainer.removeChildren();

  // Add the image back to the stage
  mainContainer.addChild(webpageSprite);

  // Calculate the current position of the pointer
  endX = event.global.x - mainContainer.position.x;
  endY = event.global.y - mainContainer.position.y;
  // Calculate the dimensions of the rectangle
  const width = endX - startX;
  const height = endY - startY;

  // Create a new rectangle graphic using the calculated dimensions

  const rectangle = new PIXI.Graphics();
  rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
  rectangle.drawRect(startX, startY, width, height);
  rectangle.endFill();

  // Add the rectangle to the stage
  mainContainer.addChild(rectangle);

  // Add all previously added rectangles back to the stage
  rectangles.forEach((r) => mainContainer.addChild(r));
});
