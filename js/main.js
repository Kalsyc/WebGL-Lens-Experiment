var mainCanvasDiv,
  viewport,
  bgStage,
  focusStage,
  rootStage,
  bgSprite,
  focusSprite,
  app,
  ring;

function initializeMainRenderer() {
  app = new PIXI.Application();
  mainCanvasDiv = document.getElementById("main-display");
  mainCanvasDiv.appendChild(app.view);
  viewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: window.innerWidth,
    worldHeight: window.innerHeight,
    interaction: app.renderer.plugins.interaction,
  });
  viewport.drag().wheel().pinch().decelerate();
  focusStage = new PIXI.Container();
  bgStage = new PIXI.Container();
  rootStage = new PIXI.Container();
  app.stage.addChild(viewport);
  //viewport.fit();

  PIXI.Loader.shared
    .add([
      {
        name: "bg",
        url: "./images/img_midground_bad.jpg",
      },
      {
        name: "focus",
        url: "./images/img_midground_good.png",
      },
      {
        name: "ring",
        url: "./images/ring.png",
      },
    ])
    .load(setup);
}

function onPointerMove(eventData) {
  ring.visible = true;
  ring.position.set(eventData.data.global.x, eventData.data.global.y);
}

function setup() {
  bgSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture);
  focusSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["focus"].texture);
  ring = new PIXI.Sprite(PIXI.Loader.shared.resources["ring"].texture);
  ring.anchor.set(0.5);
  ring.visible = false;
  viewport.addChild(bgSprite);
  viewport.addChild(ring);
  viewport.on("mousemove", onPointerMove).on("touchmove", onPointerMove);
  //viewport.follow(ring);
  viewport.mouseEdges();
}

window.onload = () => {
  initializeMainRenderer();
};
