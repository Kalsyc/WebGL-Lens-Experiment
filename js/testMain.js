/**
 * Declarations
 */

var mainCanvasDiv,
  zoomCanvasDiv,
  mainViewport,
  zoomViewport,
  mainBgSprite,
  zoomBgSprite,
  app,
  zoomApp;

function initialize() {
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight / 2,
  });
  zoomApp = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight / 2,
  });
  zoomCanvasDiv = document.getElementById("zoom-display");
  zoomCanvasDiv.appendChild(app.view);
  mainCanvasDiv = document.getElementById("main-display");
  mainCanvasDiv.appendChild(zoomApp.view);
  setupViewport();
  loadImages();
}

function setupViewport() {
  mainViewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight / 2,
    worldWidth: window.outerWidth,
    worldHeight: window.outerHeight / 2,
    interaction: app.renderer.plugins.interaction,
  });
  zoomViewport = new pixi_viewport.Viewport({
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight / 2,
    worldWidth: window.outerWidth,
    worldHeight: window.outerHeight / 2,
    interaction: app.renderer.plugins.interaction,
  });
  app.stage.addChild(mainViewport);
  zoomApp.stage.addChild(zoomViewport);
}

function instantiateSprite(name) {
  return new PIXI.Sprite(PIXI.Loader.shared.resources[name].texture);
}

function loadImages() {
  PIXI.Loader.shared
    .add([
      {
        name: "bgImg",
        url: "./images/img_midground_good.png",
      },
      {
        name: "displace",
        url: "./images/displace.png",
      },
      {
        name: "horzBlurLR",
        url: "./shaders/horzBlurLR.frag",
      },
      {
        name: "horzBlurRL",
        url: "./shaders/horzBlurRL.frag",
      },
      {
        name: "vertBlurLR",
        url: "./shaders/vertBlurLR.frag",
      },
      {
        name: "vertBlurRL",
        url: "./shaders/vertBlurRL.frag",
      },
      {
        name: "lenses",
        url: "./images/semicircle-all.png",
      },
    ])
    .load(setup);
}

function setup() {
  mainBgSprite = instantiateSprite("bgImg");
  zoomBgSprite = instantiateSprite("bgImg");
  mainBgSprite.height = app.screen.height;
  mainBgSprite.width = app.screen.width;
  zoomBgSprite.height = app.screen.height;
  zoomBgSprite.width = app.screen.width;

  mainViewport.addChild(mainBgSprite);
  zoomViewport.addChild(zoomBgSprite);
}

window.onload = () => {
  initialize();
};
