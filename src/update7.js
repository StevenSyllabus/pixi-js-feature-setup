function(instance, properties, context) {
    
    if (properties.attributes) {var labelNames = properties.attributes.get(0, properties.attributes.length());}
    if (properties.attribute_colors) {var labelColors = properties.attribute_colors.get(0, properties.attribute_colors.length());}
     var webpageScreenshot = properties.webpage_screenshot;
     var labelFont = properties.font;
     var labelFontSize = properties.font_size;
     var labelFontColor = properties.labelFontColor;
    if (properties.drawn_attribute_snippets) {
    var DAS = properties.drawn_attribute_snippets.get(0, properties.drawn_attribute_snippets.length());
    DAS.forEach((das, index) => {
     das.attributeName = attribute[index].name;
     das.attributeId = attribute[index].uniqueid;
     das.labelColor = attribute_colors[index];
    })
    } else {
    ////testdata
    var DAS = new Array(
  {
    "Corner Roundness": 5,
    "Offset of top (y)": 395.96128953041926,
    "Syllabus Canvas Width": 483.328125,
    "Syllabus Canvas Height": 3623.03125,
    "Shape ID": "shape_unique_id_849029",
    "Modified Date": 1674151426823,
    "Created Date": 1674151424836,
    "Created By": "1648561974656x439262183960839300",
    "Y Coordinate (500)": 395,
    "X Coordinate (500)": 193,
    "Mobile Screenshot": "1674151421044x594933091784470800",
    "Box Width 250": 88,
    "Box Height 250": 99,
    Attribute: "1673375655977x752951405907542000",
    "Account Webpage": "1648649408910x887794807113668500",
    "Stroke Width": 2,
    Shape: "Rectangle",
    "X Coordinate (250)": 96,
    "X Coordinate (960)": 370,
    "Y Coordinate (250)": 197,
    "Y Coordinate (960)": 758,
    _id: "1674151425031x842236848750460900",
  },
  {
    "Corner Roundness": 5,
    "Offset of top (y)": 228,
    "Desktop Screenshot": "1670451431357x388596123285430460",
    "Syllabus Canvas Width": 483,
    "Syllabus Canvas Height": 712,
    "Shape ID": "shape_unique_id_134457",
    "Modified Date": 1674151406774,
    "Created Date": 1674151403247,
    "Created By": "1648561974656x439262183960839300",
    "Y Coordinate (500)": 228,
    "X Coordinate (500)": 95,
    "Box Width 250": 30,
    "Box Height 250": 25,
    Attribute: "1668510026384x892836158180425700",
    "Account Webpage": "1648649408910x887794807113668500",
    "Stroke Width": 2,
    Shape: "Rectangle",
    "X Coordinate (250)": 47,
    "X Coordinate (960)": 182,
    "Y Coordinate (250)": 114,
    "Y Coordinate (960)": 437,
    _id: "1674151403457x266515680396836860",
  },
  {
    "Corner Roundness": 5,
    "Offset of top (y)": 51,
    "Desktop Screenshot": "1672862222970x520878899413092600",
    "Syllabus Canvas Width": 485,
    "Syllabus Canvas Height": 515,
    "Shape ID": "shape_unique_id_819523",
    "Modified Date": 1674062602996,
    "Created Date": 1674062601183,
    "Created By": "1664221186966x204293830276146340",
    "Y Coordinate (500)": 51,
    "X Coordinate (500)": 21,
    "Box Width 250": 146,
    "Box Height 250": 77.5,
    Attribute: "1668800394117x917004865047887900",
    "Account Webpage": "1667262889527x858621114244434700",
    "Stroke Width": 2,
    Shape: "Rectangle",
    "X Coordinate (250)": 10,
    "X Coordinate (960)": 40,
    "Y Coordinate (250)": 25,
    "Y Coordinate (960)": 97,
    _id: "1674062600971x785814322671779800",
  },
  {
    "Corner Roundness": 5,
    "Offset of top (y)": 122,
    "Desktop Screenshot": "1672867270966x627421898112095900",
    "Syllabus Canvas Width": 945,
    "Syllabus Canvas Height": 4000,
    "Shape ID": "shape_unique_id_653347",
    "Modified Date": 1674059224359,
    "Created Date": 1674059222796,
    "Created By": "1664221186966x204293830276146340",
    "Y Coordinate (500)": 63,
    "X Coordinate (500)": 29,
    "Box Width 250": 30.729166666666668,
    "Box Height 250": 13.541666666666668,
    Attribute: "1668800394117x917004865047887900",
    "Account Webpage": "1672867250672x906510004638974000",
    "Stroke Width": 2,
    Shape: "Rectangle",
    "X Coordinate (250)": 14,
    "X Coordinate (960)": 57,
    "Y Coordinate (250)": 31,
    "Y Coordinate (960)": 122,
    _id: "1674059222456x786064976190898200",
  },
  {
    "Corner Roundness": 5,
    "Offset of top (y)": 32,
    "Desktop Screenshot": "1672867270966x627421898112095900",
    "Syllabus Canvas Width": 960,
    "Syllabus Canvas Height": 4000,
    "Shape ID": "shape_unique_id_884652",
    "Modified Date": 1674046122447,
    "Created Date": 1674046115188,
    "Created By": "1667849232139x190159762978082900",
    "Y Coordinate (500)": 16,
    "X Coordinate (500)": 10,
    "Box Width 250": 38.802083333333336,
    "Box Height 250": 17.96875,
    Attribute: "1668800394117x917004865047887900",
    "Account Webpage": "1672867250672x906510004638974000",
    "Stroke Width": 2,
    Shape: "Rectangle",
    "X Coordinate (250)": 5,
    "X Coordinate (960)": 21,
    "Y Coordinate (250)": 8,
    "Y Coordinate (960)": 32,
    _id: "1674046114484x384901095148486660",
  }
);
    }

//var att = properties.att
var att = new Array(
  {
    "Latest Volume": 346,
    "Related Webpages": ["1648649408910x887794807113668500"],
    "Created Date": 1673375665144,
    Name: "CTA",
    Account: "1648562004649x223328173625704450",
    "Modified Date": 1674151427900,
    "Created By": "1648561974656x439262183960839300",
    "Average Distance from top": 236,
    Color: "4",
    "Name Search": "cta",
    "Last Used": 1674151426414,
    _id: "1673375655977x752951405907542000",
  },
  {
    "Latest Volume": 358,
    "Related Webpages": [
      "1648649408910x887794807113668500",
      "1648649415130x341237624746570240",
    ],
    "Created Date": 1668510027553,
    Name: "Attribute 3",
    Account: "1648562004649x223328173625704450",
    "Modified Date": 1674151407928,
    "Created By": "1648561974656x439262183960839300",
    "Average Distance from top": 138,
    Color: "#ff00ff",
    "Name Search": "attribute 3",
    "Last Used": 1674151406474,
    _id: "1668510026384x892836158180425700",
  },
  {
    "Latest Volume": 15442,
    "Related Webpages": [
      "1664221313711x475501364962342100",
      "1664223419885x108644029860312400",
      "1664221316045x125346515221780750",
      "1664221313698x632940115935128000",
      "1672867250672x906510004638974000",
      "1667262889527x858621114244434700",
    ],
    "Created Date": 1668800409315,
    Name: "MY attribute",
    Account: "1664221229355x903532045837271000",
    "Modified Date": 1674147291058,
    "Created By": "1664221186966x204293830276146340",
    "Average Distance from top": 269,
    Color: "#38761d",
    "Name Search": "my attribute",
    "Last Used": 1674147290378,
    _id: "1668800394117x917004865047887900",
  },
  {
    "Latest Volume": 15442,
    "Related Webpages": [
      "1664221313711x475501364962342100",
      "1664223419885x108644029860312400",
      "1664221316045x125346515221780750",
      "1664221313698x632940115935128000",
      "1672867250672x906510004638974000",
      "1667262889527x858621114244434700",
    ],
    "Created Date": 1668800409315,
    Name: "MY attribute",
    Account: "1664221229355x903532045837271000",
    "Modified Date": 1674147291058,
    "Created By": "1664221186966x204293830276146340",
    "Average Distance from top": 269,
    Color: "#38761d",
    "Name Search": "my attribute",
    "Last Used": 1674147290378,
    _id: "1668800394117x917004865047887900",
  },
  {
    "Latest Volume": 15442,
    "Related Webpages": [
      "1664221313711x475501364962342100",
      "1664223419885x108644029860312400",
      "1664221316045x125346515221780750",
      "1664221313698x632940115935128000",
      "1672867250672x906510004638974000",
      "1667262889527x858621114244434700",
    ],
    "Created Date": 1668800409315,
    Name: "MY attribute",
    Account: "1664221229355x903532045837271000",
    "Modified Date": 1674147291058,
    "Created By": "1664221186966x204293830276146340",
    "Average Distance from top": 269,
    Color: "#38761d",
    "Name Search": "my attribute",
    "Last Used": 1674147290378,
    "_id": "1668800394117x917004865047887900"
  });
  //var colors = properties.colors;
  var colors = new Array("57d9a3", "ff00ff", "38761d", "38761d", "38761d");
  //rects array (x,y,width,height,color,id)
var rects = new Array();
rects[0] = new Array(1, 5, 15, 15, "0xDE3249", 1);
rects[1] = new Array(100, 150, 250, 250, "0x800080", 2);

var rects2 = new Array();
rects2[0] = new Array(1, 5, 15, 15, "0x800080", 3);
rects2[1] = new Array(100, 150, 250, 250, "0xDE3249", 4);
    //end test data
    instance.data.startX, instance.data.startY, instance.data.endX, instance.data.endY;
    let intialWebpageHeight,
        intialCanvasWidth,
        intialCanvasHeight,
        intialScale,
        webpageSprite,
        scrollBar,
        imgixBaseURL;
    let resizeTimeout = null;
    ///new csp
    //@ts-nocheck this turns off typesccript checks for the entire file
    // this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
    let screenshot;
    let isDrawing = false;
    let logRectEvents = false;
    let loadData = true;
    let logEvents = false;
    let initialMousePosX, initialMousePosY, currentMousePosY, currentMousePosX;
    let initialRectWidth;
    let initialRectHeight;
    //start C Declare before import
    let startX, startY, endX, endY;
    let logging = true;
    let resizeActive = false;
    const rectangles = [];
    const resizeHandles = [];
    // Load textures for edit
    const hrefMove =
        "https://s3.amazonaws.com/appforest_uf/d110/f1674669224748x768134644407078900/drag_indicator_FILL0_wght400_GRAD0_opsz48.png";
    const hrefScale =
        "https://s3.amazonaws.com/appforest_uf/d110/f1674585363384x114691738198125620/drag-handle-corner.png?ignore_imgix=true";
    const textureMove = PIXI.Texture.from(hrefMove);
    const textureScale = PIXI.Texture.from(hrefScale);
    const highlightColor = properties.highlight_color; // "FFFF00"; //yellow
    const dragColor = properties.drag_color;//"DE3249"; //red
    const resizeColor = properties.resize_color; //"FFFF00"; //"0000FF"; //blue
    //test data loaded from test-data.ts
    //var DAS = properties.das;
    //var att = properties.att
    //var colors = properties.colors;
    //declare
    // Start position of events
    let startPosition = null;
    // Current edited or created rectangle
    let currentRectangle = null;
    let InputModeEnum = {
        create: 1,
        select: 2,
        scale: 3,
        move: 4
    };
    // Set mode for whole input (by default we create rectangles)
    let inputMode = InputModeEnum.create;
    // Pointer to current active control (Move or Scale icon)
    let dragController = null;
    // Active shown controls (can be shown both or one hovered / active)
    let controls = [];
    //declare functions
    // Find the rectangle with the specified names
    function findRect(name) {
        const foundRectangle = rectangles.find((r) => r.name === name);
        if (foundRectangle) {
            return foundRectangle;
        }
    }
    //loads & reformats Drawn Attribute Snippets

    function addLabel(rect) {
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

    function createExistingRect(createCoord, color, name, id) {
        // Create graphics
        if (color == "") {
            color = highlightColor
        }
        currentRectangle = new PIXI.Graphics().beginFill("0x" + color, 0.5)
            // returns initial graphis so we can daizy chaing
            .lineStyle({
                color: 0x111111,
                alpha: 0,
                width: 1
            })
            //create rect in orgin for calculation simplification
            .drawRect(0, 0, createCoord.width, createCoord.height).endFill()
        currentRectangle.labelColor = "0x" + color;
        currentRectangle.oldColor = "0x" + color;
        currentRectangle.name = name;
        currentRectangle.attributeName = name;
        currentRectangle.attributeId = id;
        // then we move it to final position
        currentRectangle.position.copyFrom(new PIXI.Point(createCoord.startRectX, createCoord.startRectY));
        //addLabel(currentRectangle);
        mainContainer.addChild(currentRectangle);
        // make it hoverable
        currentRectangle.interactive = true;
        currentRectangle.on('pointerover', onRectangleOver).on('pointerout', onRectangleOut);
        // remove it from current ceration and chose new color for next one
        addLabel(currentRectangle);
        console.log("currentRect", currentRectangle);
        currentRectangle = null;
    }
    // Function that generates test rect 
    function testRect() {
        // Create graphics
        currentRectangle = new PIXI.Graphics().beginFill("0x" + highlightColor, 0.5)
            // returns initial graphis so we can daizy chaing
            .lineStyle({
                color: 0x111111,
                alpha: 0,
                width: 1
            })
            // we create rect in orgin for calculation simplification
            .drawRect(0, 0, 100, 100).endFill()
        // then we move it to final position
        currentRectangle.labelColor = "0x";
        currentRectangle.oldColor = "0xFFFF00";
        currentRectangle.name = "0xFFFF00";
        currentRectangle.position.copyFrom(new PIXI.Point(100, 100))
        addLabel(currentRectangle);
        mainContainer.addChild(currentRectangle)
        // make it hoverable
        currentRectangle.interactive = true;
        addLabel(currentRectangle);
        currentRectangle.on('pointerover', onRectangleOver).on('pointerout', onRectangleOut);
        currentRectangle = null;
    }
    //testRect()
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
            return
        }
        // Do not hover rectangle if we creating
        if (inputMode == InputModeEnum.create && startPosition) {
            return
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
        mainContainer.addChild(buttonMove);
        console.log("add ButtonMove to container", mainContainer, buttonMove);
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
        mainContainer.addChild(buttonScale);
        controls.push(buttonScale);
    }

    function cleanupcontrols() {
        controls = controls.filter(el => el.parent)
        if (controls.length == 0) {
            onDragEndNew()
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
                mainContainer.removeChild(control);
                cleanupcontrols()
            }
        }, 0)
    }
    // Event is triggered when we move mouse out of rectangle
    function onRectangleOut() {
        this.isOver = false;
        console.log("OUT");
        controls.forEach(control => removeIfUnused(control))
    }
    // Normalize start and size of square so we always have top left corner as start and size is always +
    function getStartAndSize(pointA, pointB, type) {
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
            }
        } else if (type == "draw") {
            return {
                start: new PIXI.Point(startX - mainContainer.position.x, startY - mainContainer.position.y),
                size: new PIXI.Point(absDeltaX, absDeltaY)
            }
        }
    }
    //these two are slightly different, could probably be combined
    function scaleRect(resizeRectange, dragController) {
        //currentPosition)
        let {
            start,
            size
        } = getStartAndSize(startPosition, dragController.position, "scaleRect")
        if (size.x < 20 || size.y < 20) return
        // When we scale rect we have to give it new cordinates so we redraw it
        // in case of sprite we would do this a bit differently with scale property,
        // for simple geometry this is better solution because scale propagates to children
        let startPositionController = new PIXI.Point(dragController.position.x - 20, dragController.position.y - 20);
        resizeRectange.clear()
        resizeRectange.position.copyFrom(start)
        resizeRectange.beginFill("0x" + resizeColor, .5).lineStyle({
            color: 0x111111,
            alpha: 0.5,
            width: 1
        }).drawRect(0, 0, size.x, size.y).endFill()
        dragController.position.copyFrom(startPositionController)
        console.log("scaleRect, startPos, startPosController,dragcontroller,mainContainer", startPosition,
            startPositionController, dragController.position, mainContainer.position);
    }

    function scaleRectB(resizeRectange, currentPosition) {
        let {
            start,
            size
        } = getStartAndSize(startPosition, currentPosition, "draw");
        console.log("scaleRectB");
        if (size.x < 5 || size.y < 5) return
        // When we scale rect we have to give it new cordinates
        resizeRectange.clear()
        resizeRectange.position.copyFrom(start)
        resizeRectange.beginFill("0x" + resizeColor, .5).lineStyle({
            color: "0x" + resizeColor,
            alpha: 0.5,
            width: 1
        }).drawRect(0, 0, size.x, size.y).endFill()
    }

    function moveRect(resizeRectange, dragController) {
        // Move control is on right side
        // and our rect is anchored on the left we subtract width of rect
        let startPosition = new PIXI.Point(dragController.position.x - resizeRectange.width, dragController.position.y);
        let startPositionController = new PIXI.Point(dragController.position.x - 18, dragController.position.y + 23);
        // we just move the start position
        resizeRectange.position.copyFrom(startPosition)
        dragController.position.copyFrom(startPositionController)
    }

    function selectRect(rectangle) {
        instance.publishState("attributeid", rectangle.attributeId);
        instance.triggerEvent("attribute_selected_for_highlight");
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
        startPosition = new PIXI.Point().copyFrom(this.edit.position)
        inputMode = this.mode
        mainContainer.on('pointermove', onDragMoveNew);
    }

    function onDragEndNew() {
        // stop drag, remove parameters
        // return input mode to default
        if (dragController) {
            mainContainer.off('pointermove', onDragMoveNew);
            dragController.alpha = 1;
            currentRectangle = null;
            dragController = null;
        }
        startPosition = null;
        inputMode = InputModeEnum.create;
    }
    ///experimental
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
    
    //instance.data.for drawing in different directions
    function getStartCoordinates(startX, startY, endX, endY) {
        var width, height, startRectX, startRectY;
        startX < endX ? (width = endX - startX) : (width = startX - endX);
        startY < endY ? (height = endY - startY) : (height = startY - endY);
        startX < endX ? (startRectX = startX) : (startRectX = endX);
        startY < endY ? (startRectY = startY) : (startRectY = endY);
        return { startRectX, startRectY, width, height };
    }
    
        function loadDAS(das) {
        das.forEach((das, index) => {
            //var rect = Object.values(das);
            //console.log(rect);
            //will need placeholder for color. may need to generate specific
            let createCoord = getStartCoordinates(das["X Coordinate (960)"], das["Y Coordinate (960)"], das[
                "Box Width 250"] * 3, das["Box Height 250"] * 3);
            logging ? console.log("createCoord", createCoord) : null;
            //stop small box creation - Placeholder
            if (createCoord.width < 20) return;
            if (createCoord.height < 20) return;
            console.log("att", att[0]);
            createExistingRect(createCoord, das.labelColor, das.attributeName, das.attributeId);
            //createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
        });
    }
    
    //end C Declare
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
            //c listeners
            mainContainer.on('pointerdown', (e) => {
                // Initiate rect creation
                console.log(inputMode)
                if (inputMode == InputModeEnum.create) {
                    startPosition = new PIXI.Point().copyFrom(e.global)
                    logging ? console.log("pointerdown", startPosition) : null;
                }
                if (inputMode == InputModeEnum.select) {
                    //PLACEHOLDER for select function
                    selectRect(e.target);
                }
            });
            mainContainer.on('pointermove', (e) => {
                // Do this routine only if in create mode and have started creation
                // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
                if (inputMode == InputModeEnum.create && startPosition) {
                    // get new global position from event
                    let currentPosition = e.global;
                    let {
                        start,
                        size
                    } = getStartAndSize(currentPosition, startPosition, "draw")
                    if (size.x > 5 && size.y > 5) {
                        if (!currentRectangle) {
                            currentRectangle = new PIXI.Graphics().beginFill("0x" + highlightColor, .5)
                                .lineStyle({
                                    color: "0x" + highlightColor,
                                    alpha: 0.5,
                                    width: 1
                                }).drawRect(0, 0, size.x, size.y).endFill()
                            currentRectangle.labelColor = "0x" + highlightColor;
                            currentRectangle.oldColor = highlightColor;
                            currentRectangle.name = "";
                            currentRectangle.position.copyFrom(start)
                            addLabel(currentRectangle);
                            mainContainer.addChild(currentRectangle)
                        } else {
                            scaleRectB(currentRectangle, currentPosition)
                        }
                    } else {
                        if (currentRectangle) {
                            mainContainer.removeChild(currentRectangle);
                            currentRectangle = null
                        }
                    }
                }
            });
            mainContainer.on('pointerup', (e) => {
                // Wrap up rect creation
                startPosition = null
                if (currentRectangle && currentRectangle.interactive == false) {
                    currentRectangle.interactive = true;
                    currentRectangle
                        // Mouse & touch events are normalized into
                        // the pointer* events for handling different
                        // Rectangle events.
                        .on('pointerover', onRectangleOver).on('pointerout', onRectangleOut);
                }
                currentRectangle = null
                onDragEndNew()
            });
            //load our data
            mainContainer.on('pointerupoutside', onDragEndNew);
            mainContainer.interactive = true;
            mainContainer.hitArea = mainContainer.screen;
            loadData ? loadDAS(DAS) : null;
            instance.data.addedScreenshot = true
        });
    }
    
}