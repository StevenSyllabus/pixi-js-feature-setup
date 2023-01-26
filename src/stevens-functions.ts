import * as PIXI from "pixi.js";

function createScrollBar(
  mainContainer: PIXI.Container,
  pixiApp: PIXI.Application,
  div: HTMLDivElement
) {
  const maxScroll = mainContainer.height - pixiApp.view.height;
  const scrollBarWidth = 14;
  const scrollbar = new PIXI.Graphics();

  let scrollingTimeout: number;
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
    const scrollPercent = -mainContainer.position.y / maxScroll;
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
        const scrollPercent = -mainContainer.position.y / maxScroll;
        console.log(`scrollPercent: ${scrollPercent}`);

        const scrollbarHeight =
          pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
        const scrollbarY =
          scrollPercent * (pixiApp.view.height - scrollbarHeight);
        //this mousedif is way wrong. It should be the difference between the mouse's y position and the scrollbar's y position

        const mouseDif = e.y - scrollbar.lastMouseY;
        console.log(mouseDif);

        const newTop = mouseDif + scrollbar.lastTop;
        const scrollPercent2 = newTop / (pixiApp.view.height - scrollbarHeight);
        const newScroll = Math.min(-scrollPercent2 * maxScroll, 0);

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
      mainContainer.position.y = Math.max(mainContainer.position.y, -maxScroll);
      mainContainer.position.y = Math.min(mainContainer.position.y, 0);
    }

    // Update the scrollbar position and size based on the container's scroll position
    const scrollPercent = -mainContainer.position.y / maxScroll;
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
function updateScrollBarPosition(
  mainContainer: PIXI.Container,
  pixiApp: PIXI.Application,
  scrollbar: PIXI.Graphics
) {
  const maxScroll = mainContainer.height - pixiApp.view.height;

  const scrollPercent = -mainContainer.position.y / maxScroll;
  const scrollbarHeight =
    pixiApp.view.height * (pixiApp.view.height / mainContainer.height);
  const scrollbarY = scrollPercent * (pixiApp.view.height - scrollbarHeight);
  scrollbar.clear();
  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(pixiApp.view.width - 14, scrollbarY, 14, scrollbarHeight);
  scrollbar.endFill();
  //clamp the container's position so that it can't scroll past the max scroll value

  mainContainer.position.y = Math.min(mainContainer.position.y, 0);
}

function handleResize(
  event: Event,
  pixiApp: PIXI.Application,
  mainContainer: PIXI.Container,
  webpageSprite: PIXI.Sprite,
  intialWebpageWidth: number
) {
  console.log(`resize`);
let scaleIt = pixiApp.view.width / intialWebpageWidth;
  webpageSprite.scale.set(pixiApp.view.width / intialWebpageWidth);
  mainContainer.children.forEach((child) => {
    child.scale.set(pixiApp.view.width / intialWebpageWidth);
    child.widthNow = child.intialWidth * scaleIt;
    console.log(`child.intialWidth: ${child.intialWidth}`, "pixiAppWidth",pixiApp.view.width, "initialWP WIdth",
    intialWebpageWidth, "scale", scaleIt, "child",child);
  });
  //optional timeout to prevent the resize from firing too many times
  //   clearTimeout(resizeTimeout);

  //   resizeTimeout = setTimeout(() => {
  //     console.log(`resize timeout`);
  //     console.log(pixiApp.view.width / webpageSprite.intialWidth);
  //   }, 100);
}
export { createScrollBar, updateScrollBarPosition, handleResize };
