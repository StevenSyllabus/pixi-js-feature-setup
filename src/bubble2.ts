function(instance, context) {

    instance.data.start = true;
    instance.data.addedScreenshot = false;
    instance.data.mainContainer;
    instance.data.webPageSprite;
    instance.data.rectangles = [];
    instance.data.logging = false;
    instance.data.intialWebpageWidth;
    instance.data.resizeActive = false;
    instance.data.logResize = false;
    instance.data.logDrag = false;
    instance.data.resizeHandles = [];
    instance.data.randomElementID = `pixi-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`;
    console.log(instance.data.randomElementID);
    
     instance.data.createScrollBar = (mainContainer, pixiApp, div) => {
        div.pressed = false
        console.log(`div press status`, div.pressed)

        const scrollBarWidth = 14;
        const scrollbar = new PIXI.Graphics();
        scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

        let scrollingTimeout;
        scrollbar.interactive = true;

        scrollbar.beginFill(0x808080);
        scrollbar.drawRect(
            pixiApp.view.width - scrollBarWidth,
            0,
            scrollBarWidth,
            pixiApp.view.height * (pixiApp.view.height / mainContainer.height)
        );
        scrollbar.alpha = 0.5;
        scrollbar.endFill();
        scrollbar.addEventListener("pointerover", (e) => {
            scrollbar.alpha = 1;
        });
        scrollbar.addEventListener("pointerout", (e) => {
            scrollbar.tint = 0xffffff;
            scrollbar.alpha = 0.5;
            //make it slightly transparent when not hovering over the
        });

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
    }

    instance.data.handleResize = (
        event,
        pixiApp,
        mainContainer,
        webpageSprite,
        intialWebpageWidth
    ) => {
        let intialScale = pixiApp.view.width / instance.data.intialWebpageWidth;
        let endingWidth, newPercent;
        console.log(instance.data.intialWebpageWidth)

        mainContainer.children.forEach((child) => {
            let childIntialScale = child.intialScale;
            let childIntialPosition = child.position.x;

            let newScale = intialScale / childIntialScale;
            let startingWidth = webpageSprite.width;
            console.log(`webpage`, child.name)
            if (child.name === `webpage`) {

                child.scale.set(newScale);
                endingWidth = webpageSprite.width;
                newPercent = endingWidth / startingWidth;
                console.log(`newPercent: ${newPercent}`);
            } else if (child.lastMoveX || child.lastMoveY) {
                child.scale.set(newScale);
               
                if (newPercent !== 1) {
                    console.log(`newPercent: ${newPercent}`);
                    console.log(`dissapearing the child`)
                    child.position.x = child.position.x * newPercent;
                    child.position.y = child.position.y * newPercent;
                }
                if (newPercent === 1) {
                }
            } else {
                child.scale.set(newScale);
            }
        });

        //   resizeTimeout = setTimeout(() => {
        //     console.log(`resize timeout`);
        //     console.log(pixiApp.view.width / webpageSprite.intialWidth);
        //   }, 100);
    }

    instance.data.updateScrollBarPosition = (
        mainContainer,
        pixiApp,
        scrollbar
    ) => {
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
    }

/////////////////////NEW DRAWING
// Input modes for input
instance.data.inputModeEnum = {
    create: 1,
    select: 2,
    scale: 3,
    move: 4
};

// Load textures for edit
instance.data.hrefMove = "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
instance.data.hrefScale = "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
instance.data.textureMove = PIXI.Texture.from(instance.data.hrefMove);
instance.data.textureScale = PIXI.Texture.from(instance.data.hrefScale);
instance.data.highlightColor = "FFFF00"; //yellow
instance.data.dragColor = "DE3249"; //red
instance.data.resizeColor = "FFFF00";//"0000FF"; //blue

// Start position of events
instance.data.startPosition = null;

// Current edited or created rectangle
currentRectangle = null;
// Set mode for whole input (by default we create rectangles)
instance.data.inputMode = instance.data.inputModeEnum.create;

// Pointer to current active control (Move or Scale icon)
instance.data.dragController = null;
// Active shown controls (can be shown both or one hovered / active)
instance.data.controls = [];
            
instance.data.getStartCoordinates = (startX, startY, endX, endY) => {
  var width, height, startRectX, startRectY;
  startX < endX ? (width = endX - startX) : (width = startX - endX);
  startY < endY ? (height = endY - startY) : (height = startY - endY);
  startX < endX ? (startRectX = startX) : (startRectX = endX);
  startY < endY ? (startRectY = startY) : (startRectY = endY);
  return { startRectX, startRectY, width, height };
}
//loads & reformats Drawn Attribute Snippets
instance.data.loadDAS = (das, mainContainer) => {
    das.forEach((das, index) => {
        //var rect = Object.values(das);
        //console.log(rect);
        //will need placeholder for color. may need to generate specific
        let createCoord = instance.data.getStartCoordinates(
            das["X Coordinate (960)"],
            das["Y Coordinate (960)"],
            das["Box Width 250"] * 3,
            das["Box Height 250"] * 3
        );
        instance.data.logging ? console.log("createCoord", createCoord) : null;

        //stop small box creation - Placeholder
        if (createCoord.width < 20) return;
        if (createCoord.height < 20) return;
console.log("att", att[0]);
        instance.data.createExistingRect(createCoord, colors[index], att[index].Name,mainContainer);
        //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
    });
}

instance.data.addLabel = (rect) =>  {
    const label = new PIXI.Text(rect.name, {
        fontFamily: "Inter",
        fontSize: 24,
        stroke: 0x000000,
        strokeThickness: 1,
        dropShadow: true,
        dropShadowColor: 0xFFFFFF,
        dropShadowDistance: 0,
        dropShadowBlur: 2,
        wordWrap: true,
        wordWrapWidth: rect.width,
        breakWords: true
    });
    true ? console.log("label", label, rect, rect.getBounds()) : null;
    rect.addChild(label);
    label.position.set(10, 10);
}

instance.data.createExistingRect = (createCoord, color, name, mainContainer) => {
    // Create graphics
    if (color == "") {color = instance.data.highlightColor}
    let currentRectangle = new PIXI.Graphics()
        .beginFill("0x"+ color, 0.5)
        // returns initial graphis so we can daizy chaing
        .lineStyle({
            color: 0x111111,
            alpha: 0,
            width: 1
        })
        //create rect in orgin for calculation simplification
        .drawRect(0, 0, createCoord.width,
            createCoord.height)
        .endFill()

    currentRectangle.labelColor = "0x" + color;
    currentRectangle.oldColor = "0x" + color;
    currentRectangle.name = name;
    // then we move it to final position
    currentRectangle.position.copyFrom(new PIXI.Point(createCoord.startRectX,
        createCoord.startRectY));
    //instance.data.addLabel(currentRectangle);
    mainContainer.addChild(currentRectangle);
    // make it hoverable
    currentRectangle.interactive = true;
    currentRectangle
        .on('pointerover', instance.data.onRectangleOver)
        .on('pointerout', instance.data.onRectangleOut);
    // remove it from current ceration and chose new color for next one
    instance.data.addLabel(currentRectangle);
    console.log("currentRect", currentRectangle);
    instance.data.currentRectangle = null;
 
}

// Function that generates test rect 
instance.data.testRect = () => {
    // Create graphics
    let currentRectangle = new PIXI.Graphics()
        .beginFill("0x"+instance.data.highlightColor, 0.5)
        // returns initial graphis so we can daizy chaing
        .lineStyle({
            color: 0x111111,
            alpha: 0,
            width: 1
        })
        // we create rect in orgin for calculation simplification
        .drawRect(0, 0, 100, 100)
        .endFill()
    // then we move it to final position
    currentRectangle.labelColor = "0x";
    currentRectangle.oldColor = "0xFFFF00";
    currentRectangle.name = "0xFFFF00";
    currentRectangle.position.copyFrom(new PIXI.Point(100, 100))
    instance.data.addLabel(currentRectangle);
    mainContainer.addChild(currentRectangle)
    // make it hoverable
    currentRectangle.interactive = true;
    //instance.data.addLabel(currentRectangle);
    currentRectangle
        .on('pointerover', instance.data.onRectangleOver)
        .on('pointerout', instance.data.onRectangleOut);
    instance.data.currentRectangle = null;
}
//instance.data.testRect()
instance.data.controlOver = () => {
    this.isOver = true;
}

instance.data.controlOut = () => {
    this.isOver = false;
    instance.data.removeIfUnused(this)
}

instance.data.onRectangleOver = () => {
    // Do not hover rectangle if we are moving
    if (instance.data.inputMode == instance.data.inputModeEnum.move || instance.data.inputMode == instance.data.inputModeEnum.scale) {
        return
    }
    // Do not hover rectangle if we creating
    if (instance.data.inputMode == instance.data.inputModeEnum.create && instance.data.startPosition) {
        return
    }
    console.log("Over")
    this.isOver = true;
    instance.data.inputMode = instance.data.inputModeEnum.select
    // set current hovered rect to be on the top
    instance.data.bringToFront(this)
    // Create button move
    const buttonMove = new PIXI.Sprite(instance.data.textureMove);
    // set anchor middle
    buttonMove.anchor.set(0.5);
    // Set control top right
    buttonMove.x = this.x + this.width - 18;
    buttonMove.y = this.y + 23;

    // make interactive...
    buttonMove.interactive = true;
    buttonMove.cursor = 'grab';
    // Add events/pass object to pointerdown event so we know which button/control is pressed
    buttonMove.on('pointerover', instance.data.controlOver)
        .on('pointerout', instance.data.controlOut)
        .on('pointerdown', instance.data.onDragStartNew, {
            controller: buttonMove,
            edit: this,
            mode: instance.data.inputModeEnum.move
        });
    mainContainer.addChild(buttonMove);
    // add to control queue
    instance.data.controls.push(buttonMove);

    const buttonScale = new PIXI.Sprite(instance.data.textureScale);
    // same as for move but on bottom right corner
    buttonScale.anchor.set(0.5);
    buttonScale.x = this.x + this.width - 20;
    buttonScale.y = this.y + this.height - 20;

    // make the buttonScale interactive...
    buttonScale.interactive = true;
    buttonScale.cursor = 'nw-resize';
    buttonScale.on('pointerover', instance.data.controlOver)
        .on('pointerout', instance.data.controlOut)
        .on('pointerdown', instance.data.onDragStartNew, {
            controller: buttonScale,
            edit: this,
            mode: instance.data.inputModeEnum.scale
        });

    mainContainer.addChild(buttonScale);
    instance.data.controls.push(buttonScale);
}

instance.data.cleanupcontrols = () => {
    instance.data.controls = instance.data.controls.filter(el => el.parent)
    if (instance.data.controls.length == 0) {
        instance.data.onDragEndNew()
    }
}

instance.data.removeIfUnused = (control) => {
    // Give time to PIXI to go trough events and add event on end
    setTimeout(() => {
        // By this time isOver is updated so if we went from
        // square to conntroll controll.isOver become true
        // if we are draging controll and went out of it
        // we dont remove it because it is still used
        if (!control.isOver && control !== instance.data.dragController) {
            mainContainer.removeChild(control);
            instance.data.cleanupcontrols()
        }
    }, 0)
}

// Event is triggered when we move mouse out of rectangle
instance.data.onRectangleOut = () => {
    this.isOver = false;
    console.log("OUT");
    instance.data.controls.forEach(control => instance.data.removeIfUnused(control))
}

// Normalize start and size of square so we always have top left corner as start and size is always +
instance.data.getStartAndSize = (pointA, pointB, type) => {
    let deltaX = pointB.x - pointA.x;
    let deltaY = pointB.y - pointA.y;
    let absDeltaX = Math.abs(deltaX)
    let absDeltaY = Math.abs(deltaY)
    let startX = deltaX > 0 ? pointA.x : pointB.x
    let startY = deltaY > 0 ? pointA.y : pointB.y
    if (type == "scaleRect") {
    return {
        start: new PIXI.Point(startX, startY),
        size: new PIXI.Point(absDeltaX, absDeltaY)
    }} else if (type == "draw") {    return {
        start: new PIXI.Point(startX - mainContainer.position.x, startY - mainContainer.position.y),
        size: new PIXI.Point(absDeltaX, absDeltaY)
    }
        
    }
}

//these two are slightly different, could probably be combined
instance.data.scaleRect = (resizeRectange, dragController) => {
    //currentPosition)
    let {
        start,
        size
    } = instance.data.getStartAndSize(instance.data.startPosition, dragController.position, "scaleRect")
    if (size.x < 20 || size.y < 20) return
    // When we scale rect we have to give it new cordinates so we redraw it
    // in case of sprite we would do this a bit differently with scale property,
    // for simple geometry this is better solution because scale propagates to children

    let startPositionController = new PIXI.Point(dragController.position.x - 20, dragController.position.y - 20);
    resizeRectange.clear()
    resizeRectange.position.copyFrom(start)
    resizeRectange.beginFill("0x" + instance.data.resizeColor, .5)
        .lineStyle({
            color: 0x111111,
            alpha: 0.5,
            width: 1
        })
        .drawRect(0, 0, size.x, size.y)
        .endFill()

    dragController.position.copyFrom(startPositionController)
    console.log("scaleRect, startPos, startPosController,instance.data.dragController,mainContainer",instance.data.startPosition,startPositionController,dragController.position,mainContainer.position);
}

instance.data.scaleRectB = (resizeRectange, currentPosition) => {
    let {start,size} = instance.data.getStartAndSize(instance.data.startPosition, currentPosition, "draw");
    console.log("scaleRectB");
    if (size.x < 5 || size.y < 5) return
    // When we scale rect we have to give it new cordinates
    resizeRectange.clear()
    resizeRectange.position.copyFrom(start)
    resizeRectange.beginFill("0x"+ instance.data.resizeColor, .5)
        .lineStyle({
            color: "0x"+instance.data.resizeColor,
            alpha: 0.5,
            width: 1
        })
        .drawRect(0, 0, size.x, size.y)
        .endFill()
}

instance.data.moveRect = (resizeRectange, dragController) => {
    // Move control is on right side
    // and our rect is anchored on the left we subtract width of rect
    instance.data.startPosition = new PIXI.Point(dragController.position.x - resizeRectange.width, dragController.position.y);
    let startPositionController = new PIXI.Point(dragController.position.x - 18, dragController.position.y + 23);
    // we just move the start position
    resizeRectange.position.copyFrom(instance.data.startPosition)
    dragController.position.copyFrom(startPositionController)
}
instance.data.selectRect = (rectangle) => {
    alert("Hello, " + rectangle.name + "!"); //rectangle.isSelected = true;
}

instance.data.onDragMoveNew = (event) => {
    if (instance.data.dragController) {
        // move control icon (move or scale icon)
        instance.data.dragController.parent.toLocal(event.data.global, null, instance.data.dragController.position);
        if (instance.data.inputMode == instance.data.inputModeEnum.scale) {
            // handle rect scale
            instance.data.scaleRect(instance.data.currentRectangle, instance.data.dragController)
        }
        if (instance.data.inputMode == instance.data.inputModeEnum.move) {
            // handle rect move
            instance.data.moveRect(instance.data.currentRectangle, instance.data.dragController)
        }
    }
}

instance.data.onDragStartNew = () => {
    // start drag of controller
    // and set parameters
    this.controller.alpha = 0.5;
    instance.data.dragController = this.controller;
    instance.data.currentRectangle = this.edit
    instance.data.startPosition = new PIXI.Point().copyFrom(this.edit.position)
    instance.data.inputMode = this.mode
    mainContainer.on('pointermove', instance.data.onDragMoveNew);
}

instance.data.onDragEndNew = () => {
    // stop drag, remove parameters
    // return input mode to default
    if (instance.data.dragController) {
        mainContainer.off('pointermove', instance.data.onDragMoveNew);
        instance.data.dragController.alpha = 1;
        instance.data.currentRectangle = null;
        instance.data.dragController = null;
    }
    instance.data.startPosition = null;
    instance.data.inputMode = instance.data.inputModeEnum.create;
}
///experimental
instance.data.bringToFront = (sprite) => {
    var sprite = (typeof(sprite) != "undefined") ? sprite.target || sprite : this;
    var parent = sprite.parent || {
        "children": false
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

    //end chris functions

}