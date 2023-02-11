import * as PIXI from "pixi.js";
import { DAS, att, colors } from "./test-data";

// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>

//start C Declare before import
let logging = true;
let loadData = true;
const imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
const mainContainer = new PIXI.Container();
const ele = document.getElementById(`test`);

const app = new PIXI.Application({
  resizeTo: ele,
});

let intialWebpageWidth,
  intialCanvasWidth,
  intialScale,
  webpageSprite,
  scrollBar = <PIXI.Graphics>{};

/////////////////////NEW DRAWING
// Input modes for input
let InputModeEnum = {
  create: 1,
  select: 2,
  scale: 3,
  move: 4,
  highlighted: 5,
};

// Load textures for edit
const hrefMove =
  "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
const hrefScale =
  "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
const textureMove = PIXI.Texture.from(hrefMove);
const textureScale = PIXI.Texture.from(hrefScale);
const highlightColor = "FFFF00"; //yellow
const highlightColorAsHex = 0xffff00;
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

//seleted rectangle

//create a proxy variable to handle updates to the certain data. Proxys are a way to intercept and handle data changes. the set function is called when the data is changed. This is a way to handle data changes in a more controlled way.

const proxyVariables = new Proxy(
  {
    selectedRectangle: null,
    inputMode: InputModeEnum.create,
  },
  {
    //this is the set function. This is called when the data is changed.
    //obj is the object that is being changed
    //prop is the property that is being changed
    //value is the new value that is being set
    set: function (obj, prop, value) {
      let previousValue = obj[prop];
      console.log(`proxy previous value ${obj[prop]}`);
      console.log(`proxy current value ${value}`);

      //check if the property is selectedRectangle
      if (prop === `selectedRectangle`) {
        //check if the value is not null and the value is not the same as the previous value

        if (value && value !== previousValue) {
          console.log(`proxy value selected`, value);
          document.title = value.name;

          //loop through all of the containers on the main container (the squares)
          mainContainer.children.forEach((child) => {
            //loop through all of the graphics on the mainContainer (just the squares itself)
            child.children.forEach((child: PIXI.Graphics) => {
              //clear all of the selected states

              child.isHighlighted = false;

              //temporary if statement. This needs to be swapped to say if(child.labelID === value.labelID). This will then highlight everything that is the same labelID. Currently its just everything for testing purposes.
              if (true) {
                let borderWidth = child.line.width;
                let height = child.height - borderWidth;
                let width = child.width - borderWidth;
                child.isHighlighted = true;
                child.cursor = "move";

                //clear the drawing, and redraw the square with the highlight color
                child.clear();
                child.beginFill(highlightColorAsHex, 0.07);
                child.lineStyle(1, 0x000000, 1);

                //we minus 1 to account for the border. Theres a slight increase
                child.drawRect(0, 0, width, height);
                child.endFill();
              }
            });
          });
          value.isSelected = true;

          //set the value of the property to the new value
          obj[prop] = value;
        }
        //check if the selected shape is null and the previous value is not null
        // these runs our `deselect` function essentially
        //it also prevents this from running if we're changing the value from null to null
        else if (!value && previousValue) {
          console.log(`no proxy value running`, value);
          document.title = "No Selection";
          mainContainer.children.forEach((child) => {
            child.isSelected = false;
            child.children.forEach((child: PIXI.Graphics) => {
              child.isHighlighted = false;
              child.cursor = "pointer";
              let height = child.height - 1;
              let width = child.width - 1;
              let color = child.labelColor;
              child
                .clear()
                .beginFill(color, 1)
                .drawRect(0, 0, width, height)
                .endFill()
                .beginHole()
                .drawRect(5, 5, width - 10, height - 10)
                .endHole();
            });
          });
          obj[prop] = value;
        }
        if (obj.selectedRectangle && obj.selectedRectangle !== value) {
          obj.selectedRectangle.tint = 0xffffff;
          obj.selectedRectangle.interactive = false;
        }
      }
      if (prop === `inputMode`) {
        if (value === InputModeEnum.create) {
        } else if (value === InputModeEnum.select) {
        } else if (value === InputModeEnum.scale) {
        } else if (value === InputModeEnum.move) {
        } else if (value === InputModeEnum.highlighted) {
        }
      }
      return true;
    },
  }
);

//end C Declare

//--begin html container setup, and pixi core element setup
//--end html container setup, and pixi core element setup
PIXI.settings.ROUND_PIXELS = true;
mainContainer.name = "mainContainer";
app.stage.addChild(mainContainer);
ele.appendChild(app.view);

const screenshot = PIXI.Texture.fromURL(
  `${imgixBaseURL}https://s3.amazonaws.com/appforest_uf/d110/f1667856692397x548178556679867840/d04b59ce92d6c0885e8eea753a9283e72c1e0f97d9c6c56094f211a6abbdefb2?w=1000`
).then((texture) => {
  console.log(`finished the texture`);
  console.log(texture);
  texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;

  webpageSprite = PIXI.Sprite.from(texture);
  console.log(`finished the sprite`);
  console.log(webpageSprite);
  intialWebpageWidth = webpageSprite.width;
  webpageSprite.intialWidth = webpageSprite.width;
  mainContainer.addChild(webpageSprite);
  mainContainer.interactive = true;
  webpageSprite.name = `webpage`;

  webpageSprite.scale.set(app.view.width / webpageSprite.width);

  intialCanvasWidth = app.view.width;
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

//function for drawing in different directions
const getStartCoordinates = function (startX, startY, endX, endY) {
  var width, height, startRectX, startRectY;
  startX < endX ? (width = endX - startX) : (width = startX - endX);
  startY < endY ? (height = endY - startY) : (height = startY - endY);
  startX < endX ? (startRectX = startX) : (startRectX = endX);
  startY < endY ? (startRectY = startY) : (startRectY = endY);
  return { startRectX, startRectY, width, height };
};

//begin functions

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
    createExistingRect(
      createCoord,
      colors[index],
      att[index].Name,
      das["_id"],
      das.Attribute
    );
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

const createExistingRect = function (
  createCoord,
  color,
  name,
  uniqueID,
  labelID
) {
  // Create graphics

  if (color == "") {
    color = highlightColor;
  }

  let rectContainer = new PIXI.Container();
  rectContainer.name = name;
  console.log(`the color is: ${color}`);

  let createdRectangle = new PIXI.Graphics()
    .beginFill("0x" + color, 1)
    // returns initial graphis so we can daizy chaing

    //create rect in orgin for calculation simplification
    .drawRect(0, 0, createCoord.width, createCoord.height)
    .endFill();
  rectContainer.addChild(createdRectangle);
  createdRectangle.beginHole();
  createdRectangle.drawRect(
    5,
    5,
    createCoord.width - 10,
    createCoord.height - 10
  );
  createdRectangle.endHole();

  createdRectangle.labelColor = "0x" + color;
  createdRectangle.oldColor = "0x" + color;
  createdRectangle.name = name;
  createdRectangle.id = uniqueID;
  createdRectangle.labelID = labelID;
  createdRectangle.cursor = "pointer";
  createdRectangle.addEventListener("pointermove", (event) => {
    inputMode = InputModeEnum.select;
    const x = event.global.x - mainContainer.x;
    const y = event.global.y - mainContainer.y;
    console.log(`hit`, rectContainer.scale);
    let rectScaledWidth = createdRectangle.width * rectContainer.scale.x;
    let rectScaledHeight = createdRectangle.height * rectContainer.scale.y;
    let rectScaledX = createdRectangle.x * rectContainer.scale.x;
    let rectScaledY = createdRectangle.y * rectContainer.scale.y;
    console.log(`hit rectangle x`, event.target.x);
    console.log(`hit rectangle y`, event.target.y);
    console.log(
      `hit rectangle scaled x`,
      event.target.x * rectContainer.scale.x
    );

    if (
      x >= rectScaledX + rectScaledWidth - 10 &&
      y >= rectScaledY + rectScaledHeight - 10 &&
      createdRectangle.isHighlighted
    ) {
      console.log(
        "The mouse is in the bottom right corner and a rectangle is selected"
      );
      if (event.target.cursor !== "nwse-resize") {
        event.target.cursor = "nwse-resize";
      }

      inputMode = InputModeEnum.scale;
    } else if (createdRectangle.isHighlighted) {
      if (event.target.cursor !== "move") {
        event.target.cursor = "move";
      }
    }
  });

  // then we move it to final position
  createdRectangle.position.copyFrom(
    new PIXI.Point(createCoord.startRectX, createCoord.startRectY)
  );
  createdRectangle.addEventListener("pointerdown", (event) => {
    event.stopPropagation();
    const x = event.global.x - mainContainer.x;
    const y = event.global.y - mainContainer.y;

    if (event.target === proxyVariables.selectedRectangle) {
    }

    if (event.target !== proxyVariables.selectedRectangle)
      selectRectangle(event.target);
    //check if the mouse is in the bottom right corner, and set the mouse cursor to nwse-resize
  });
  //addLabel(currentRectangle);
  mainContainer.addChild(rectContainer);
  console.log(`the rectContainer is:`, rectContainer);
  // make it hoverable
  createdRectangle.interactive = true;

  // remove it from current ceration and chose new color for next one
  addLabel(createdRectangle);
  console.log("currentRect that im testing", createdRectangle);
  createdRectangle.intialScale = app.view.width / intialWebpageWidth;
  rectContainer.intialScale = app.view.width / intialWebpageWidth;
  console.log(
    `Created shape the intial scale is: ${createdRectangle.intialScale}`
  );

  currentRectangle = null;
};

const onRectangleOver = function () {
  console.log(`onRectangleOver`);
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
  // set current hovered rect to be on the top
  bringShapeToFront(this);
  // Create button move
  // const buttonMove = new PIXI.Sprite(textureMove);
  // // set anchor middle
  // buttonMove.anchor.set(0.5);
  // // Set control top right
  // buttonMove.x = this.x + this.width - 18;
  // buttonMove.y = this.y + 23;

  // // make interactive...
  // buttonMove.interactive = true;
  // buttonMove.cursor = "grab";
  // // Add events/pass object to pointerdown event so we know which button/control is pressed
  // buttonMove
  //   .on("pointerover", controlOver)
  //   .on("pointerout", controlOut)
  //   .on("pointerdown", startResizeOrMove, {
  //     controller: buttonMove,
  //     edit: this,
  //     mode: InputModeEnum.move,
  //   });
  // mainContainer.addChild(buttonMove);
  // // add to control queue
  // controls.push(buttonMove);

  // // const buttonScale = new PIXI.Sprite(textureScale);
  // // // same as for move but on bottom right corner
  // // buttonScale.anchor.set(0.5);
  // // buttonScale.x = this.x + this.width - 20;
  // // buttonScale.y = this.y + this.height - 20;

  // // // make the buttonScale interactive...
  // // buttonScale.interactive = true;
  // // buttonScale.cursor = "nwse-resize";
  // // buttonScale
  // //   .on("pointerover", controlOver)
  // //   .on("pointerout", controlOut)
  // //   .on("pointerdown", startResizeOrMove, {
  // //     controller: buttonScale,
  // //     edit: this,
  // //     mode: InputModeEnum.scale,
  // //   });

  // mainContainer.addChild(buttonScale);
  // controls.push(buttonScale);
};
//this function
const cleanupcontrols = function () {
  console.log("cleanupcontrols");
  console.log("controls", controls);
  controls = controls.filter((el) => el.parent);
  if (controls.length == 0) {
    onDragEnd();
  }
  console.log("controls after", controls);
};

const removeIfUnused = function (control) {
  console.log("removeIfUnused", control);
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
  console.log(`onRectangleOut`);
  this.isOver = false;
  inputMode = InputModeEnum.create;
  controls.forEach((control) => removeIfUnused(control));
};

// Normalize start and size of square so we always have top left corner as start and size is always +
const getStartAndSize = function (pointA, pointB, type) {
  console.log(`getStartAndSize`, pointA, pointB, type);
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
  return;
};

//these two are slightly different, could probably be combined
const scaleExistingRectangle = function (
  resizeRectange: PIXI.Graphics,
  dragController
) {
  //currentPosition)
  console.log(`scaleExistingRectangle`);
  let { start, size } = getStartAndSize(
    startPosition,
    dragController.position,
    "scaleRect"
  );
  if (size.x < 20 || size.y < 20) return;
  // When we scale rect we have to give it new cordinates so we redraw it
  // in case of sprite we would do this a bit differently with scale property,
  // for simple geometry this is better solution because scale propagates to children
  console.log(`the resizeRect `, resizeRectange);
  const rectangleColor = resizeRectange.labelColor;
  console.log(`the resize colro is: ${rectangleColor}`);
  let startPositionController = new PIXI.Point(
    dragController.position.x - 20,
    dragController.position.y - 20
  );
  resizeRectange.clear();
  resizeRectange.position.copyFrom(start);
  resizeRectange
    .beginFill(resizeRectange.labelColor, 1)
    .drawRect(0, 0, size.x, size.y)
    .endFill();
  resizeRectange.beginHole();
  resizeRectange.drawRect(5, 5, size.x - 10, size.y - 10);
  resizeRectange.endHole();

  dragController.position.copyFrom(startPositionController);
};

const drawRectangle = function (resizeRectange, currentPosition) {
  console.log("drawRectangle");
  let { start, size } = getStartAndSize(startPosition, currentPosition, "draw");
  if (size.x < 5 || size.y < 5) return;
  // When we scale rect we have to give it new cordinates
  resizeRectange.clear();
  resizeRectange.position.copyFrom(start);

  //child
  //   .clear()
  //   .beginFill(color, 1)
  //   .drawRect(0, 0, width, height)
  //   .endFill()
  //   .beginHole()
  //   .drawRect(5, 5, width - 10, height - 10)
  //   .endHole();
  // });
  resizeRectange
    .beginFill(highlightColorAsHex, 0.5)
    .lineStyle({
      color: 0x000000,
      alpha: 0.5,
      width: 1,
    })
    .drawRect(0, 0, size.x, size.y)
    .endFill();
};

const moveRectangle = function (resizeRectange, dragController) {
  console.log("moveRectangle");
  // Move control is on right side
  // and our rect is anchored on the left we substact width of rect

  let startPosition = new PIXI.Point(
    dragController.position.x - resizeRectange.width,
    dragController.position.y
  );

  // we just move the start position
  resizeRectange.position.copyFrom(startPosition);
};
const selectRectangle = function (rectangle) {
  console.log(`selectedRectangle`, rectangle);
  proxyVariables.selectedRectangle = rectangle;
};
//onDragMoveNew
const onDragMoveNew = function (event) {
  console.log(`onDragMoveNew`);
  if (dragController) {
    // move control icon (move or scale icon)
    dragController.parent.toLocal(
      event.data.global,
      null,
      dragController.position
    );
    if (inputMode == InputModeEnum.scale) {
      // handle rect scale
      scaleExistingRectangle(currentRectangle, dragController);
    }
    if (inputMode == InputModeEnum.move) {
      // handle rect move
      moveRectangle(currentRectangle, dragController);
    }
  }
};

const startResizeOrMove = function () {
  console.log(`startResizeOrMove: pointerdown on the element`);
  // start drag of controller
  // and set parameters
  this.controller.alpha = 0.5;
  dragController = this.controller;
  currentRectangle = this.edit;
  startPosition = new PIXI.Point().copyFrom(this.edit.position);
  inputMode = this.mode;
  mainContainer.on("pointermove", onDragMoveNew);
};

const onDragEnd = function (e) {
  console.log(`onDragEnd: pointerup, pointerout on the element`, e);
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
const bringShapeToFront = function (sprite) {
  console.log(`bringShapeToFront`);
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

//add all main container event listeners
mainContainer.on("pointerupoutside", (e) => onDragEnd(e));
mainContainer.on("pointerdown", (e) => {
  console.log(`mainContainer pointerdown`, e.target);
  // Initiate rect creation
  console.log(inputMode);
  if (inputMode == InputModeEnum.create) {
    proxyVariables.selectedRectangle = null;

    startPosition = new PIXI.Point().copyFrom(e.global);
    console.log(`selected rectangle`, proxyVariables.selectedRectangle);

    logging ? console.log("pointerdown", startPosition) : null;
  }

  if (inputMode == InputModeEnum.move) {
  }
});

mainContainer.on("pointermove", (e) => {
  e.stopPropagation();
  console.log(`mainContainer pointermove`);
  console.log(`mainContainer target`, e.target == mainContainer);
  inputMode = InputModeEnum.create;

  if (e.target == mainContainer) {
  } else {
    if (e.target.isHighlighted) {
      inputMode = InputModeEnum.move;
    } else inputMode = InputModeEnum.select;
  }

  for (let property in InputModeEnum) {
    if (InputModeEnum[property] == inputMode) {
      console.log(`property`, property);
    }
  }
  console.log(`currentRectangle`, currentRectangle);
  console.log(`currentTarget`, e.currentTarget.children);
  // Do this routine only if in create mode and have started creation
  // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
  if (startPosition) {
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
          .beginFill(highlightColorAsHex, 0.0)
          .lineStyle({
            color: 0x000000,
            alpha: 1,
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
        drawRectangle(currentRectangle, currentPosition);
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
  console.log(`mainContainer pointerup`);
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
  onDragEnd(e);
});
