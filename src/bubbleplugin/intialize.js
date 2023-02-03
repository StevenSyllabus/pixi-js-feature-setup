function(instance, context) {
    //intialize instance variables
    instance.data.start = true;
    instance.data.addedScreenshot = false;
    instance.data.logging = true;
    instance.data.logDrag = false;
    instance.data.logResize = false;
    instance.data.logRectEvents = false;
    instance.data.loadData = true;
    instance.data.logEvents = false;
    instance.data.randomElementID = `pixi-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    instance.data.webpageScreenshot;
    instance.data.labelFont;
    instance.data.labelFontSize;
    instance.data.labelFontColor;
    instance.data.dasOrigin;
    instance.data.addedMainContainerEventListeners = false;
    instance.data.createdScrollBar = false;
    instance.data.originalWebsiteScreenshotURL;
    instance.data.scrollingTimeout;





    instance.data.rectangles = [];
    instance.data.resizeHandles = [];
    instance.data.imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
    instance.data.mainContainer = new PIXI.Container();
    instance.data.ele;
    instance.data.app = new PIXI.Application({
        resizeTo: instance.canvas,
    });

    instance.data.canvasElement = instance.data.mainContainer;
    instance.data.intialWebpageWidth,
        instance.data.intialWebpageHeight,
        instance.data.intialCanvasWidth,
        instance.data.intialCanvasHeight,
        instance.data.intialScale,
        instance.data.webpageSprite,
        instance.data.scrollBar;

    instance.data.resizeTimeout = null;
    /////////////////////NEW DRAWING
    // Input modes for input
    instance.data.InputModeEnum = {
        create: 1,
        select: 2,
        scale: 3,
        move: 4,
    };

    // Load textures for edit
    instance.data.hrefMove =
        "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
    instance.data.hrefScale =
        "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
    instance.data.textureMove = PIXI.Texture.from(instance.data.hrefMove);
    instance.data.textureScale = PIXI.Texture.from(instance.data.hrefScale);
    instance.data.highlightColor = "FFFF00"; //yellow
    instance.data.dragColor = "DE3249"; //red
    instance.data.resizeColor = "FFFF00"; //"0000FF"; //blue
    // Start position of events
    instance.data.startPosition = null;
    // Current edited or created rectangle
    instance.data.currentRectangle = null;
    // Set mode for whole input (by default we create rectangles)
    instance.data.inputMode = instance.data.InputModeEnum.create;
    // Pointer to current active control (Move or Scale icon)
    instance.data.dragController = null;
    // Active shown controls (can be shown both or one hovered / active)
    instance.data.controls = [];
    instance.data.scalingRectTimeout;

    //end C Declare

    //--begin html container setup, and pixi core element setup
    //--end html container setup, and pixi core element setup
    PIXI.settings.ROUND_PIXELS = true;
    instance.data.mainContainer.name = "mainContainer";
    instance.data.app.stage.addChild(instance.data.mainContainer);

    //functions are all below----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    instance.data.createScrollBar = function (
        mainContainer,
        pixiApp,
        div
    ) {
        const scrollBarWidth = 14;
        const scrollbar = new PIXI.Graphics();
        scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

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




        pixiApp.stage.addChild(scrollbar);

        //update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container

        //resize the container and scrollbar when the window is resized


        return scrollbar;
    };
    instance.data.scrollCanvas = function (event) {
        document.body.style.overflow = "hidden";
        let maxScroll = instance.data.mainContainer.height - instance.data.app.view.height;
        console.log(`the scrollbar during creation is`, instance.data.scrollBar)



        // Update the container's y position based on the mouse wheel delta
        instance.data.mainContainer.position.y -= event.deltaY;

        // Clamp the container's position so that it can't scroll past the max scroll value
        if (instance.data.mainContainer.position.y <= instance.data.mainContainer.height) {
            instance.data.mainContainer.position.y = Math.max(
                instance.data.mainContainer.position.y,
                -maxScroll
            );
            instance.data.mainContainer.position.y = Math.min(instance.data.mainContainer.position.y, 0);
        }

        // Update the scrollbar position and size based on the container's scroll position
        const scrollPercent = -instance.data.mainContainer.position.y / maxScroll;
        const scrollbarHeight =
            instance.data.app.view.height * (instance.data.app.view.height / instance.data.mainContainer.height);
        const scrollbarY = scrollPercent * (instance.data.app.view.height - scrollbarHeight);
        if (instance.data.scrollBar?.clear) {
            instance.data.scrollBar.clear();
        }
        instance.data.scrollBar.beginFill(0x808080);
        instance.data.scrollBar.drawRect(
            instance.data.app.view.width - 14,
            scrollbarY,
            14,
            scrollbarHeight
        );
        instance.data.scrollBar.endFill();
        clearTimeout(instance.data.scrollingTimeout);
        instance.data.scrollingTimeout = setTimeout(() => {
            console.log("Show the content again because the user stopped scrolling");
            document.body.style.overflow = "auto";
        }, 1000);
    }
    instance.data.updateScrollBarPosition = function (
        mainContainer,
        pixiApp,
        scrollbar
    ) {
        scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

        const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
        scrollbar.scrollPercent = scrollPercent;
        console.log(`scrollPercent: ${scrollPercent}`);
        const scrollbarHeight =
            pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
        const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);

        if (scrollbar.clear) {
            scrollbar.clear();
        }
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

    instance.data.handleResize = function (
        event,
        pixiApp,
        mainContainer,
        webpageSprite,
        intialWebpageWidth
    ) {
        let intialScale = pixiApp.view.width / intialWebpageWidth;
        let endingWidth, newPercent;

        mainContainer.children.forEach((child) => {
            let childIntialScale = child.intialScale;
            let childIntialPosition = child.position.x;
            console.log(`my new test childIntialScale: ${childIntialScale}`)
            console.log(`my new test intial scale`, intialScale)

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
    instance.data.getStartCoordinates = function (startX, startY, endX, endY) {
        var width, height, startRectX, startRectY;
        startX < endX ? (width = endX - startX) : (width = startX - endX);
        startY < endY ? (height = endY - startY) : (height = startY - endY);
        startX < endX ? (startRectX = startX) : (startRectX = endX);
        startY < endY ? (startRectY = startY) : (startRectY = endY);
        return { startRectX, startRectY, width, height };
    };

    instance.data.addDragHand = function (rectangle, rectangles) {
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

    instance.data.handleResizerRect = function (
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
            let coordinates = instance.data.getStartCoordinates(
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
    instance.data.handleResizerRect2 = function (
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

    instance.data.removeRectangle = function (rectangle, array) {
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
    instance.data.findRect = function (name) {
        const foundRectangle = rectangles.find((r) => r.name === name);
        if (foundRectangle) {
            return foundRectangle;
        }
    };
    //loads & reformats Drawn Attribute Snippets
    instance.data.loadDAS = function (das) {
        das.forEach((das, index) => {

            let startRectX = das.get('x_coordinate_number');
            let startRectY = das.get('y_coordinate_number');
            let width = das.get('box_width_number');
            let height = das.get('box_height_number');
            let intialScale = das.get('initial_drawn_scale_number');
            let webpageCurrentScale = instance.data.webpageSprite.width / instance.data.intialWebpageWidth;

            let currentScaleFactorWidth = width * webpageCurrentScale / intialScale;
            let currentScaleFactorHeight = height * webpageCurrentScale / intialScale;

            let currentScaleFactorX = startRectX * webpageCurrentScale / intialScale;
            let currentScaleFactorY = startRectY * webpageCurrentScale / intialScale;

            console.log(`the webpage test current scale factor`, webpageCurrentScale);





            console.log(`the original das is width`, das.get('box_width_number'));
            console.log(`the original das is height`, das.get('box_height_number'));
            console.log(`the scaled factor width is`, currentScaleFactorWidth);
            console.log(`the scaled factor height is`, currentScaleFactorHeight);


            console.log(`the original das is heigh`, das.get('box_height_number'));
            console.log(`the original das is "initial_drawn_scale_number"`, das.get('initial_drawn_scale_number'));


            //console.log("DAS",das.x_coordinate__960__number"], das["y_coordinate__960__number"], das[
            //    "box_height_number"] * 3, das["box_width_number"] * 3);
            console.log("creating the das", das);
            let createCoord = {
                "startRectX": currentScaleFactorX,
                "startRectY": currentScaleFactorY,
                "width": currentScaleFactorWidth,
                "height": currentScaleFactorHeight
            }











            console.log(`create the coord`, createCoord)
            instance.data.logging ? console.log("createCoord", createCoord) : null;
            //stop small box creation - Placeholder
            if (createCoord.width < 20) return;
            if (createCoord.height < 20) return;
            console.log("att", att[0]);
            instance.data.createExistingRect(createCoord, das.labelColor, das.attributeName, das.labelUniqueID);
        });
    }


    instance.data.addLabel = function (rect) {
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

    instance.data.createExistingRect = function (createCoord, color, name, id) {
        // Create graphics
        console.log("createCoord", createCoord);
        if (color == "") {
            color = highlightColor;
        }
        instance.data.currentRectangle = new PIXI.Graphics()
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

        instance.data.currentRectangle.labelColor = "0x" + color;
        instance.data.currentRectangle.oldColor = "0x" + color;
        instance.data.currentRectangle.name = name;
        instance.data.currentRectangle.id = id;
        console.log(`the current rect data for id`, instance.data.currentRectangle);
        // then we move it to final position
        instance.data.currentRectangle.position.copyFrom(
            new PIXI.Point(createCoord.startRectX, createCoord.startRectY)
        );
        //addLabel(currentRectangle);
        instance.data.mainContainer.addChild(instance.data.currentRectangle);
        // make it hoverable
        instance.data.currentRectangle.interactive = true;
        instance.data.currentRectangle
            .on("pointerover", instance.data.onRectangleOver)
            .on("pointerout", instance.data.onRectangleOut);
        // remove it from current ceration and chose new color for next one
        instance.data.addLabel(instance.data.currentRectangle);
        console.log("currentRect that im testing", instance.data.currentRectangle);
        instance.data.currentRectangle.intialScale = instance.data.app.view.width / instance.data.intialWebpageWidth;

        instance.data.currentRectangle = null;
    };

    // Function that generates test rect
    instance.data.testRect = function () {
        // Create graphics
        instance.data.currentRectangle = new PIXI.Graphics()
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
        instance.data.currentRectangle.labelColor = "0x";
        instance.data.currentRectangle.oldColor = "0xFFFF00";
        instance.data.currentRectangle.name = "0xFFFF00";
        instance.data.currentRectangle.position.copyFrom(new PIXI.Point(100, 100));
        instance.data.addLabel(instance.data.currentRectangle);
        instance.data.mainContainer.addChild(instance.data.currentRectangle);
        // make it hoverable
        instance.data.currentRectangle.interactive = true;
        instance.data.addLabel(instance.data.currentRectangle);
        instance.data.currentRectangle
            .on("pointerover", instance.data.onRectangleOver)
            .on("pointerout", instance.data.onRectangleOut);
        instance.data.currentRectangle = null;
    };
    //testRect()
    instance.data.controlOver = function () {
        this.isOver = true;
    };

    instance.data.controlOut = function () {
        this.isOver = false;
        instance.data.removeIfUnused(this);
    };

    instance.data.onRectangleOver = function () {
        // Do not hover rectangle if we are moving
        if (instance.data.inputMode == instance.data.InputModeEnum.move || instance.data.inputMode == instance.data.InputModeEnum.scale) {
            return;
        }
        // Do not hover rectangle if we creating
        if (instance.data.inputMode == instance.data.InputModeEnum.create && instance.data.startPosition) {
            return;
        }
        console.log("Over");
        this.isOver = true;
        instance.data.inputMode = instance.data.InputModeEnum.select;
        // set current hovered rect to be on the top
        instance.data.bringToFront(this);
        // Create button move
        const buttonMove = new PIXI.Sprite(instance.data.textureMove);
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
            .on("pointerover", instance.data.controlOver)
            .on("pointerout", instance.data.controlOut)
            .on("pointerdown", instance.data.onDragStartNew, {
                controller: buttonMove,
                edit: this,
                mode: instance.data.InputModeEnum.move,
            });
        instance.data.mainContainer.addChild(buttonMove);
        // add to control queue
        instance.data.controls.push(buttonMove);

        const buttonScale = new PIXI.Sprite(instance.data.textureScale);
        // same as for move but on bottom right corner
        buttonScale.anchor.set(0.5);
        buttonScale.x = this.x + this.width - 20;
        buttonScale.y = this.y + this.height - 20;

        // make the buttonScale interactive...
        buttonScale.interactive = true;
        buttonScale.cursor = "nw-resize";
        buttonScale
            .on("pointerover", instance.data.controlOver)
            .on("pointerout", instance.data.controlOut)
            .on("pointerdown", instance.data.onDragStartNew, {
                controller: buttonScale,
                edit: this,
                mode: instance.data.InputModeEnum.scale,
            });

        instance.data.mainContainer.addChild(buttonScale);
        instance.data.controls.push(buttonScale);
    };

    instance.data.cleanupcontrols = function () {
        instance.data.controls = instance.data.controls.filter((el) => el.parent);
        if (instance.data.controls.length == 0) {
            instance.data.onDragEndNew();
        }
    };

    instance.data.removeIfUnused = function (control) {
        // Give time to PIXI to go trough events and add event on end
        setTimeout(() => {
            // By this time isOver is updated so if we went from
            // square to conntroll controll.isOver become true
            // if we are draging controll and went out of it
            // we dont remove it because it is still used
            if (!control.isOver && control !== instance.data.dragController) {
                instance.data.mainContainer.removeChild(control);
                instance.data.cleanupcontrols();
            }
        }, 0);
    };

    // Event is triggered when we move mouse out of rectangle
    instance.data.onRectangleOut = function () {
        this.isOver = false;
        console.log("OUT");
        instance.data.controls.forEach((control) => instance.data.removeIfUnused(control));
    };

    // Normalize start and size of square so we always have top left corner as start and size is always +
    instance.data.getStartAndSize = function (pointA, pointB, type) {
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
            let currentScaleRatio = instance.data.currentRectangle.scale.x;
            let scaleRatio = 1 / currentScaleRatio;
            return {
                start: new PIXI.Point(startX, startY),
                size: new PIXI.Point(absDeltaX * scaleRatio, absDeltaY * scaleRatio),
            };
        } else if (type == "draw") {
            return {
                start: new PIXI.Point(
                    startX - instance.data.mainContainer.position.x,
                    startY - instance.data.mainContainer.position.y
                ),
                size: new PIXI.Point(absDeltaX, absDeltaY),
            };
        }
    };

    //these two are slightly different, could probably be combined
    const scaleRect = function (resizeRectange, dragController) {
        //currentPosition)
        let { start, size } = instance.data.getStartAndSize(
            instance.data.startPosition,
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
            .beginFill("0x" + instance.data.resizeColor, 0.5)
            .lineStyle({
                color: 0x111111,
                alpha: 0.5,
                width: 1,
            })
            .drawRect(0, 0, size.x, size.y)
            .endFill();

        dragController.position.copyFrom(startPositionController);
        clearTimeout(instance.data.resizeTimeout);
        instance.data.resizeTimeout = setTimeout(() => {
            console.log(`finished resizing`);
            console.log(`resizeRectange`, resizeRectange);
            console.log(`resizeRectange.position`, resizeRectange.position.x);
            console.log(`resizeRectange.width`, resizeRectange.width);
            console.log(`resizeRectange.height`, resizeRectange.height);
            console.log(`resizeRectange.scale`, resizeRectange.scale);

            //update the shape in the database
            // let headersList = {
            //     "Accept": "*/*",
            // }

            // let bodyContent = new FormData();
            // bodyContent.append("x", resizeRectange.position.x);
            // bodyContent.append("y", resizeRectange.position.y);
            // bodyContent.append("width", resizeRectange.width);
            // bodyContent.append("height", resizeRectange.height);
            // bodyContent.append("drawn_label_snippet", `1675323839778x532947159105875200`);

            // fetch("https://app.syllabus.io/version-steven-canvas-implementat/api/1.1/wf/update-drawn-label", {
            //     method: "POST",
            //     body: bodyContent,
            //     headers: headersList
            // }).then(response => response.json())
            //     .then(result => {
            //         let newID = result.response.drawn_attribute_snippet._id;
            //         console.log(`the new id`, newID);
            //         console.log(result.response);
            //         console.log(result.response.drawn_attribute_snippet);
            //         console.log(result.response.drawn_attribute_snippet._id);
            //     })
        }, 100);
        console.log(
            "scaleRect, startPos, startPosController,dragcontroller,mainContainer",
            instance.data.startPosition,
            startPositionController,
            dragController.position,
            instance.data.mainContainer.position
        );
    };

    instance.data.scaleRectB = function (resizeRectange, currentPosition) {
        let { start, size } = instance.data.getStartAndSize(instance.data.startPosition, currentPosition, "draw");
        console.log("scaleRectB");
        if (size.x < 5 || size.y < 5) return;
        // When we scale rect we have to give it new cordinates
        resizeRectange.clear();
        resizeRectange.position.copyFrom(start);
        resizeRectange
            .beginFill("0x" + instance.data.resizeColor, 0.5)
            .lineStyle({
                color: "0x" + instance.data.resizeColor,
                alpha: 0.5,
                width: 1,
            })
            .drawRect(0, 0, size.x, size.y)
            .endFill();
    };

    instance.data.moveRect = function (resizeRectange, dragController) {
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
    instance.data.selectRect = function (rectangle) {
        instance.publishState("currently_selected_drawing", rectangle.id)
        setTimeout(() => {
            instance.triggerEvent("label_selected")
        }, 100)
        console.log(`selectRect, rectangle data values`, rectangle.id)

    };

    instance.data.onDragMoveNew = function (event) {
        if (instance.data.dragController) {
            // move control icon (move or scale icon)
            instance.data.dragController.parent.toLocal(
                event.data.global,
                null,
                instance.data.dragController.position
            );
            if (instance.data.inputMode == instance.data.InputModeEnum.scale) {
                // handle rect scale
                scaleRect(instance.data.currentRectangle, instance.data.dragController);
            }
            if (instance.data.inputMode == instance.data.InputModeEnum.move) {
                // handle rect move
                instance.data.moveRect(instance.data.currentRectangle, instance.data.dragController);
            }
        }
    };

    instance.data.onDragStartNew = function () {
        // start drag of controller
        // and set parameters
        this.controller.alpha = 0.5;
        instance.data.dragController = this.controller;
        instance.data.currentRectangle = this.edit;
        instance.data.startPosition = new PIXI.Point().copyFrom(this.edit.position);
        instance.data.inputMode = this.mode;
        instance.data.mainContainer.on("pointermove", instance.data.onDragMoveNew);
    };

    instance.data.onDragEndNew = function () {
        // stop drag, remove parameters
        // return input mode to default
        if (instance.data.dragController) {
            instance.data.mainContainer.off("pointermove", instance.data.onDragMoveNew);
            instance.data.dragController.alpha = 1;
            instance.data.currentRectangle = null;
            instance.data.dragController = null;
        }
        instance.data.startPosition = null;
        instance.data.inputMode = instance.data.InputModeEnum.create;
    };

    ///experimental
    instance.data.bringToFront = function (sprite) {
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



}