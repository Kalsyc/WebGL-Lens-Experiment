//import fragShader from "./../shaders/fragShader";
//import horizontalBlurShader from "./../shaders/horizontalBlurShader";
//import verticalBlurshader from "./../shaders/verticalBlurShader";

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
        name: "fragShader",
        url: "./shaders/shader.frag",
      },
      {
        name: "horifrag",
        url: "./shaders/test2.frag",
      },
      {
        name: "vertfrag",
        url: "./shaders/test3.frag",
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
  //sprite.filters = [new PIXI.filters.BlurFilter(20, 5)];
  const vertUniforms = {
    min_sigma: 0.0,
    max_sigma: 3.0,
    sigma: 5,
    dim: 0.001,
    kernel: 8.0,
  };
  const horiUniforms = {
    min_sigma: 0.0,
    max_sigma: 3.0,
    sigma: 5,
    dim: 0.001,
    kernel: 8.0,
  };

  const vShader = PIXI.Loader.shared.resources["vertfrag"].data;
  const hShader = PIXI.Loader.shared.resources["horifrag"].data;
  const vertFilter = new PIXI.Filter(null, vShader, vertUniforms);
  const horiFilter = new PIXI.Filter(null, hShader, horiUniforms);
  clearSprite.filters = [horiFilter, vertFilter];
}

window.onload = () => {
  initialize();
};
