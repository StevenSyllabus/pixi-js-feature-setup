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
    instance.data.randomElementID = `pixi-${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    console.log(instance.data.randomElementID)



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
                console.log(`dissapearing the child`)
                if (newPercent !== 1) {
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
























    //chrises functions




    instance.data.onDragStart = (e, rectangle, rectangles) => {
        const mousePosition = e.data.global;
        instance.data.changeRectColor(rectangle, rectangle.labelColor);
        rectangle.interactive = true; // Make the rectangle interactive
        rectangle.dragging = true;
        if (rectangle.resizing) {
            instance.data.logResize ? console.log("resizing active", mousePosition) : null;
            return;
        }
        instance.data.logDrag ? console.log("mousePosition", mousePosition) : null;
        instance.data.logDrag
            ? console.log("myRectanglePosition", rectangle.myRectanglePosition)
            : null;

        rectangle.draggingOffset = [
            mousePosition.x - rectangle.myRectanglePosition[0],
            mousePosition.y - rectangle.myRectanglePosition[1],
        ];

    }

    instance.data.onDragEnd = (e, rectangle, rectangles) => {
        //rectangle.selected = false;
        instance.data.changeRectColor(rectangle, rectangle.oldColor);
        rectangles.forEach((r) => (r.dragging = false));
        rectangles.forEach((r) => (r.interactive = false));
        instance.data.logDrag
            ? console.log(
                "DragEnd,color,interactive,selected",
                rectangle.labelColor,
                rectangle.interactive,
                rectangle.selected
            )
            : null;
        rectangle.off("pointermove");
    }

    instance.data.onDragMove = (e, rectangle, rectangles) => {
        //if (rectangle.dragging != true) return;
        if (rectangle.dragging) {

            var position = e.target.data.getLocalPosition(mainContainer);
            rectangle.position.x = position.x;
            rectangle.position.y = position.y;
        }
        instance.data.logDrag ? console.log("onDragMove") : null;
        instance.data.changeRectColor(rectangle, rectangle.labelColor);
    }

    instance.data.changeRectColor = (sq, color) => {
        instance.data.logDrag ? console.log("changeColor") : null;
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
    }

    //instance.data.for drawing in different directions
    instance.data.getStartCoordinates = (startX, startY, endX, endY) => {
        var width, height, startRectX, startRectY;
        startX < endX ? (width = endX - startX) : (width = startX - endX);
        startY < endY ? (height = endY - startY) : (height = startY - endY);
        startX < endX ? (startRectX = startX) : (startRectX = endX);
        startY < endY ? (startRectY = startY) : (startRectY = endY);
        return { startRectX, startRectY, width, height };
    }

    instance.data.addDragHand = (
        rectangle,
        rectangles
    ) => {
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
            rectangle.myRectanglePosition[1] +
            handlePosAdjustY
        );
        handle.anchor.x = 0.5;
        handle.anchor.y = 0.5;
        //console.log("rectBounds",(rectangle.myRectanglePosition[0] + rectangle.myRectanglePosition[2] - handlePosAdjustX), (rectangle.myRectanglePosition[1] + rectangle.myRectanglePosition[3] - handlePosAdjustY));
        const hitArea = new PIXI.Rectangle(0, 0, 64 * scaleHandle, 64 * scaleHandle);
        handle.hitArea = hitArea;
        handle.buttonMode = true;
        handle.name = "dragHandle";
        instance.data.logResize ? console.log("handle-hitarea", hitArea) : null;
        handle.scale.set(scaleHandle, scaleHandle);
        rectangle.addChild(handle);
    }

    instance.data.handleResizerRect = (e, rectangle, mainContainer, rectangles, webpageSprite) => {
        instance.data.logResize ? console.log('handle-resizer', rectangle, rectangle.resizing) : null;
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
            instance.data.logResize ? console.log("handle-endX-endY", endX, endY) : null;
            // Calculate the dimensions of the rectangle
            let coordinates = instance.data.getStartCoordinates(
                rectangle.myRectanglePosition[0],
                rectangle.myRectanglePosition[1],
                endX,
                endY
            );
            instance.data.logResize ? console.log("handle-coordinates", coordinates) : null;
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
    }
    instance.data.handleResizerRect2 = (e, rectangle, mainContainer, rectangles, webpageSprite) => {
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
    }

    instance.data.removeRectangle = (rectangle, array) => {
        instance.data.logResize
            ? console.log(
                "removeRectangle",
                array.filter((rect) => rect.name == rectangle.name)
            )
            : null;
        array = array.filter((rect) => rect.name != rectangle.name);
        return array;
    }
    instance.data.reDraw = () => {
        mainContainer.removeChildren();
        // Add the image back to the stage
        mainContainer.addChild(webpageSprite);
        // Add all previously added rectangles back to the stage
        instance.data.rectangles.forEach((r) => mainContainer.addChild(r));
    }

    ///Pixi.ts functions
    instance.data.findRect = (name) => {
        const foundRectangle = instance.data.rectangles.find((r) => r.name === name);
        if (foundRectangle) {
            return foundRectangle;
        }
    }
    //loads & reformats Drawn Attribute Snippets
    instance.data.loadDAS = (das) => {
        das.forEach((das, index) => {
            //var rect = Object.values(das);
            //console.log(rect);
            //will need placeholder for color. may need to generate specific
            let createCoord = instance.data.getStartCoordinates(
                das["X Coordinate (500)"],
                das["Y Coordinate (500)"],
                das["Box Width 250"],
                das["Box Height 250"]
            );
            instance.data.logging ? console.log("createCoord", createCoord) : null;

            //stop small box creation - Placeholder
            if (createCoord.width < 20) return;
            if (createCoord.height < 20) return;

            createRectangle(createCoord, "DE3249", "temp");
            //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
        });
    }
    instance.data.createRectangle = (createCoord, c, id) => {
        // Create a new rectangle graphic using the calculated dimensions
        isDrawing = false;

        //let createCoord = instance.data.getStartCoordinates(startX,startY,endX,endY);
        instance.data.logging ? console.log("createCoord", createCoord) : null;

        // Create a new rectangle graphic using the calculated dimensions
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xffff00, 0.5);
        rectangle.labelColor = "0x" + c;
        rectangle.oldColor = "0xFFFF00";
        rectangle.drawRect(
            createCoord.startRectX,
            createCoord.startRectY,
            createCoord.width,
            createCoord.height
        );
        rectangle.endFill();
        rectangle.interactive = false;
        rectangle.dragging = false;
        rectangle.name = Math.random().toString(16).substr(2, 8); //id;
        rectangle.intialScale = instance.data.app.view.width / instance.data.intialWebpageWidth;
        rectangle.buttonMode = true;
        rectangle.resizingRadius = false;
        rectangle.sortSize = createCoord.width * createCoord.height;
        rectangle.myRectanglePosition = [
            createCoord.startRectX,
            createCoord.startRectY,
            createCoord.width,
            createCoord.height,
        ];

        rectangle.cursor = "hand";
        instance.data.rectangles.push(rectangle);

        instance.data.mainContainer.addChild(rectangle);

        const x = rectangle.position.x;
        const y = rectangle.position.y;
        instance.data.addLabel(rectangle);
        instance.data.resizeActive ? addResizeHand(rectangle) : null;
        instance.data.addDragHand(rectangle, instance.data.rectangles);
    }

    //image loader
    instance.data.loadImage = (im) => {
        let ss = PIXI.Texture.from(im);
        let wpSprite = PIXI.Sprite.from(ss);
        wpSprite.interactive = true;
        // Add the image back to the container
        instance.data.mainContainer.addChild(wpSprite);
    }
    //adds a label PLACEHOLDER
    instance.data.addLabel = (rect) => {
        const label = new PIXI.Text(rect.name, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0x000000,
        });
        label.position.set(
            rect.getBounds().x + 20 - instance.data.mainContainer.position.x,
            rect.getBounds().y + 20 - instance.data.mainContainer.position.y
        );
        instance.data.logging ? console.log("label", rect, rect.getBounds()) : null;
        rect.addChild(label);
    }

    /*
    mainContainer.on("mouseup", (event) => {
      if (event.target.name == "dragHandle") {
        isDrawing = false;
        event.target.parent.selected = false;
        onDragEnd(event,event.target.parent,rectangles);
        logDrag ? console.log("mouseup-DragEvent,target,target-parent", event.target.name, event.target.parent.name ) : null;
        mainContainer.off("pointermove");
      }
      if (event.target.name == "resizeHandle") return;
      if (event.target.name == "mainContainer" && event.target.isDrawing) {
        event.target.isDrawing = false;
        rectangles.forEach((r) => (r.selected = false));
        logging ? console.log("main-Cont-Lmouseup") : null;
        mainContainer.off("pointermove");
        // Clear the stage
      isDrawing = false;
      mainContainer.removeChildren();
    
      // Add the image back to the stage
      mainContainer.addChild(webpageSprite);
    
        // Add all previously added rectangles back to the stage
        rectangles.forEach((r) => mainContainer.addChild(r));
    
      //let createCoord = instance.data.getStartCoordinates(startX,startY,endX,endY);
      logging ? console.log("createCoord", createCoord) : null;
    
        //stop small box creation - Placeholder
        if (createCoord.width < 20) return;
        if (createCoord.height < 20) return;
    
        createRectangle(createCoord, "DE3249", "temp");
    }
    eventReset();
    });
    */
    instance.data.eventReset = () => {
        instance.data.rectangles.forEach((r) => (r.dragging = false));
        instance.data.rectangles.forEach((r) => instance.data.changeRectColor(r, r.oldColor));
        instance.data.rectangles.forEach((r) => (r.resizing = false));
        instance.data.resizeHandles.forEach((r) => r.off("pointermove"));
        instance.data.mainContainer.off("pointermove");
        instance.data.mainContainer.isDrawing = false;
    }

    instance.data.wrapPointermove = (event, mainContainer) => {
        event.target.on("pointermove", (event) => {
            instance.data.logDrag ? console.log("pmactive", event.target.name) : null;
            if (event.target.name == "dragHandle") {
                instance.data.onDragMove(event, event.target.parent, instance.data.rectangles);
                instance.data.logDrag
                    ? console.log(
                        "pointermove-DragEvent,target,target-parent",
                        event.target.name,
                        event.target.parent.name
                    )
                    : null;
                instance.data.app.render(app.stage);
                return;
            }
            if (event.target.name == "resizeHandle") return;
            if (event.target.name == "mainContainer" && event.target.isDrawing) {
                instance.data.logDrag
                    ? console.log(
                        "pointermove-mainContainer,target,target-parent",
                        event.target.name
                    )
                    : null;
                // Clear the stage
                mainContainer.removeChildren();
                // Add the image back to the stage
                mainContainer.addChild(webpageSprite);

                // Calculate the current position of the pointer
                endX = event.global.x - mainContainer.position.x;
                endY = event.global.y - mainContainer.position.y;

                // Calculate the dimensions of the rectangle
                let coordinates = instance.data.getStartCoordinates(startX, startY, endX, endY);
                //logging ? console.log("coord", coordinates) : null;

                // Create a new rectangle graphic using the calculated dimensions
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
                rectangle.drawRect(
                    coordinates.startRectX,
                    coordinates.startRectY,
                    coordinates.width,
                    coordinates.height
                );
                rectangle.endFill();

                // Add the rectangle to the stage
                mainContainer.addChild(rectangle);

                // Add all previously added rectangles back to the stage
                rectangles.forEach((r) => mainContainer.addChild(r));
            }
        });
    }

    instance.data.addResizeHand = (rectangle) => {
        const png = PIXI.Texture.from(
            `https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true`
        );
        const handle = PIXI.Sprite.from(png);
        handle.interactive = true;
        var handlePosAdjustX = 40;
        var handlePosAdjustY = 40;
        var scaleHandle = 0.75;
        handle.position.set(
            rectangle.myRectanglePosition[0] +
            rectangle.myRectanglePosition[2] -
            handlePosAdjustX,
            rectangle.myRectanglePosition[1] +
            rectangle.myRectanglePosition[3] -
            handlePosAdjustY
        );
        //console.log("rectBounds",(rectangle.myRectanglePosition[0] + rectangle.myRectanglePosition[2] - handlePosAdjustX), (rectangle.myRectanglePosition[1] + rectangle.myRectanglePosition[3] - handlePosAdjustY));
        const hitArea = new PIXI.Rectangle(0, 0, 64 * scaleHandle, 64 * scaleHandle);
        handle.hitArea = hitArea;
        handle.buttonMode = true;
        handle.name = "resizeHandle";
        instance.data.logResize ? console.log("handle-hitarea", hitArea) : null;
        handle.scale.set(scaleHandle, scaleHandle);
        instance.data.resizeHandles.push(handle);
        rectangle.addChild(handle);
        /*handleEvents(handle, rectangle);
        handle
          .on("pointerdown", instance.data.(e) {
            rectangle.resizing = true;
            isDrawing = false;
            onDragStartH(e,rectangle);
          })
          .on('pointermove', instance.data.e){
            rectangle.resizing = true;
            isDrawing = false;
            onDragMoveH(e,rectangle);
        }) 
          .on("pointerup", instance.data.(e) {
            isDrawing = false;
            rectangle.resizing = false;
            onDragEndH(e,rectangle);
          })
          .on('pointerupoutside', instance.data.e){
            isDrawing = false;
            rectangle.resizing = false;
            onDragEndH(e,rectangle);
            }) 
            */
    }

    /*
    instance.data.handleEvents (handle, rectangle) {
      handle.interactive = true;
      handle.on('pointerdown', (e) => {
        console.log(`handleEventsStartH`);
        onDragStartH(e, rectangle, handle);
        e.stopPropagation();
      })
          //.on('mousemove', onDragMove)
    }
    */
    // mousedown event listener
    instance.data.onDragStartH = (event) => {
        event.target.parent.interactive = true;
        initialMousePosX = event.target.parent.x;
        initialMousePosY = event.target.parent.y;
        initialRectWidth = event.target.parent.width;
        initialRectHeight = event.target.parent.height;
        //isResizing = true;.tgppare
        //console.log("dragStartH",isDrawing,event.target.parent.name);
        event.target.on("pointermove", function (event) {
            event.target.parent.resizing = true;
            isDrawing = false;
            instance.data.onDragMoveH(event);
        });
    }

    // mousemove event listener
    instance.data.onDragMoveH = (event) => {
        /*
        mainContainer.removeChildren();
            // Add the image back to the stage
            mainContainer.addChild(webpageSprite);
      
            // Calculate the current position of the pointer
            endX = event.global.x - mainContainer.position.x;
            endY = event.global.y - mainContainer.position.y;
      
            // Calculate the dimensions of the rectangle
            let coordinates = instance.data.getStartCoordinates(event.target.parent.x, event.target.parent.y, endX, endY);
            //logging ? console.log("coord", coordinates) : null;
      
            // Create a new rectangle graphic using the calculated dimensions
            const rectangle = new PIXI.Graphics();
            rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
            rectangle.drawRect(
                coordinates.startRectX,
                coordinates.startRectY,
                coordinates.width,
                coordinates.height
            );
            rectangle.endFill();
      
            // Add the rectangle to the stage
            mainContainer.addChild(rectangle);
      
            // Add all previously added rectangles back to the stage
            rectangles.forEach((r) => mainContainer.addChild(r));
        
          currentMousePosX = event.data.global.x;
          currentMousePosY = event.data.global.y;
          var deltaX = currentMousePosX - initialMousePosX;
          var deltaY = currentMousePosY - initialMousePosY;
          logResize ? console.log(event.data,"initialMouse", initialMousePosX,initialMousePosY,"initialRect", initialRectWidth,initialRectHeight,"currentMouse",
          currentMousePosX,currentMousePosY,"currentRectSizes",event.target.parent.width,event.target.parent.height,event.data.originalEvent) : null;
          //event.target.parent.width = initialRectWidth + deltaX;
          //event.target.parent.height = initialRectHeight + deltaY;
          event.target.parent.x += event.data.originalEvent.movementX;
          event.target.parent.y += event.data.originalEvent.movementX;
      
          logResize ? console.log("initialMouse", initialMousePosX,initialMousePosY,"initialRect", initialRectWidth,initialRectHeight,"currentMouse",
          currentMousePosX,currentMousePosY,"currentRectSizes",event.target.parent.width,event.target.parent.height,event.data.originalEvent) : null;
          event.target.x =  event.target.parent.width - event.target.width/2;
          event.target.y = event.target.parent.height - event.target.height/2;
      */
        // Clear the stage
        /*mainContainer.removeChildren();
      
        // Add the image back to the stage
        mainContainer.addChild(webpageSprite);
      
        // Calculate the current position of the pointer
        var endX = event.global.x - mainContainer.position.x;
        var endY = event.global.y - mainContainer.position.y;
      
        // Calculate the dimensions of the rectangle
        let coordinates = instance.data.getStartCoordinates(rect.myRectanglePosition[0], rect.myRectanglePosition[1], endX, endY);
        logResize ? console.log("coord", coordinates) : null;
      
        // Create a new rectangle graphic using the calculated dimensions
        
       
        const rectangle = new PIXI.Graphics();
        rectangle.name = rect.name;
        rectangle.intialScale = app.view.width / intialWebpageWidth;
        rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
        rectangle.drawRect(
          coordinates.startRectX,
          coordinates.startRectY,
          coordinates.width,
          coordinates.height
        );
        rectangle.endFill();
        removeRectangle(rect, rectangles);
      
        // Add the rectangle to the stage
        rectangles.push(rectangle);
        //let rectanglesSorted = reorderRectangles(rectangles);
        // Add all previously added rectangles back to the stage
        rectangles.forEach((r) => mainContainer.addChild(r));
        //rectanglesSorted.forEach((r) => mainContainer.addChild(r));
        //rectanglesSorted.forEach((r) => console.log(r.sortSize));
        */
        logging ? console.log("resizemove") : null;
    }

    // mouseup event listener
    instance.data.onDragEndH = (event) => {
        event.target.parent.resizing = false;
        event.target.off("pointermove");
        //this.interactive = false;
        instance.data.logDrag ? console.log("ResizeEnd", event.target.parent.resizing) : null;
    }

    instance.data.reorderRectangles = (rectangles) => {
        rectangles.sort((a, b) => {
            return a.sortSize - b.sortSize;
        });
    }

    instance.data.reDraw = () => {
        mainContainer.removeChildren();
        // Add the image back to the stage
        mainContainer.addChild(webpageSprite);
        // Add all previously added rectangles back to the stage
        rectangles.forEach((r) => mainContainer.addChild(r));
    }


    instance.data.onDragStart = (e, rectangle, rectangles) => {
        const mousePosition = e.data.global;
        instance.data.changeRectColor(rectangle, rectangle.labelColor);
        rectangle.interactive = true; // Make the rectangle interactive
        rectangle.dragging = true;
        if (rectangle.resizing) {
            instance.data.logResize ? console.log("resizing active", mousePosition) : null;
            return;
        }
        instance.data.logDrag ? console.log("mousePosition", mousePosition) : null;
        instance.data.logDrag
            ? console.log("myRectanglePosition", rectangle.myRectanglePosition)
            : null;

        rectangle.draggingOffset = [
            mousePosition.x - rectangle.myRectanglePosition[0],
            mousePosition.y - rectangle.myRectanglePosition[1],
        ];
    }

    instance.data.onDragEnd = (e, rectangle, rectangles) => {
        //rectangle.selected = false;

        instance.data.changeRectColor(rectangle, rectangle.oldColor);
        rectangles.forEach((r) => (r.dragging = false));
        rectangles.forEach((r) => (r.interactive = false));
        instance.data.logDrag
            ? console.log(
                "DragEnd,color,interactive,selected",
                rectangle.labelColor,
                rectangle.interactive,
                rectangle.selected
            )
            : null;
        rectangle.off("pointermove");
    }

    instance.data.onDragMove = (e, rectangle, rectangles) => {
        //if (rectangle.dragging != true) return;
        if (rectangle.dragging) {
            rectangle.position.x += e.data.originalEvent.movementX;
            rectangle.position.y += e.data.originalEvent.movementY;
            rectangle.lastMoveX = rectangle.position.x;
            rectangle.lastMoveY = rectangle.position.y;

            instance.data.logDrag ? console.log("onDragMove") : null;
            instance.data.changeRectColor(rectangle, rectangle.labelColor);
        }
    }
    instance.data.changeRectColor = (sq, color) => {
        instance.data.logDrag ? console.log("changeColor") : null;
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
    }

    //function for drawing in different directions
    instance.data.getStartCoordinates = (startX, startY, endX, endY) => {
        var width, height, startRectX, startRectY;
        startX < endX ? (width = endX - startX) : (width = startX - endX);
        startY < endY ? (height = endY - startY) : (height = startY - endY);
        startX < endX ? (startRectX = startX) : (startRectX = endX);
        startY < endY ? (startRectY = startY) : (startRectY = endY);
        return { startRectX, startRectY, width, height };
    }

    instance.data.addDragHand = (rectangle, rectangles) => {
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
        instance.data.logResize ? console.log("handle-hitarea", hitArea) : null;
        handle.scale.set(scaleHandle, scaleHandle);
        rectangle.addChild(handle);
    }

    instance.data.handleResizerRect = (
        e,
        rectangle,
        mainContainer,
        rectangles,
        webpageSprite
    ) => {
        instance.data.logResize
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
            instance.data.logResize ? console.log("handle-endX-endY", endX, endY) : null;
            // Calculate the dimensions of the rectangle
            let coordinates = instance.data.getStartCoordinates(
                rectangle.myRectanglePosition[0],
                rectangle.myRectanglePosition[1],
                endX,
                endY
            );
            instance.data.logResize ? console.log("handle-coordinates", coordinates) : null;
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

            instance.data.rectangles.forEach((r) => mainContainer.addChild(r));
        }
    }
    instance.data.handleResizerRect2 = (
        e,
        rectangle,
        mainContainer,
        rectangles,
        webpageSprite
    ) => {
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
    }

    instance.data.removeRectangle = (rectangle, array) => {
        logResize
            ? console.log(
                "removeRectangle",
                array.filter((rect) => rect.name == rectangle.name)
            )
            : null;
        array = array.filter((rect) => rect.name != rectangle.name);
        return array;
    }
































    //end chris functions




















    //event listener functions

    instance.data.wrapPointermove = (event) => {
        event.target.on("pointermove", (event) => {
            if (event.target.name == "dragHandle") {
                instance.data.onDragMove(event, event.target.parent, instance.data.rectangles);

                instance.data.app.render(app.stage);
                return;
            }
            if (event.target.name == "resizeHandle") return;
            if (event.target.name == "mainContainer" && event.target.isDrawing) {
                console.log(`clicked the main container`, event.target.name)

                // Clear the stage
                instance.data.mainContainer.removeChildren();
                // Add the image back to the stage
                instance.data.mainContainer.addChild(instance.data.webpageSprite);

                // Calculate the current position of the pointer
                endX = event.global.x - instance.data.mainContainer.position.x;
                endY = event.global.y - instance.data.mainContainer.position.y;

                // Calculate the dimensions of the rectangle
                let coordinates = instance.data.getStartCoordinates(startX, startY, endX, endY);
                //logging ? console.log("coord", coordinates) : null;

                // Create a new rectangle graphic using the calculated dimensions
                const rectangle = new PIXI.Graphics();
                rectangle.beginFill(0x0000ff, 0.5); // Transparent blue
                rectangle.drawRect(
                    coordinates.startRectX,
                    coordinates.startRectY,
                    coordinates.width,
                    coordinates.height
                );
                rectangle.endFill();

                // Add the rectangle to the stage
                instance.data.mainContainer.addChild(rectangle);

                // Add all previously added rectangles back to the stage
                instance.data.rectangles.forEach((r) => instance.data.mainContainer.addChild(r));
            }
        });
    }


}