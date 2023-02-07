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
            instance.data.handleResize(event, app, mainContainer, webpageSprite, instance.data.intialWebpageWidth);
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
            webpageSprite.intialScale = app.view.width / webpageSprite
                .width;
            ////////////// NOTE TO STEVEN: commented out as there is an issue with functions above
            scrollBar = instance.data.createScrollBar(mainContainer, app, ele)

            ///c addssss
            
mainContainer.on('pointerdown', (e) => {
    // Initiate rect creation
    console.log(instance.data.inputMode)
    if (instance.data.inputMode == instance.data.inputModeEnum.create) {
        instance.data.startPosition = new PIXI.Point().copyFrom(e.global)
    instance.data.logging ? console.log("pointerdown", instance.data.startPosition) : null;
}
if (instance.data.inputMode == instance.data.inputModeEnum.select) {
    //PLACEHOLDER for select function
    if (e.target != instance.data.mainContainer) {instance.data.selectRect(e.target);}
}
});

mainContainer.on('pointermove', (e) => {
    // Do this routine only if in create mode and have started creation
    // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
    if (instance.data.inputMode == instance.data.inputModeEnum.create && instance.data.startPosition) {
        // get new global position from event
        let currentPosition = e.global;
        let {
            start,
            size
        } = instance.data.getStartAndSize(currentPosition, instance.data.startPosition, "draw")
        if (size.x > 5 && size.y > 5) {
            if (!instance.data.currentRectangle) {
                instance.data.currentRectangle = new PIXI.Graphics()
                    .beginFill("0x" + instance.data.highlightColor, .5)
                    .lineStyle({
                        color: "0x" + instance.data.highlightColor,
                        alpha: 0.5,
                        width: 1
                    })
                    .drawRect(0, 0, size.x, size.y)
                    .endFill()
                instance.data.currentRectangle.labelColor = "0x" + instance.data.highlightColor;
                instance.data.currentRectangle.oldColor = instance.data.highlightColor;
                instance.data.currentRectangle.name = "";
                instance.data.currentRectangle.position.copyFrom(start)
                instance.data.addLabel(instance.data.currentRectangle);
                instance.data.mainContainer.addChild(instance.data.currentRectangle)
            } else {
                instance.data.scaleRectB(instance.data.currentRectangle, currentPosition)
            }
        } else {
            if (instance.data.currentRectangle) {
                instance.data.mainContainer.removeChild(instance.data.currentRectangle);
                instance.data.currentRectangle = null
            }
        }

    }
});

mainContainer.on('pointerup', (e) => {
    // Wrap up rect creation
    instance.data.startPosition = null
    if (instance.data.currentRectangle && instance.data.currentRectangle.interactive == false) {
        instance.data.currentRectangle.interactive = true;
        instance.data.currentRectangle
            // Mouse & touch events are normalized into
            // the pointer* events for handling different
            // Rectangle events.
            .on('pointerover', instance.data.onRectangleOver)
            .on('pointerout', instance.data.onRectangleOut);
    }
    instance.data.currentRectangle = null
    instance.data.onDragEndNew()
});

mainContainer.on('pointerupoutside', instance.data.onDragEndNew);

mainContainer.interactive = true;
mainContainer.hitArea = mainContainer.screen;

//load our data
instance.data.loadDAS(DAS,mainContainer);
            //end c adds
            
            instance.data.addedScreenshot = true
        });
    }


    //Listeners





}