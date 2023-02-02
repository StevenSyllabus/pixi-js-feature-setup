function(instance, properties, context) {
    //properties.attributes
    //properties.attributes
    /*
    const keyListDAS = properties.drawn_attribute_snippets.get(0, properties.drawn_attribute_snippets.length())[0];
    const keyListAtt = properties.attributes.get(0, properties.attributes.length())[0];
    console.log("das",keyListDAS.listProperties(),"att",keyListAtt.listProperties());
DAS
 ['account_webpage_custom_account_webpage', 'attribute_custom_attribute', 'box_height_number', 'box_width_number', 'corner_roundness_number', 'mobile_screenshot_custom_webpage_screenshot', 'offset_of_top__y__number', 'shape_id_text', 'shape_text', 'stroke_width_number', 'syllabus_box_side_number', 'syllabus_box_width_number', 'webpage_screenshot_custom_webpage_screenshot', 'x_coordinate__250__number', 'x_coordinate__960__number', 'x_coordinate_number', 'y_coordinate__250__number', 'y_coordinate__960__number', 'y_coordinate_number', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id']
ATT
['account_custom_zaccount', 'average_distance_from_top_number', 'color_option_attribute_colors', 'description_text', 'last_used_date', 'name_search_text', 'name_text', 'related_webpages_list_custom_account_webpage', 'volume_number', 'Created By', 'Slug', 'Created Date', 'Modified Date', '_id']
    */
    const keyListDAS = properties.drawn_attribute_snippets.get(0, properties.drawn_attribute_snippets.length())[0]
        .listProperties();
    const keyListAtt = properties.attributes.get(0, properties.attributes.length())[0].listProperties();
    console.log(keyListAtt, keyListDAS)
    var labelsOrigin = properties.attributes.get(0, properties.attributes.length());
    var labels = labelsOrigin;
    //create a Json representation of your data input
    /*
    const labels = labelsOrigin.map(x => {
    let obj = {}
    keyListAtt.forEach(y => {
        Object.assign(obj, {
            y: x.get(y)
        })
    })
    return obj
    })
    */
    if (properties.attribute_colors) {
        var labelColors = properties.attribute_colors.get(0, properties.attribute_colors.length());
    }
    instance.data.webpageScreenshot = properties.webpage_screenshot;
    instance.data.labelFont = properties.font;
    instance.data.labelFontSize = properties.font_size;
    instance.data.labelFontColor = properties.labelFontColor.slice(1);
    instance.data.dasOrigin = properties.drawn_attribute_snippets.get(0, properties.drawn_attribute_snippets.length());
    var DAS = instance.data.dasOrigin;

    /*
    var DAS = dasOrigin.map(x => {
        let obj = {}
        keyListDAS.forEach(y => {
            Object.assign(obj, {
                y: x.get(y)
            })
        })
        return obj
    })
    */
    DAS.forEach((das, index) => {
        if (labels[index] && labelColors[index]) {
            das.attributeName = labels[index].get('name_text');
            das.attributeId = labels[index].get('_id');
            das.labelColor = labelColors[index].slice(1);
        }
    });


    console.log("dasONLoad", DAS[0]);
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


        instance.data.app.renderer.on(`resize`, function (event) {
            instance.data.handleResize(event, instance.data.app, instance.data.mainContainer, instance.data.webpageSprite, instance.data
                .intialWebpageWidth);
            instance.data.updateScrollBarPosition(instance.data.mainContainer, instance.data.app, instance.data.scrollBar);
        });
        instance.data.mainContainer = new PIXI.Container();
        mainContainer.interactive = false;
        mainContainer.name = "mainContainer";
        instance.data.mainContainer = mainContainer;
        canvasElement = mainContainer;
        instance.data.app.stage.addChild(mainContainer);
        ele.appendChild(instance.data.app.view);
        ////////////// NOTE TO STEVEN: added this below as it needed to be defined, apparently
        ele.setAttribute("pressed", false);
        instance.data.ele = ele;
    } else {
        canvasElement = mainContainer;

    }
    if (instance.data.addedScreenshot === false && properties.webpage_screenshot) {
        console.log(`the properties screenshot is`, properties.webpage_screenshot)
        screenshot = PIXI.Texture.fromURL(
            `${imgixBaseURL}/${properties.webpage_screenshot}?w=${1000}`
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
            webpageSprite.scale.set(instance.data.app.view.width / webpageSprite.width);
            intialCanvasWidth = instance.data.app.view.width;
            intialCanvasHeight = instance.data.app.view.height;
            intialScale = intialCanvasWidth / instance.data.intialWebpageWidth;
            webpageSprite.intialScale = instance.data.app.view.width / webpageSprite.width;
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
                        if (!instance.data.currentRectangle) {
                            instance.data.currentRectangle = new PIXI.Graphics().beginFill("0x" + instance.data.highlightColor, .5)
                                .lineStyle({
                                    color: "0x" + instance.data.highlightColor,
                                    alpha: 0.5,
                                    width: 1
                                }).drawRect(0, 0, size.x, size.y).endFill()
                            instance.data.currentRectangle.labelColor = "0x" + instance.data.highlightColor;
                            instance.data.currentRectangle.oldColor = instance.data.highlightColor;
                            instance.data.currentRectangle.name = "";
                            instance.data.currentRectangle.intialScale = instance.data.app.view.width / instance.data.intialWebpageWidth;

                            instance.data.currentRectangle.position.copyFrom(start)
                            instance.data.addLabel(instance.data.currentRectangle);
                            mainContainer.addChild(instance.data.currentRectangle)
                        } else {
                            instance.data.scaleRectB(instance.data.currentRectangle, currentPosition)
                        }
                    } else {
                        if (instance.data.currentRectangle) {
                            mainContainer.removeChild(instance.data.currentRectangle);
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
                        .on('pointerover', instance.data.onRectangleOver).on('pointerout', instance.data.onRectangleOut);

                    instance.data.currentRectangle.initialScale = instance.data.app.view.width / instance.data.intialWebpageWidth;

                    console.log(`the current rect`, instance.data.currentRectangle)

                    let rectData = [
                        instance.data.currentRectangle.x.toString(),
                        instance.data.currentRectangle.y.toString(),
                        instance.data.currentRectangle.width.toString(),
                        instance.data.currentRectangle.height.toString(),
                        instance.data.currentRectangle.name,
                        instance.data.currentRectangle.labelColor.toString(),
                        instance.data.currentRectangle.oldColor.toString(),
                        instance.data.currentRectangle.initialScale.toString()
                    ]
                    console.log(`the rect data`, rectData)
                    instance.publishState(`recently_created_drawing_data`, rectData)
                    setTimeout(() => {
                        instance.triggerEvent(`drawn_label_created`)

                    }, 200)

                }
                instance.data.currentRectangle = null
                instance.data.onDragEndNew()
            });
            //load our data
            mainContainer.on('pointerupoutside', instance.data.onDragEndNew);
            mainContainer.interactive = true;
            mainContainer.hitArea = mainContainer.screen;
            instance.data.loadData ? instance.data.loadDAS(DAS) : null;
            instance.data.scrollBar = instance.data.createScrollBar(instance.data.mainContainer, instance.data.app, instance.data.ele);

            instance.data.addedScreenshot = true
        });
    }
}