var mainCanvasDiv,
  viewport,
  bgStage,
  focusStage,
  rootStage,
  clearSprite,
  blurSprite,
  focusSprite,
  app,
  displace,
  circle,
  circleTexture,
  maskLens,
  hourglass,
  semicircle,
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
      {
        name: "displace",
        url: "./images/displace.png",
      },
      {
        name: "mask-lens",
        url: "./images/mask-lens3.png",
      },
      {
        name: "hourglass",
        url: "./images/clear-hourglass.png",
      },
      {
        name: "semicircle",
        url: "./images/semicircle.png",
      },
    ])
    .load(setup);
}

function onPointerMove(eventData) {
  ring.visible = true;
  ring.position.set(eventData.data.global.x, eventData.data.global.y);
}

function onMouseMove() {
  ring.visible = true;
  const pt = new PIXI.Point(
    app.renderer.plugins.interaction.mouse.global.x,
    app.renderer.plugins.interaction.mouse.global.y
  );
  const pt2 = viewport.toLocal(pt);
  ring.position.set(pt2.x, pt2.y);
  displace.position.copyFrom(ring);
  circle.position.copyFrom(ring);
  maskLens.position.copyFrom(ring);
  hourglass.position.copyFrom(ring);
  semicircle.position.copyFrom(ring);
  circle.position.copyFrom(ring);
}

function trySnap() {
  ring.visible = true;
  viewport.snap({
    x: app.renderer.plugins.interaction.mouse.global.x,
    y: app.renderer.plugins.interaction.mouse.global.y,
  });
}

function setup() {
  clearSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["focus"].texture);
  focusSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["focus"].texture);
  blurSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["focus"].texture);
  ring = new PIXI.Sprite(PIXI.Loader.shared.resources["ring"].texture);
  displace = new PIXI.Sprite(PIXI.Loader.shared.resources["displace"].texture);
  displacementFilter = new PIXI.filters.DisplacementFilter(displace);
  ring.anchor.set(0.5);
  ring.scale.set(0.8);
  ring.visible = false;
  focusSprite.width = app.screen.width / 2;
  focusSprite.height = app.screen.height / 2;
  clearSprite.width = app.screen.width / 2;
  clearSprite.height = app.screen.height / 2;
  blurSprite.width = app.screen.width / 2;
  blurSprite.height = app.screen.height / 2;
  viewport.addChild(focusSprite);
  viewport.addChild(clearSprite);
  viewport.addChild(blurSprite);

  viewport.addChild(ring);
  viewport.addChild(displace);
  displace.anchor.set(0.5);
  displacementFilter.scale.x = 0;
  displacementFilter.scale.y = 100;
  //viewport.filters = [displacementFilter];
  ring.on("mousemove", onMouseMove);
  viewport.clamp({
    left: 0,
    right: focusSprite.width,
    top: 0,
    bottom: focusSprite.height,
  });
  circle = new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(0, 0, ring.height / 2)
    .endFill();
  maskLens = new PIXI.Sprite(PIXI.Loader.shared.resources["mask-lens"].texture);
  hourglass = new PIXI.Sprite(
    PIXI.Loader.shared.resources["hourglass"].texture
  );
  semicircle = new PIXI.Sprite(
    PIXI.Loader.shared.resources["semicircle"].texture
  );
  hourglass.anchor.set(0.5);
  semicircle.anchor.set(0.5);
  maskLens.anchor.set(0.5);

  clearSprite.mask = circle;
  blurSprite.mask = semicircle;

  viewport.addChild(semicircle);
  viewport.addChild(circle);
  const f = new PIXI.filters.BlurFilter(5, 5);
  const g = new PIXI.filters.BlurFilter(20, 10);
  focusSprite.filters = [f];
  blurSprite.filters = [g];

  viewport
    .on("mousemove", onMouseMove)
    .on("touchmove", onPointerMove)
    .on("mouse-edge-start", onMouseMove)
    .on("mouse-edge-end", onMouseMove);

  viewport.mouseEdges({
    radius: 500,
  });
  viewport.on("click", clickf);
}

function clickf() {}

window.onload = () => {
  initializeMainRenderer();
};
