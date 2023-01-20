//@ts-nocheck this turns off typesccript checks for the entire file
// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script src =""></script>
import * as PIXI from "pixi.js";
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
  `https://dd7tel2830j4w.cloudfront.net/d110/f1667856689965x312820165751551200/3b557354f48767d0cc7efb785a512fd02d9d8c1f177e8fb51092dea464924812?ignore_imgix=true`
);
const webpageSprite = PIXI.Sprite.from(screenshot);
webpageSprite.interactive = true;

mainContainer.addChild(webpageSprite);
//scale the container to the width of the canvas. This scales everything inside
mainContainer.scale.set(app.view.width / mainContainer.width);
app.stage.addChild(mainContainer);
//end of screenshot setup

//**begin creating the scrollbar
const maxScroll = mainContainer.height - app.view.height;
const scrollbar = new PIXI.Graphics();
app.stage.addChild(scrollbar);
//update the scrollbar position and size based on the container's scroll position. This is done on load and on resize using an event listener on the container
canvasElement.addEventListener("wheel", (event) => {
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
});
//*end of scrollbar setup */

//resize the container and scrollbar when the window is resized
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
