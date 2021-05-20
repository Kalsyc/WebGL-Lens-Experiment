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
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  mainCanvasDiv = document.getElementById("main-display");
  mainCanvasDiv.appendChild(app.view);
  viewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    worldWidth: 500,
    worldHeight: 500,
    interaction: app.renderer.plugins.interaction,
  });
  viewport.wheel().pinch().decelerate();
  focusStage = new PIXI.Container();
  bgStage = new PIXI.Container();
  rootStage = new PIXI.Container();
  app.stage.addChild(viewport);
  viewport.fit();

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
  bgSprite.width = app.screen.width / 2;
  bgSprite.height = app.screen.height / 2;
  viewport.addChild(bgSprite);
  viewport.addChild(ring);
  viewport.on("mousemove", onPointerMove).on("touchmove", onPointerMove);
  //viewport.follow(ring);
  viewport.mouseEdges({
    radius: 400,
  });
}

window.onload = () => {
  initializeMainRenderer();
};
