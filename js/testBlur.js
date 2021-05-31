var app, clearSprite;

function initialize() {
  app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  mainCanvasDiv = document.getElementById("main-display");
  mainCanvasDiv.appendChild(app.view);
  PIXI.Loader.shared
    .add([
      {
        name: "focus",
        url: "./images/img_midground_good.png",
      },
      {
        name: "grid",
        url: "./images/grid2.jpg",
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
        name: "defaultVert",
        url: "./shaders/defaultVertex.vert",
      },
    ])
    .load(setup);
}

function instantiateSprite(name) {
  return new PIXI.Sprite(PIXI.Loader.shared.resources[name].texture);
}

function restrictSize(sprite) {
  sprite.height = app.screen.height;
  sprite.width = app.screen.width;
}

function setup() {
  clearSprite = instantiateSprite("focus");
  restrictSize(clearSprite);
  app.stage.addChild(clearSprite);
  const vertUniforms = {
    min_sigma: 0.0,
    max_sigma: 2.0,
    pixelSize: 1 / 512,
    kernel: 3.0,
  };
  const horiUniforms = {
    min_sigma: 0.0,
    max_sigma: 2.0,
    pixelSize: 1 / 512,
    kernel: 3.0,
  };

  const vShader = PIXI.Loader.shared.resources["vertBlurRL"].data;
  const hShader = PIXI.Loader.shared.resources["horzBlurRL"].data;
  const vert = PIXI.Loader.shared.resources["defaultVert"].data;
  const vertFilter = new PIXI.Filter(vert, vShader, vertUniforms);
  const horiFilter = new PIXI.Filter(vert, hShader, horiUniforms);
  clearSprite.filters = [horiFilter, vertFilter];
}

window.onload = () => {
  initialize();
};
