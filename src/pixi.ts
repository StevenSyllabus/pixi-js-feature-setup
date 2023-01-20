//@ts-nocheck
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
import * as PIXI from "pixi.js";
console.log(PIXI);

//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";

//--begin html container setup, and pixi core element setup
const canvasElement = <HTMLDivElement>document.getElementById(`app`);
const mainDivContainer = <HTMLDivElement>(
  document.getElementById(`mainContainer`)
);
//--end html container setup, and pixi core element setup

//intialize pixi
let app = new PIXI.Application({
  resizeTo: canvasElement,
});
canvasElement.appendChild(app.view);

//create a container for the webpage and add it to the stage
const mainContainer = new PIXI.Container();
app.stage.addChild(mainContainer);

//create a sprite for the webpage and add it to the container
const screenshot = PIXI.Texture.from(
  `https://s3.amazonaws.com/appforest_uf/d110/f1670453940647x598239596018917500/0d8918841cc9b704bfe558554a58858a73379813e9a4d7ba0caaceae3dfc27a2`
);
const webpageSprite = PIXI.Sprite.from(screenshot);
webpageSprite.interactive = true;

mainContainer.addChild(webpageSprite);
//scale the container to the width of the canvas. This scales everything inside
mainContainer.scale.set(app.view.width / mainContainer.width);
app.stage.addChild(mainContainer);
//end of screenshot setup

//**begin creating the scrollbar */

app.renderer.on(`resize`, handleResize);
function handleResize(e) {
  console.log(`resize`);
  const scrollPercent = -mainContainer.position.y / maxScroll;
  const scrollbarHeight =
    app.view.height * (app.view.height / mainContainer.height);
  const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
  scrollbar.clear();
  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(app.view.width - 8, scrollbarY, 14, scrollbarHeight);
  scrollbar.endFill();
  if (app.view.width !== mainContainer.width) {
    mainContainer.scale.set(app.view.width / mainContainer.width);
  }
}

function createScrollBar(mainContainer) {
  const maxScroll = mainContainer.height - app.view.height;
  const scrollbar = new PIXI.Graphics();
  scrollbar.interactive = true;
  scrollbar.height = app.view.height;
  scrollbar.beginFill(0x808080);
  scrollbar.drawRect(
    app.view.width - 8,
    0,
    14,
    app.view.height * (app.view.height / mainContainer.height)
  );

  scrollbar.endFill();

  scrollbar.addEventListener("pointerdown", (e) => {
    const scrollPercent = -mainContainer.position.y / maxScroll;
    const scrollbarHeight =
      app.view.height * (app.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
    mainDivContainer.pressed = true;
    scrollbar.lastY = e.data.global.y;
    scrollbar.lastMouseY = e.client.y;
    console.log(e.client.y);

    scrollbar.lastTop = scrollbarY;
  });

  scrollbar.addEventListener("pointerup", (e) => {
    console.log(`scrollbar pointerup`);
    mainDivContainer.pressed = false;
    console.log(mainDivContainer.pressed);
  });

  scrollbar.addEventListener("pointerupoutside", (e) => {
    console.log(`scrollbar pointerupoutside`);
    mainDivContainer.pressed = false;
    console.log(mainDivContainer.pressed);
  });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (mainDivContainer.pressed) {
        const scrollPercent = -mainContainer.position.y / maxScroll;
        console.log(`scrollPercent: ${scrollPercent}`);

        const scrollbarHeight =
          app.view.height * (app.view.height / mainContainer.height);
        const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
        //this mousedif is way wrong. It should be the difference between the mouse's y position and the scrollbar's y position

        const mouseDif = e.y - scrollbar.lastMouseY;
        console.log(mouseDif);

        const newTop = mouseDif + scrollbar.lastTop;
        const scrollPercent2 = newTop / (app.view.height - scrollbarHeight);
        const newScroll = Math.max(-scrollPercent2 * maxScroll);

        if (scrollPercent2 > 0 && scrollPercent2 < 1) {
          mainContainer.position.y = newScroll;
          scrollbar.clear();
          scrollbar.beginFill(0x808080);
          scrollbar.drawRect(app.view.width - 8, newTop, 14, scrollbarHeight);
          scrollbar.endFill();
        }
      }
    },
    { passive: true }
  );

  app.stage.addChild(scrollbar);

  //update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container
  canvasElement.addEventListener("wheel", scrollCanvas, { passive: true });
  //*end of scrollbar setup */

  //resize the container and scrollbar when the window is resized

  function scrollCanvas(event) {
    // Update the container's y position based on the mouse wheel delta
    mainContainer.position.y += event.deltaY;

    // Clamp the container's position so that it can't scroll past the max scroll value
    mainContainer.position.y = Math.max(mainContainer.position.y, -maxScroll);
    mainContainer.position.y = Math.min(mainContainer.position.y, 0);

    // Update the scrollbar position and size based on the container's scroll position
    const scrollPercent = -mainContainer.position.y / maxScroll;
    const scrollbarHeight =
      app.view.height * (app.view.height / mainContainer.height);
    const scrollbarY = scrollPercent * (app.view.height - scrollbarHeight);
    scrollbar.clear();
    scrollbar.beginFill(0x808080);
    scrollbar.drawRect(app.view.width - 8, scrollbarY, 14, scrollbarHeight);
    scrollbar.endFill();
  }
}
createScrollBar(mainContainer);
