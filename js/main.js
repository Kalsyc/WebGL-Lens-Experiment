/**
 * Main script for WebGL (PixiJS) and Distortion/Blur Effect on Lenses (with Mouse/Touch input)
 */
var mainCanvasDiv,
  viewport,
  clearSprite, //Middle layer containing the clear background sprite
  blurSprite, //Top layer containing the blurred and distorted background sprite
  bgSprite, //Bottom layer containing the external blurred background sprite
  app,
  displace,
  circle,
  semicircle,
  ring;

/**
 * Initialize the main renderer with PixiJS and Pixi-Viewport plugin
 */
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
  viewport.wheel().pinch().decelerate(); //Attach wheel/pinch/decelerate functionalities (Can be removed);
  app.stage.addChild(viewport);

  //Load images
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

/**
 * Callback function to follow the ring around the user's touch
 */
function onMouseMove() {
  const pt = viewport.toLocal(
    app.renderer.plugins.interaction.eventData.data.global
  );
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

/**
 * Instantiate sprite
 * @param {string} name name of the image resource in PIXI.Loader
 * @returns PIXI.Sprite object of image
 */
function instantiateSprite(name) {
  return new PIXI.Sprite(PIXI.Loader.shared.resources[name].texture);
}

/**
 * Setup Ring around the user's touch
 */
function setupRing(scaleFactor = 0.8) {
  ring = instantiateSprite("ring");
  ring.anchor.set(0.5);
  ring.scale.set(scaleFactor);
  viewport.addChild(ring);
  ring.visible = false;
}

/**
 * Setup Displacement map Filter
 * @param {number} scaleX X-axis scale factor
 * @param {number} scaleY Y-axis scale factor
 */
function setupDisplacement(scaleX = 70, scaleY = 0) {
  displace = instantiateSprite("displace");
  viewport.addChild(displace);
  displacementFilter = new PIXI.filters.DisplacementFilter(displace);
  displace.anchor.set(0.5);
  displacementFilter.scale.x = scaleX;
  displacementFilter.scale.y = scaleY;
  viewport.filters = [displacementFilter];
}

/**
 * Setup Lens blur layer
 */
function setupLensBlur() {
  semicircle = instantiateSprite("lenses-all");
  semicircle.anchor.set(0.5);
  viewport.addChild(semicircle);
  blurSprite.mask = semicircle;
}

/**
 * Setup Lens clear layer
 */
function setupLensClear() {
  circle = setupCircleMaskGraphics(ring ? ring.height / 2 : 60);
  clearSprite.mask = circle;
  viewport.addChild(circle);
}

/**
 * Clamp/Restrict size to app screen width/height
 * @param {PIXI.Sprite} sprite Sprite to be clamped on size
 */
function restrictSize(sprite) {
  sprite.height = app.screen.height / 2;
  sprite.width = app.screen.width / 2;
}

/**
 * Setup blur filter
 * @param {PIXI.Sprite} sprite PIXI.Sprite to be applied
 * @param {number} strength Strength of blur filter
 * @param {number} quality Quality/No. of passes of blur filter
 */
function setupBlurFiter(sprite, strength, quality) {
  sprite.filters = [new PIXI.filters.BlurFilter(strength, quality)];
}

/**
 * Returns Circle Graphics for Masking
 * @param {number} radius Radius of circle graphic
 * @returns PIXI.Graphics object
 */
function setupCircleMaskGraphics(radius = 60) {
  return new PIXI.Graphics()
    .beginFill(0xff0000)
    .drawCircle(0, 0, radius)
    .endFill();
}

/**
 * Setup function
 */
function setup() {
  clearSprite = instantiateSprite("focus");
  bgSprite = instantiateSprite("focus");
  blurSprite = instantiateSprite("focus");

  restrictSize(bgSprite);
  restrictSize(clearSprite);
  restrictSize(blurSprite);

  viewport.addChild(bgSprite);
  viewport.addChild(clearSprite);
  viewport.addChild(blurSprite);

  setupRing();
  setupDisplacement(190, 190);

  setupLensBlur();
  setupLensClear();

  setupBlurFiter(bgSprite, 20, 2);
  setupBlurFiter(blurSprite, 30, 10);

  //Configure viewport

  viewport.zoomPercent(2); //Zoom 200%

  viewport.clamp({
    left: 0,
    right: bgSprite.width,
    top: 0,
    bottom: bgSprite.height,
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
