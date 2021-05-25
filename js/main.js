var mainCanvasDiv,
  viewport,
  clearSprite,
  blurSprite,
  focusSprite,
  app,
  displace,
  circle,
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
  app.stage.addChild(viewport);

  PIXI.Loader.shared
    .add([
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
        name: "lenses",
        url: "./images/semicircle.png",
      },
      {
        name: "lenses-all",
        url: "./images/semicircle-all.png",
      },
    ])
    .load(setup);
}

function onMouseMove() {
  const pt = viewport.toLocal(app.renderer.plugins.interaction.mouse.global);
  circle.position.set(pt.x, pt.y);
  semicircle.position.copyFrom(circle);
  if (ring) {
    ring.visible = true;
    ring.position.copyFrom(circle);
  }
  if (displace) {
    displace.position.copyFrom(circle);
  }
}

function instantiateSprite(name) {
  return new PIXI.Sprite(PIXI.Loader.shared.resources[name].texture);
}

function setupSprites() {
  clearSprite = instantiateSprite("focus");
  focusSprite = instantiateSprite("focus");
  blurSprite = instantiateSprite("focus");
}

function setupRing() {
  ring = instantiateSprite("ring");
  ring.anchor.set(0.5);
  ring.scale.set(0.8);
  viewport.addChild(ring);
  ring.visible = false;
}

function setupDisplacement(scaleX = 70, scaleY = 0) {
  displace = instantiateSprite("displace");
  viewport.addChild(displace);
  displacementFilter = new PIXI.filters.DisplacementFilter(displace);
  displace.anchor.set(0.5);
  displacementFilter.scale.x = scaleX;
  displacementFilter.scale.y = scaleY;
  viewport.filters = [displacementFilter];
}

function setupLensBlur() {
  semicircle = instantiateSprite("lenses-all");
  semicircle.anchor.set(0.5);
  viewport.addChild(semicircle);
  blurSprite.mask = semicircle;
}

function setupLensClear() {
  circle = setupCircleMaskGraphics(ring ? ring.height / 2 : 60);
  clearSprite.mask = circle;
  viewport.addChild(circle);
}

function restrictSize(sprite) {
  sprite.height = app.screen.height / 2;
  sprite.width = app.screen.width / 2;
}

function setupBlurFiter(sprite, strength, quality) {
  sprite.filters = [new PIXI.filters.BlurFilter(strength, quality)];
}

function setupCircleMaskGraphics(radius = 60) {
  return new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(0, 0, radius)
    .endFill();
}

function setup() {
  setupSprites();

  restrictSize(focusSprite);
  restrictSize(clearSprite);
  restrictSize(blurSprite);

  viewport.addChild(focusSprite);
  viewport.addChild(clearSprite);
  viewport.addChild(blurSprite);

  setupRing();
  setupDisplacement();

  setupLensBlur();
  setupLensClear();

  setupBlurFiter(focusSprite, 20, 2);
  setupBlurFiter(blurSprite, 30, 10);

  //Configure viewport

  viewport.zoomPercent(2);

  viewport.clamp({
    left: 0,
    right: focusSprite.width,
    top: 0,
    bottom: focusSprite.height,
  });

  viewport
    .on("mousemove", onMouseMove)
    .on("touchmove", onMouseMove)
    .on("mouse-edge-start", onMouseMove)
    .on("mouse-edge-end", onMouseMove);

  viewport.mouseEdges({
    radius: 500,
  });
}

window.onload = () => {
  initializeMainRenderer();
};
