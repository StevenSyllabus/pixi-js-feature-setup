function(instance, properties, context) {
    ////////////// NOTE TO STEVEN: added these globally, as they needed to be defined, apparently
    let mainContainer, app, renderer, canvasElement, ele, screenshot;
    instance.data.startX, instance.data.startY, instance.data.endX, instance.data.endY;
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
    ///local functions for testing





    ///end local function

    ////////////// NOTE TO STEVEN: wrapped this for various reasons, maybe we should move some of these like mainContainer to instance everywhere, not sure
    if (instance.data.start) {
        instance.data.start = false;
        instance.canvas.insertAdjacentHTML("beforeend", `<div id=${instance.data.randomElementID} class="pixi-container"></div>`)
            ;
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
        app.renderer.on(`resize`, function (event) {
            instance.data.handleResize(event, app, mainContainer, webpageSprite, intialWebpageWidth);
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
            intialWebpageWidth = webpageSprite.width;
            intialWebpageHeight = webpageSprite.height;
            webpageSprite.intialWidth = webpageSprite.width;
            mainContainer.addChild(webpageSprite);
            mainContainer.interactive = true;
            console.log(`the main`, mainContainer)

            webpageSprite.scale.set(app.view.width / webpageSprite.width);
            intialCanvasWidth = app.view.width;
            intialCanvasHeight = app.view.height;
            intialScale = intialCanvasWidth / intialWebpageWidth;
            webpageSprite.intialScale = app.view.width / webpageSprite
                .width;
            ////////////// NOTE TO STEVEN: commented out as there is an issue with functions above
            scrollBar = instance.data.createScrollBar(mainContainer, app, ele)










            //begin adding event listeners

            //pointerup






            instance.data.mainContainer.on("pointerup", (event) => {
                logEvents
                    ? console.log("pointerup", event.target.name, "start", startX, startY)
                    : null;
                if (event.target.name == "dragHandle") {
                    isDrawing = false;
                    event.target.parent.selected = false;
                    instance.data.onDragEnd(event, event.target.parent, instance.data.rectangles);
                    instance.data.logDrag
                        ? console.log(
                            "pointerup-DragEvent,target,target-parent",
                            event.target.name,
                            event.target.parent.name
                        )
                        : null;
                    mainContainer.off("pointermove");
                    return;
                }
                if (event.target.name == "resizeHandle") {
                    instance.data.onDragStartH(event);
                    return;
                }
                if (event.target.name == "mainContainer" && event.target.isDrawing) {
                    //stop if comes from reset
                    if (startX == 0 && startY == 0) {
                        instance.data.eventReset();
                        return;
                    }

                    mainContainer.isDrawing = false;
                    instance.data.rectangles.forEach((r) => (r.selected = false));
                    instance.data.logging
                        ? console.log("main-Cont-pointerUp", mainContainer.isDrawing)
                        : null;
                    mainContainer.off("pointermove");
                    // Clear the stage
                    isDrawing = false;
                    mainContainer.removeChildren();

                    // Add the image back to the stage
                    mainContainer.addChild(webpageSprite);

                    // Add all previously added rectangles back to the stage
                    instance.data.rectangles.forEach((r) => mainContainer.addChild(r));

                    let createCoord = instance.data.getStartCoordinates(startX, startY, endX, endY);
                    instance.data.logging ? console.log("createCoord", createCoord) : null;

                    //stop small box creation - Placeholder
                    if (createCoord.width < 40) {
                        instance.data.eventReset();
                        return;
                    }
                    if (createCoord.height < 40) {
                        instance.data.eventReset();
                        return;
                    }

                    instance.data.createRectangle(createCoord, "DE3249", "temp");
                    instance.data.eventReset();
                    return;
                }

                instance.data.eventReset();
                logEvents
                    ? console.log("pointerup", event.target.name, "start", startX, startY)
                    : null;
            });



























            mainContainer.on("pointerdown", (event) => {

                if (event.target.name == "dragHandle") {
                    event.target.parent.selected = true;
                    event.target.isDrawing = false;
                    instance.data.onDragStart(event, event.target.parent, instance.data.rectangles);
                    instance.data.wrapPointermove(event, event.target.parent);
                    return;
                }
                if (event.target.name == "resizeHandle") {
                    event.target.parent.resizing = true;
                    isDrawing = false;
                    instance.data.onDragStartH(event);
                    return;
                }
                // Check if the mouse is over any of the rectangles
                if (event.target.name == "mainContainer") {
                    instance.data.logging ? console.log("listener pointerdown-mainCont") : null;
                    event.target.isDrawing = true;
                    startX = event.global.x - mainContainer.position.x;
                    startY = event.global.y - mainContainer.position.y;
                    endX = event.global.x - mainContainer.position.x;
                    endY = event.global.y - mainContainer.position.y;

                    instance.data.wrapPointermove(event);
                    return;
                }
            });




















            instance.data.addedScreenshot = true
        });
    }


    //Listeners





}