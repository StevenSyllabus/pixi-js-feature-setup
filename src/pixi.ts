// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js equivalent of <script></script>
import * as PIXI from "pixi.js";
//simply import the Bubble testing functions from the other file.
import { setState, triggerEvent } from "./bubble";


const canvasElement = <HTMLDivElement>document.getElementById(`app`);
const mainDivContainer = <HTMLDivElement>(
  document.getElementById(`mainContainer`)
);
//csp comment
//csp commit2
let app = new PIXI.Application({
  resizeTo: canvasElement,
});
PIXI.
//this is a test comment
//@ts-ignore
//@ts-ignore
//@ts-ignore any type checking.
canvasElement.appendChild(app.view);

const mainContainer = new PIXI.Container();
app.stage.addChild(mainContainer);

const screenshot = PIXI.Texture.from(
  `https://dd7tel2830j4w.cloudfront.net/d110/f1667856689965x312820165751551200/3b557354f48767d0cc7efb785a512fd02d9d8c1f177e8fb51092dea464924812?ignore_imgix=true`
);
const webpageSprite = PIXI.Sprite.from(screenshot);
webpageSprite.interactive = true;
webpageSprite.addEventListener(`pointerdown`, () => {
  setState(`selectedElement`, "this is the new result");
  triggerEvent(`click`);
});

mainContainer.addChild(webpageSprite);
app.stage.addChild(mainContainer);

console.log(`mainContainer`, mainContainer);
//scroll stuff
mainContainer.scale.set(app.view.width / mainContainer.width);
const maxScroll = mainContainer.height - app.view.height;
// Create the scrollbar graphic
const scrollbar = new PIXI.Graphics();

app.stage.addChild(scrollbar);

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

app.renderer.on(`resize`, () => {
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
});
