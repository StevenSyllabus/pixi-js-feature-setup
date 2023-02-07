function(instance, properties, context) {
    ////////////// NOTE TO STEVEN: added these globally, as they needed to be defined, apparently
    let mainContainer, app, renderer, canvasElement, ele, screenshot;
    //instance.data.startX, instance.data.startY, instance.data.endX, instance.data.endY;
    let isDrawing = false;
    let logRectEvents = false;
    let loadData = true;
    let logEvents = false;
    let initialMousePosX, initialMousePosY, currentMousePosY, currentMousePosX;
    let initialRectWidth;
    let initialRectHeight;
    let intialWebpageHeight,
        intialCanvasWidth,
        intialCanvasHeight,
        intialScale,
        webpageSprite,
        scrollBar,
        imgixBaseURL;
    let resizeTimeout = null;
    //c functions
     //context// Input modes for input
     let InputModeEnum = {
        create: 1,
        select: 2,
        scale: 3,
        move: 4
    };
    
    // Load textures for edit
    const hrefMove = "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
    const hrefScale = "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
    const textureMove = PIXI.Texture.from(hrefMove);
    const textureScale = PIXI.Texture.from(hrefScale);
    const highlightColor = "FFFF00"; //yellow
    const dragColor = "DE3249"; //red
    const resizeColor = "FFFF00";//"0000FF"; //blue
    
    // Start position of events
    let startPosition = null;
    instance.data.startPosition = null;
    // Current edited or created rectangle
    let currentRectangle = null;
    // Set mode for whole input (by default we create rectangles)
    let inputMode = InputModeEnum.create;
    
    // Pointer to current active control (Move or Scale icon)
    let dragController = null;
    // Active shown controls (can be shown both or one hovered / active)
    let controls = [];
    // Event is triggered when we move mouse out of rectangle
    // Event is triggered when we move mouse out of rectangle
function cleanupcontrols() {
    controls = controls.filter(el => el.parent)
    if (controls.length == 0) {
        onDragEndNew()
    }
}


// Normalize start and size of square so we always have top left corner as start and size is always +
function getStartAndSize(pointA, pointB, type) {
    console.log("pointA,poi ntB, typ",pointA, pointB, type)
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
    function removeIfUnused(control) {
    // Give time to PIXI to go trough events and add event on end
    setTimeout(() => {
        // By this time isOver is updated so if we went from
        // square to conntroll controll.isOver become true
        // if we are draging controll and went out of it
        // we dont remove it because it is still used
        if (!control.isOver && control !== dragController) {
            instance.data.mainContainer.removeChild(control);
            cleanupcontrols()
        }
    }, 0)
}
    function scaleRect(resizeRectange, dragController) {
    //currentPosition)
    let {
        start,
        size
    } = getStartAndSize(instance.data.currentPosition, dragController.position, "scaleRect")
    if (size.x < 20 || size.y < 20) return
    // When we scale rect we have to give it new cordinates so we redraw it
    // in case of sprite we would do this a bit differently with scale property,
    // for simple geometry this is better solution because scale propagates to children

    let startPositionController = new PIXI.Point(dragController.position.x - 20, dragController.position.y - 20);
    resizeRectange.clear()
    resizeRectange.position.copyFrom(start)
    resizeRectange.beginFill("0x" + resizeColor, .5)
        .lineStyle({
            color: 0x111111,
            alpha: 0.5,
            width: 1
        })
        .drawRect(0, 0, size.x, size.y)
        .endFill()

    dragController.position.copyFrom(startPositionController)
    //console.log("scaleRect, startPos, startPosController,dragcontroller,mainContainer",startPosition,startPositionController,dragController.position,mainContainer.position);
}

function scaleRectB(resizeRectange, currentPosition) {
    let {start,size} = getStartAndSize(instance.data.currentPosition, currentPosition, "draw");
    console.log("scaleRectB");
    if (size.x < 5 || size.y < 5) return
    // When we scale rect we have to give it new cordinates
    resizeRectange.clear()
    resizeRectange.position.copyFrom(start)
    resizeRectange.beginFill("0x"+ resizeColor, .5)
        .lineStyle({
            color: "0x"+resizeColor,
            alpha: 0.5,
            width: 1
        })
        .drawRect(0, 0, size.x, size.y)
        .endFill()
}

function moveRect(resizeRectange, dragController) {
    // Move control is on right side
    // and our rect is anchored on the left we substact width of rect
    let startPosition = new PIXI.Point(dragController.position.x - resizeRectange.width, dragController.position.y);
    let startPositionController = new PIXI.Point(dragController.position.x - 18, dragController.position.y + 23);
    // we just move the start position
    resizeRectange.position.copyFrom(startPosition)
    dragController.position.copyFrom(startPositionController)
}
function selectRect(rectangle){
    alert("Hello, " + rectangle.name + "!"); //rectangle.isSelected = true;
}
    function controlOver() {
        this.isOver = true;
    }

    function controlOut() {
        this.isOver = false;
        removeIfUnused(this)
    }

    function onRectangleOver() {
        // Do not hover rectangle if we are moving
        if (inputMode == InputModeEnum.move || inputMode == InputModeEnum.scale) {
            return;
        }
        // Do not hover rectangle if we creating
        if (inputMode == InputModeEnum.create && instance.data.currentPosition) {
            return;
        }
        console.log("Over")
        this.isOver = true;
        inputMode = InputModeEnum.select
        // set current hovered rect to be on the top
        bringToFront(this)
        // Create button move
        const buttonMove = new PIXI.Sprite(textureMove);
        // set anchor middle
        buttonMove.anchor.set(0.5);
        // Set control top right
        buttonMove.x = this.x + this.width - 18;
        buttonMove.y = this.y + 23;
        // make interactive...
        buttonMove.interactive = true;
        buttonMove.cursor = 'grab';
        // Add events/pass object to pointerdown event so we know which button/control is pressed
        buttonMove.on('pointerover', controlOver).on('pointerout', controlOut).on('pointerdown', onDragStartNew, {
            controller: buttonMove,
            edit: this,
            mode: InputModeEnum.move
        });
        instance.data.mainContainer.addChild(buttonMove);
        // add to control queue
        controls.push(buttonMove);
        const buttonScale = new PIXI.Sprite(textureScale);
        // same as for move but on bottom right corner
        buttonScale.anchor.set(0.5);
        buttonScale.x = this.x + this.width - 20;
        buttonScale.y = this.y + this.height - 20;
        // make the buttonScale interactive...
        buttonScale.interactive = true;
        buttonScale.cursor = 'nw-resize';
        buttonScale.on('pointerover', controlOver).on('pointerout', controlOut).on('pointerdown', onDragStartNew, {
            controller: buttonScale,
            edit: this,
            mode: InputModeEnum.scale
        });
        instance.data.mainContainer.addChild(buttonScale);
        controls.push(buttonScale);
    }
    function bringToFront(sprite) {
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
    function onRectangleOut() {
        this.isOver = false;
        console.log("OUT");
        controls.forEach((control) => removeIfUnused(control))
    }

    function onRectangleOver() {
        // Do not hover rectangle if we are moving
        if (inputMode == InputModeEnum.move || inputMode == InputModeEnum.scale) {
            return;
        }
        // Do not hover rectangle if we creating
        if (inputMode == InputModeEnum.create && instance.data.currentPosition) {
            return;
        }
        console.log("Over")
        this.isOver = true;
        inputMode = InputModeEnum.select
        // set current hovered rect to be on the top
        bringToFront(this)
        // Create button move
        const buttonMove = new PIXI.Sprite(textureMove);
        // set anchor middle
        buttonMove.anchor.set(0.5);
        // Set control top right
        buttonMove.x = this.x + this.width - 18;
        buttonMove.y = this.y + 23;
        // make interactive...
        buttonMove.interactive = true;
        buttonMove.cursor = 'grab';
        // Add events/pass object to pointerdown event so we know which button/control is pressed
        buttonMove.on('pointerover', controlOver).on('pointerout', controlOut).on('pointerdown', onDragStartNew, {
            controller: buttonMove,
            edit: this,
            mode: InputModeEnum.move
        });
        instance.data.mainContainer.addChild(buttonMove);
        // add to control queue
        controls.push(buttonMove);
        const buttonScale = new PIXI.Sprite(textureScale);
        // same as for move but on bottom right corner
        buttonScale.anchor.set(0.5);
        buttonScale.x = this.x + this.width - 20;
        buttonScale.y = this.y + this.height - 20;
        // make the buttonScale interactive...
        buttonScale.interactive = true;
        buttonScale.cursor = 'nw-resize';
        buttonScale.on('pointerover', controlOver).on('pointerout', controlOut).on('pointerdown', onDragStartNew, {
            controller: buttonScale,
            edit: this,
            mode: InputModeEnum.scale
        });
        instance.data.mainContainer.addChild(buttonScale);
        controls.push(buttonScale);
    }

    function onDragMoveNew(event) {
        if (dragController) {
            // move control icon (move or scale icon)
            dragController.parent.toLocal(event.data.global, null, dragController.position);
            if (inputMode == InputModeEnum.scale) {
                // handle rect scale
                scaleRect(currentRectangle, dragController)
            }
            if (inputMode == InputModeEnum.move) {
                // handle rect move
                moveRect(currentRectangle, dragController)
            }
        }
    }

    function onDragStartNew() {
        // start drag of controller
        // and set parameters
        this.controller.alpha = 0.5;
        dragController = this.controller;
        currentRectangle = this.edit
        instance.data.currentPosition = new PIXI.Point().copyFrom(this.edit.position)
        inputMode = this.mode
        instance.data.mainContainer.on('pointermove', onDragMoveNew);
    }

    function onDragEndNew() {
        // stop drag, remove parameters
        // return input mode to default
        if (dragController) {
            instance.data.mainContainer.off('pointermove', onDragMoveNew);
            dragController.alpha = 1;
            currentRectangle = null;
            dragController = null;
        }
        instance.data.currentPosition = null;
        inputMode = InputModeEnum.create;
    }
    ///local functions for testing
    ///end local function
    ////////////// NOTE TO STEVEN: wrapped this for various reasons, maybe we should move some of these like mainContainer to instance everywhere, not sure
    if (instance.data.start) {
        instance.data.start = false;
        instance.canvas.insertAdjacentHTML("beforeend",
            `<div id=${instance.data.randomElementID} class="pixi-container"></div>`);
        imgixBaseURL = "https://d1muf25xaso8hp.cloudfront.net";
        //https://pixijs.download/release/docs/PIXI.settings.html#ROUND_PIXELS
        //this setting allows for sharper image quality, but movement is less smooth. We don't have a movement problem
        PIXI.settings.ROUND_PIXELS = true;
        ele = document.getElementById(instance.data.randomElementID);
        console.log(ele)
        //intialize pixi
        renderer = PIXI.autoDetectRenderer({
            //width: properties.bubble.width(),
            //height: properties.bubble.height(),
            backgroundColor: 0x2980b9,
        });
        app = new PIXI.Application({
            resizeTo: ele
        });
        instance.data.app = app;
        app.renderer.on(`resize`, function(event) {
            instance.data.handleResize(event, app, mainContainer, webpageSprite, instance.data
                .intialWebpageWidth);
            instance.data.updateScrollBarPosition(mainContainer, app, scrollBar);
        });
        instance.data.mainContainer = new PIXI.Container();
        mainContainer = instance.data.mainContainer
        mainContainer.interactive = false;
        mainContainer.name = "mainContainer";
        instance.data.mainContainer = mainContainer;
        canvasElement = mainContainer;
        app.stage.addChild(mainContainer);
        ele.appendChild(app.view);
        ////////////// NOTE TO STEVEN: added this below as it needed to be defined, apparently
        ele.setAttribute("pressed", false);
        instance.data.ele = ele;
    } else {
        mainContainer = instance.data.mainContainer;
        canvasElement = mainContainer;
        app = instance.data.app;
    }
    if (instance.data.addedScreenshot === false) {
        screenshot = PIXI.Texture.fromURL(
            `${imgixBaseURL}/https://dd7tel2830j4w.cloudfront.net/d110/f1667856692397x548178556679867840/d04b59ce92d6c0885e8eea753a9283e72c1e0f97d9c6c56094f211a6abbdefb2?w=${instance.canvas.clientWidth}`
            ).then((texture) => {
            console.log(`finished the texture`);
            console.log(texture);
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
            instance.data.webpageSprite = PIXI.Sprite.from(texture);
            webpageSprite = instance.data.webpageSprite;
            instance.data.intialWebpageWidth = webpageSprite.width;
            intialWebpageHeight = webpageSprite.height;
            webpageSprite.name = "webpage";
            webpageSprite.intialWidth = webpageSprite.width;
            mainContainer.addChild(webpageSprite);
            mainContainer.interactive = true;
            console.log(`the main`, mainContainer)
            webpageSprite.scale.set(app.view.width / webpageSprite.width);
            intialCanvasWidth = app.view.width;
            intialCanvasHeight = app.view.height;
            intialScale = intialCanvasWidth / instance.data.intialWebpageWidth;
            webpageSprite.intialScale = app.view.width / webpageSprite.width;
            ////////////// NOTE TO STEVEN: commented out as there is an issue with functions above
            scrollBar = instance.data.createScrollBar(mainContainer, app, ele)
            ///c addssss
            instance.data.mainContainer.on('pointerdown', (e) => {
                // Initiate rect creation
                console.log(instance.data.inputMode)
                if (instance.data.inputMode == instance.data.inputModeEnum.create) {
                    instance.data.startPosition = new PIXI.Point().copyFrom(e.global)
                    instance.data.logging ? console.log("pointerdown", instance.data.startPosition) :
                        null;
                }
                if (instance.data.inputMode == instance.data.inputModeEnum.select) {
                    //PLACEHOLDER for select function
                    if (e.target != instance.data.mainContainer) {
                        instance.data.selectRect(e.target);
                    }
                }
            });
            instance.data.mainContainer.on('pointermove', (e) => {
                // Do this routine only if in create mode and have started creation
                // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
                if (instance.data.inputMode == instance.data.inputModeEnum.create && instance.data
                    .startPosition) {
                    // get new global position from event
                    let currentPosition = e.global;
                    let {
                        start,
                        size
                    } = getStartAndSize(currentPosition, instance.data.startPosition,"draw");
                    if (size.x > 5 && size.y > 5) {
                        if (!instance.data.currentRectangle) {
                            instance.data.currentRectangle = new PIXI.Graphics().beginFill("0x" +
                                instance.data.highlightColor, 0.5).lineStyle({
                                color: "0x" + instance.data.highlightColor,
                                alpha: 0.5,
                                width: 1
                            }).drawRect(0, 0, size.x, size.y).endFill()
                            instance.data.currentRectangle.labelColor = "0x" + instance.data
                                .highlightColor;
                            instance.data.currentRectangle.oldColor = instance.data.highlightColor;
                            instance.data.currentRectangle.name = "";
                            instance.data.currentRectangle.position.copyFrom(start)
                            instance.data.addLabel(instance.data.currentRectangle);
                            instance.data.mainContainer.addChild(instance.data.currentRectangle)
                        } else {
                            scaleRectB(instance.data.currentRectangle, currentPosition)
                        }
                    } else {
                        if (instance.data.currentRectangle) {
                            instance.data.mainContainer.removeChild(instance.data.currentRectangle);
                            instance.data.currentRectangle = null;
                            currentRectangle = null;
                        }
                    }
                }
            });
            mainContainer.on('pointerup', (e) => {
                // Wrap up rect creation
                instance.data.currentPosition = null
                if (currentRectangle && currentRectangle.interactive == false) {
                    currentRectangle.interactive = true;
                    currentRectangle
                        // Mouse & touch events are normalized into
                        // the pointer* events for handling different
                        // Rectangle events.
                        .on('pointerover', onRectangleOver)
                        .on('pointerout', onRectangleOut);
                }
                currentRectangle = null
                onDragEndNew()
            });
            /*
            instance.data.mainContainer.on('pointerup', (e) => {
                // Wrap up rect creation
                instance.data.startPosition = null
                if (instance.data.currentRectangle && instance.data.currentRectangle.interactive ==
                    false) {
                    instance.data.currentRectangle.interactive = true;
                    instance.data.currentRectangle
                        // Mouse & touch events are normalized into
                        // the pointer* events for handling different
                        // Rectangle events.
                        .on('pointerover', onRectangleOver).on('pointerout', onRectangleOut);
                }
                instance.data.currentRectangle = null
                onDragEndNew()
            });
            */
            instance.data.mainContainer.on('pointerupoutside', onDragEndNew);
            instance.data.mainContainer.interactive = true;
            instance.data.mainContainer.hitArea = instance.data.mainContainer.screen;
            //load our data
            instance.data.loadDAS(DAS, instance.data.mainContainer);
            //end c adds
            instance.data.addedScreenshot = true
            
        });
    }
    //Listeners
}