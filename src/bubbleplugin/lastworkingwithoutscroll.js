function(instance, properties, context) {
    //properties.attributes

    if (properties.attributes) { var labelNames = properties.attributes.get(0, properties.attributes.length()); }
    if (properties.attribute_colors) { var labelColors = properties.attribute_colors.get(0, properties.attribute_colors.length()); }
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
    const mainContainer = instance.data.mainContainer



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
        app.renderer.on(`resize`, function (event) {
            instance.data.handleResize(event, app, mainContainer, webpageSprite, instance.data
                .intialWebpageWidth);
            instance.data.updateScrollBarPosition(mainContainer, app, scrollBar);
        });
        instance.data.mainContainer = new PIXI.Container();
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
                console.log(instance.data.inputMode)
                if (instance.data.inputMode == instance.data.InputModeEnum.create) {
                    instance.data.startPosition = new PIXI.Point().copyFrom(e.global)
                    instance.data.logging ? console.log("pointerdown", instance.data.startPosition) : null;
                }
                if (instance.data.inputMode == instance.data.InputModeEnum.select) {
                    //PLACEHOLDER for select function
                    instance.data.selectRect(e.target);
                }
            });
            mainContainer.on('pointermove', (e) => {
                // Do this routine only if in create mode and have started creation
                // this event triggers all the time but we stop it by not providing start postition when cursor not pressed
                if (instance.data.inputMode == instance.data.InputModeEnum.create && instance.data.startPosition) {
                    // get new global position from event
                    let currentPosition = e.global;
                    let {
                        start,
                        size
                    } = instance.data.getStartAndSize(currentPosition, instance.data.startPosition, "draw")
                    if (size.x > 5 && size.y > 5) {
                        if (!currentRectangle) {
                            currentRectangle = new PIXI.Graphics().beginFill("0x" + instance.data.highlightColor, .5)
                                .lineStyle({
                                    color: "0x" + instance.data.highlightColor,
                                    alpha: 0.5,
                                    width: 1
                                }).drawRect(0, 0, size.x, size.y).endFill()
                            currentRectangle.labelColor = "0x" + instance.data.highlightColor;
                            currentRectangle.oldColor = instance.data.highlightColor;
                            currentRectangle.name = "";
                            currentRectangle.position.copyFrom(start)
                            instance.data.addLabel(currentRectangle);
                            mainContainer.addChild(currentRectangle)
                        } else {
                            instance.data.scaleRectB(currentRectangle, currentPosition)
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
                instance.data.startPosition = null
                if (currentRectangle && currentRectangle.interactive == false) {
                    currentRectangle.interactive = true;
                    currentRectangle
                        // Mouse & touch events are normalized into
                        // the pointer* events for handling different
                        // Rectangle events.
                        .on('pointerover', instance.data.onRectangleOver).on('pointerout', instance.data.onRectangleOut);
                }
                currentRectangle = null
                instance.data.onDragEndNew()
            });
            //load our data
            mainContainer.on('pointerupoutside', instance.data.onDragEndNew);
            mainContainer.interactive = true;
            mainContainer.hitArea = mainContainer.screen;
            instance.data.loadData ? instance.data.loadDAS(DAS) : null;
            instance.data.addedScreenshot = true
        });
    }
}