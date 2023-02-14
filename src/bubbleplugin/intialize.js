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
    instance.data.labelFont = "Inter";
    instance.data.labelFontSize = "20";
    instance.data.labelFontColor = "000000";
    instance.data.highlightColorAlpha = ".3";
    instance.data.normalColorAlpha = ".3";
    instance.data.highlightColorAsHex = 0xffff00;
    instance.data.dasOrigin;
    instance.data.addedMainContainerEventListeners = false;
    instance.data.createdScrollBar = false;
    instance.data.originalWebsiteScreenshotURL;
    instance.data.scrollingTimeout;
    instance.data.maxScroll;
    instance.data.scrollBarLastY;
    instance.data.scrollBarLastTop;
    instance.data.scrollPositionBefore = 0;
    instance.data.accountWebPageID;
    instance.data.scalingShape;
    instance.data.rectangleBeingResized;
    instance.data.rectangleBeingMoved;
    instance.data.changeColor = false;
    // Input modes for input
    instance.data.InputModeEnum = {
        create: 1,
        select: 2,
        scale: 3,
        move: 4,
    };

    //new shape handling variables
    instance.data.movingRectangle = {
        graphic: null,
        relativeMouseX: null,
        relativeMouseY: null,
    };

    //store the highlighted rectangles locally
    instance.data.highlightedRectangles = [{

    }]

    instance.data.resizingRectangle = {
        graphic: null,
        relativeMouseX: null,
        relativeMouseY: null,
        startMouseX: null,
        startMouseY: null,
        startWidth: null,
        startHeight: null,
        startingPosition: null,
    };

    instance.data.proxyVariables = new Proxy({
        selectedRectangle: null,
        inputMode: instance.data.InputModeEnum.create,

    }, {
        set: function (obj, prop, value) {
            let previousValue = obj[prop];
            console.log(`proxy previous value:`, prop, previousValue);
            console.log(`proxy current value `, prop, value);

            //check if the property is the selected rectangle
            if (prop === `selectedRectangle`) {
                console.log(`the selected rectangle has changed to:`, value)

                //check if the value is not null and the value is not the same as the previous value
                if (value && value !== previousValue) {
                    //loop through all of the containers on the main container (the squares)
                    instance.data.mainContainer.children.forEach((child) => {
                        console.log(`theChild`, child)
                        if (child.name !== "webpage") {
                            //check if the current rectangle selected has the same labelUniqueID as the child we're looping through
                            if (child.labelUniqueID === value.labelUniqueID) {
                                //if it does, we set the child to be highlighted and selected
                                child.isHighlighted = true;
                                //calculate the width and height of the rectangle including the border
                                let borderWidth = child.line.width;
                                let height = child.height - borderWidth;
                                let width = child.width - borderWidth;
                                //the rectangle is highlighted - so it becomes movable
                                child.cursor = "move";

                                //clear the drawing, and redraw the square with the highlight color
                                child.clear();
                                child.beginFill(instance.data.highlightColorAsHex, instance.data.highlightColorAlpha);
                                child.lineStyle(1, 0x000000, 1);

                                //we minus 1 to account for the border. Theres a slight increase
                                child.drawRect(0, 0, width, height);
                                child.endFill();
                                child.isHighlighted = true;
                            }
                            else if (child.labelUniqueID !== value.labelUniqueID && child.isHighlighted) {
                                child.isHighlighted = false;
                                child.isSelected = false;
                                child.cursor = "pointer";
                                let height = child.height - 1;
                                let width = child.width - 1;
                                let color = `0x` + child.labelColor;
                                child
                                    .clear()
                                    .beginFill(color, 1)
                                    .drawRect(0, 0, width, height)
                                    .endFill()
                                    .beginHole()
                                    .drawRect(5, 5, width - 10, height - 10)
                                    .endHole();
                            }
                        }
                    });
                    value.isSelected = true;

                    //set the value of the property to the new value
                    obj[prop] = value;
                }
                //check if the selected shape is null and the previous value is not null
                // these runs our `deselect` function essentially
                //it also prevents this from running if we're changing the value from null to null
                else if (!value && previousValue) {
                    console.log(`the selected attribute is null & hasn't changed to something`, value);
                    instance.data.mainContainer.children.forEach((child) => {
                        if (child.name !== "webpage" && child.isHighlighted) {
                            child.isSelected = false;
                            child.isHighlighted = false;
                            child.cursor = "pointer";
                            let height = child.height - 1;
                            let width = child.width - 1;
                            let color = `0x` + child.labelColor;
                            child
                                .clear()
                                .beginFill(color, 1)
                                .drawRect(0, 0, width, height)
                                .endFill()
                                .beginHole()
                                .drawRect(5, 5, width - 10, height - 10)
                                .endHole();

                        }
                    });
                    obj[prop] = value;
                }

            }
            if (prop == "inputMode") {
                console.log(`inputMode changed to ${value} `)
                if (value == instance.data.InputModeEnum.create) {
                    instance.data.mainContainer.cursor = "crosshair"
                }
                if (value == instance.data.InputModeEnum.select) {
                    console.log(`select mode`)
                    instance.data.mainContainer.children.forEach(child => {

                        child.cursor = "pointer"

                    })
                }


            }



            obj[prop] = value;
        },
        get: function (obj, prop) {

            return obj[prop];
        }
    });
    console.log(instance.data.proxyVariables)




    //grab the correct version parameter
    instance.data.dynamicFetchParam;
    instance.data.dynamicFetchParam = window.location.href;
    instance.data.dynamicFetchParam = instance.data.dynamicFetchParam.split('/');
    instance.data.dynamicFetchParam = instance.data.dynamicFetchParam[3] + `/ `;
    instance.data.dynamicFetchParam = instance.data.dynamicFetchParam.includes("version") ? instance.data.dynamicFetchParam : "";
    instance.data.dynamicFetchParam = instance.data.dynamicFetchParam.trim();

    console.log(` instance.data.dynamicFetchParam: "${instance.data.dynamicFetchParam.trim()}"`)




    instance.data.rectangles = [];
    instance.data.resizeHandles = [];
    instance.data.imgixBaseURL = `https://d1muf25xaso8hp.cloudfront.net/`;
    instance.data.mainContainer = new PIXI.Container();
    instance.data.ele;
    instance.data.app = new PIXI.Application({
        resizeTo: instance.canvas,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
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

    instance.data.highlightColor = "FFFF00"; //yellow
    instance.data.highlightColorAlpha = .3;
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
        const scrollPercent = -instance.data.mainContainer.position.y / instance.data.maxScroll;
        instance.data.scrollPositionBefore = scrollPercent;
        console.log(`scrollPercent: ${scrollPercent}`);

        const scrollbarHeight =
            instance.data.app.view.height * (instance.data.app.view.height / instance.data.mainContainer.height);
        const scrollbarY =
            scrollPercent * (instance.data.app.view.height - scrollbarHeight);


        const scrollBarWidth = 14;
        const scrollbar = new PIXI.Graphics();
        scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;
        instance.data.maxScroll = mainContainer.height - pixiApp.view.height;

        scrollbar.interactive = true;

        scrollbar.beginFill(0x808080);
        scrollbar.drawRect(
            pixiApp.view.width - scrollBarWidth,
            scrollbarY,
            scrollBarWidth,
            pixiApp.view.height * (pixiApp.view.height / mainContainer.height)
        );

        scrollbar.endFill();

        scrollbar.addEventListener("pointerdown", (e) => {
            const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
            instance.data.scrollPositionBefore = scrollPercent;
            const scrollbarHeight =
                pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
            const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);
            div.pressed = true;
            scrollbar.lastY = e.data.global.y;
            instance.data.scrollBarLastY = e.client.y;
            console.log(e.client.y);

            instance.data.scrollBarLastTop = scrollbarY;
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




        pixiApp.stage.addChild(scrollbar);

        //update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container

        //resize the container and scrollbar when the window is resized


        return scrollbar;
    };
    instance.data.scrollBarWindowPointerMove = function (event) {
        if (instance.data.ele.pressed) {
            const scrollPercent = -instance.data.mainContainer.position.y / instance.data.maxScroll;
            instance.data.scrollPositionBefore = scrollPercent;
            console.log(`scrollPercent: ${scrollPercent}`);

            const scrollbarHeight =
                instance.data.app.view.height * (instance.data.app.view.height / instance.data.mainContainer.height);
            const scrollbarY =
                scrollPercent * (instance.data.app.view.height - scrollbarHeight);

            const mouseDif = event.y - instance.data.scrollBarLastY;
            console.log(mouseDif);

            const newTop = mouseDif + instance.data.scrollBarLastTop;
            const scrollPercent2 = newTop / (instance.data.app.view.height - scrollbarHeight);
            const newScroll = Math.min(-scrollPercent2 * instance.data.maxScroll, 0);

            if (scrollPercent2 > 0 && scrollPercent2 < 1) {
                instance.data.mainContainer.position.y = newScroll;
                instance.data.scrollBar.clear();
                instance.data.scrollBar.beginFill(0x808080);
                instance.data.scrollBar.drawRect(
                    instance.data.app.view.width - 14,
                    newTop,
                    14,
                    scrollbarHeight
                );
                instance.data.scrollBar.endFill();
            }
        }
        instance.publishState("scroll_depth", instance.data.mainContainer.position.y)
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
        instance.data.scrollPositionBefore = scrollPercent;
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
        instance.publishState("scroll_depth", instance.data.mainContainer.position.y)
    }
    instance.data.updateScrollBarPosition = function (
        mainContainer,
        pixiApp,
        scrollbar
    ) {
        scrollbar.maxScroll = mainContainer.height - pixiApp.view.height;

        const scrollPercent = -mainContainer.position.y / scrollbar.maxScroll;
        instance.data.scrollPositionBefore = scrollPercent;
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
        if (instance.data.changeColor) { changeRectColor(rectangle, rectangle.labelColor); }
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

        if (instance.data.changeColor) { changeRectColor(rectangle, rectangle.oldColor); }
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
            if (instance.data.changeColor) { changeRectColor(rectangle, rectangle.labelColor); }
        }
    };
    const changeRectColor = function (sq, color) {
        logDrag ? console.log("changeColor") : null;
        const square = sq;
        //logDrag ? console.log(square) : null;
        sq.clear();
        sq.beginFill("0x" + color, 0.5);
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
            //get all of the drawn attribute snippet data
            let startRectX = das.get('x_coordinate_number');
            let startRectY = das.get('y_coordinate_number');
            let width = das.get('box_width_number');
            let height = das.get('box_height_number');
            let intialScale = das.get('initial_drawn_scale_number');
            let dasID = das.get('_id');
            //this is the unique ID of the Attribute
            let dasLabelID = das.attributeId;

            console.log(`creating a new rect`)
            console.log(`the new drawn label unique ID is:`, dasLabelID);
            console.log(`the new Drawn Snippet Unique ID is:`, dasID);



            let webpageCurrentScale = instance.data.webpageSprite.width / instance.data.intialWebpageWidth;

            let currentScaleFactorWidth = width * webpageCurrentScale / intialScale;
            let currentScaleFactorHeight = height * webpageCurrentScale / intialScale;

            let currentScaleFactorX = startRectX * webpageCurrentScale / intialScale;
            let currentScaleFactorY = startRectY * webpageCurrentScale / intialScale;


            let createCoord = {
                "startRectX": currentScaleFactorX,
                "startRectY": currentScaleFactorY,
                "width": currentScaleFactorWidth,
                "height": currentScaleFactorHeight
            }

            instance.data.logging ? console.log("createCoord", createCoord) : null;
            //stop small box creation - Placeholder
            if (createCoord.width < 20) return;
            if (createCoord.height < 20) return;

            instance.data.createExistingRect(createCoord, das.labelColor, das.attributeName, dasID, dasLabelID);
        });
    }


    instance.data.addLabel = function (rect) {
        const label = new PIXI.Text(rect.name, {
            fontFamily: instance.data.labelFont,
            fontSize: instance.data.labelFontSize,
            stroke: "0x" + instance.data.labelFontColor,
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

    instance.data.createExistingRect = function (createCoord, color, name, id, labelID) {
        // Create graphics
        console.log("createCoord", createCoord);
        if (color == null) {
            color = instance.data.highlightColor;
        }

        instance.data.currentRectangle = instance.data.createBorderedRectangle(0, 0, createCoord.width, createCoord.height, color);

        instance.data.currentRectangle.labelColor = color;
        instance.data.currentRectangle.oldColor = color;
        instance.data.currentRectangle.name = name;
        instance.data.currentRectangle.id = id;
        instance.data.currentRectangle.labelUniqueID = labelID;

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
        instance.data.proxyVariables.inputMode = instance.data.InputModeEnum.select;
        // set current hovered rect to be on the top
        instance.data.bringToFront(this);

    };



    // Event is triggered when we move mouse out of rectangle
    instance.data.onRectangleOut = function () {
        this.isOver = false;
        console.log("OUT");
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
        instance.data.scalingShape = resizeRectange;

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
            console.log(`resizeRectange.intialScale`, resizeRectange.intialScale);

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
        instance.data.rectangleBeingResized = resizeRectange;
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

        console.log(`moverect`, resizeRectange)
        instance.data.rectangleBeingMoved = resizeRectange;

    };
    instance.data.selectRect = function (rectangle) {
        instance.data.proxyVariables.selectedRectangle = rectangle;
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

    instance.data.createBorderedRectangle = function (
        x,
        y,
        width,
        height,
        color
    ) {
        let rectangle = new PIXI.Graphics()
            .beginFill("0x" + color, 1)
            .drawRect(x, y, width, height)
            .endFill()
            .beginHole()
            .drawRect(5, 5, width - 10, height - 10)
            .endHole();
        return rectangle;
    };

}



