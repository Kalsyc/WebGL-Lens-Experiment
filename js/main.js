var mainCanvasDiv,
  viewport,
  bgStage,
  focusStage,
  rootStage,
  bgSprite,
  focusSprite,
  app,
  displace,
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
      {
        name: "displace",
        url: "./images/displace.png",
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
}

function trySnap() {
  ring.visible = true;
  viewport.snap({
    x: app.renderer.plugins.interaction.mouse.global.x,
    y: app.renderer.plugins.interaction.mouse.global.y,
  });
}

function setup() {
  bgSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["bg"].texture);
  focusSprite = new PIXI.Sprite(PIXI.Loader.shared.resources["focus"].texture);
  ring = new PIXI.Sprite(PIXI.Loader.shared.resources["ring"].texture);
  displace = new PIXI.Sprite(PIXI.Loader.shared.resources["displace"].texture);
  displacementFilter = new PIXI.filters.DisplacementFilter(displace);
  ring.anchor.set(0.5);
  ring.visible = false;
  bgSprite.width = app.screen.width / 2;
  bgSprite.height = app.screen.height / 2;
  viewport.addChild(bgSprite);
  viewport.addChild(ring);
  viewport.addChild(displace);
  displace.anchor.set(0.5);
  displacementFilter.scale.set(110);
  //viewport.filters = [displacementFilter];
  ring.on("mousemove", onMouseMove);
  viewport.clamp({
    left: 0,
    right: bgSprite.width,
    top: 0,
    bottom: bgSprite.height,
  });

  viewport
    .on("mousemove", onMouseMove)
    .on("touchmove", onPointerMove)
    .on("mouse-edge-start", onMouseMove)
    .on("mouse-edge-end", onMouseMove);

  //viewport.follow(ring);
  viewport.mouseEdges({
    radius: 500,
  });
  //console.log(app.ticker);
  viewport.on("click", clickf);
}

function clickf() {}

window.onload = () => {
  initializeMainRenderer();
};
