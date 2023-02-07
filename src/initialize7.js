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

}