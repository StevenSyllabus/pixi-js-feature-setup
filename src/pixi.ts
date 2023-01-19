// this is the same as importing/adding a script https://pixijs.download/v7.1.0/pixi.js
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

///START CHRIS FUNCTIONS
//var DAS = properties.das;
var DAS = new Array ({
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
  "Attribute": "1673375655977x752951405907542000",
  "Account Webpage": "1648649408910x887794807113668500",
  "Stroke Width": 2,
  "Shape": "Rectangle",
  "X Coordinate (250)": 96,
  "X Coordinate (960)": 370,
  "Y Coordinate (250)": 197,
  "Y Coordinate (960)": 758,
  "_id": "1674151425031x842236848750460900"
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
  "Attribute": "1668510026384x892836158180425700",
  "Account Webpage": "1648649408910x887794807113668500",
  "Stroke Width": 2,
  "Shape": "Rectangle",
  "X Coordinate (250)": 47,
  "X Coordinate (960)": 182,
  "Y Coordinate (250)": 114,
  "Y Coordinate (960)": 437,
  "_id": "1674151403457x266515680396836860"
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
  "Attribute": "1668800394117x917004865047887900",
  "Account Webpage": "1667262889527x858621114244434700",
  "Stroke Width": 2,
  "Shape": "Rectangle",
  "X Coordinate (250)": 10,
  "X Coordinate (960)": 40,
  "Y Coordinate (250)": 25,
  "Y Coordinate (960)": 97,
  "_id": "1674062600971x785814322671779800"
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
  "Attribute": "1668800394117x917004865047887900",
  "Account Webpage": "1672867250672x906510004638974000",
  "Stroke Width": 2,
  "Shape": "Rectangle",
  "X Coordinate (250)": 14,
  "X Coordinate (960)": 57,
  "Y Coordinate (250)": 31,
  "Y Coordinate (960)": 122,
  "_id": "1674059222456x786064976190898200"
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
  "Attribute": "1668800394117x917004865047887900",
  "Account Webpage": "1672867250672x906510004638974000",
  "Stroke Width": 2,
  "Shape": "Rectangle",
  "X Coordinate (250)": 5,
  "X Coordinate (960)": 21,
  "Y Coordinate (250)": 8,
  "Y Coordinate (960)": 32,
  "_id": "1674046114484x384901095148486660"
});
//var att = properties.att
var att = new Array ({ "Latest Volume": 346, "Related Webpages": [ "1648649408910x887794807113668500" ], "Created Date": 1673375665144, "Name": "CTA", "Account": "1648562004649x223328173625704450", "Modified Date": 1674151427900, "Created By": "1648561974656x439262183960839300", "Average Distance from top": 236, "Color": "4", "Name Search": "cta", "Last Used": 1674151426414, "_id": "1673375655977x752951405907542000" }, { "Latest Volume": 358, "Related Webpages": [ "1648649408910x887794807113668500", "1648649415130x341237624746570240" ], "Created Date": 1668510027553, "Name": "Attribute 3", "Account": "1648562004649x223328173625704450", "Modified Date": 1674151407928, "Created By": "1648561974656x439262183960839300", "Average Distance from top": 138, "Color": "#ff00ff", "Name Search": "attribute 3", "Last Used": 1674151406474, "_id": "1668510026384x892836158180425700" }, { "Latest Volume": 15442, "Related Webpages": [ "1664221313711x475501364962342100", "1664223419885x108644029860312400", "1664221316045x125346515221780750", "1664221313698x632940115935128000", "1672867250672x906510004638974000", "1667262889527x858621114244434700" ], "Created Date": 1668800409315, "Name": "MY attribute", "Account": "1664221229355x903532045837271000", "Modified Date": 1674147291058, "Created By": "1664221186966x204293830276146340", "Average Distance from top": 269, "Color": "#38761d", "Name Search": "my attribute", "Last Used": 1674147290378, "_id": "1668800394117x917004865047887900" }, { "Latest Volume": 15442, "Related Webpages": [ "1664221313711x475501364962342100", "1664223419885x108644029860312400", "1664221316045x125346515221780750", "1664221313698x632940115935128000", "1672867250672x906510004638974000", "1667262889527x858621114244434700" ], "Created Date": 1668800409315, "Name": "MY attribute", "Account": "1664221229355x903532045837271000", "Modified Date": 1674147291058, "Created By": "1664221186966x204293830276146340", "Average Distance from top": 269, "Color": "#38761d", "Name Search": "my attribute", "Last Used": 1674147290378, "_id": "1668800394117x917004865047887900" }, { "Latest Volume": 15442, "Related Webpages": [ "1664221313711x475501364962342100", "1664223419885x108644029860312400", "1664221316045x125346515221780750", "1664221313698x632940115935128000", "1672867250672x906510004638974000", "1667262889527x858621114244434700" ], "Created Date": 1668800409315, "Name": "MY attribute", "Account": "1664221229355x903532045837271000", "Modified Date": 1674147291058, "Created By": "1664221186966x204293830276146340", "Average Distance from top": 269, "Color": "#38761d", "Name Search": "my attribute", "Last Used": 1674147290378, "_id": "1668800394117x917004865047887900" });
//var colors = properties.colors;
var colors = new Array ("57d9a3", "ff00ff", "38761d", "38761d", "38761d");

//loads & reformats Drawn Attribute Snippets
function loadDAS(das) {
  das.forEach((das, index) => {
    //var rect = Object.values(das);
    //console.log(rect);
//will need placeholder for color. may need to generate specific 
createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], colors[index], das['_id']);
}) 
}

//creates rectangles based on data
function createRect(x, y, w, h, c, id) {
  // Create a new rectangle graphic using the calculated dimensions
  const graphics = new PIXI.Graphics();
  graphics.beginFill(c);
  graphics.drawRect(x, y, w, h); 
  graphics.endFill();
  graphics.interactive = true;
  graphics.on('pointerdown', (event) => { onClick(id);console.log(id); });
  app.stage.addChild(graphics);

}
function onClick(id) { 

  // Clear the stage
  app.stage.removeChildren();

  // Add the image back to the stage
  //app.stage.addChild(bunny);
  if (id > 2) {
rects.forEach((rect, index) => {
createRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
})
  } else if (id = 1)  {das.forEach((das, index) => {
      //console.log(Object.keys(das));
      var rect = Object.values(das);
      console.log(rect);
createRect(das['X Coordinate (500)'], das['Y Coordinate (500)'], das['Box Width 250'], das['Box Height 250'], "0xDE3249", 5);
}) }
  else {
          rects2.forEach((rect, index) => {
createRect(rect[0], rect[1], rect[2], rect[3], rect[4], rect[5]);
})
  }
}
//loadDAS(DAS);