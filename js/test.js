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
        name: "test",
        url: "./shaders/test2.frag",
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
  const uniforms = {
    sigma: 5,
    blurSize: 1 / clearSprite.height,
    x_vec: 0.0,
    y_vec: 1.0,
  };
  const uniforms2 = {
    sigma: 5,
    blurSize: 1 / clearSprite.width,
    x_vec: 1.0,
    y_vec: 0.0,
  };
  const uniforms3 = {
    iter: 0.4,
  };
  const vShader = blurShader.innerText;
  //const fShader = PIXI.Loader.shared.resources["fragShader"].data;
  const fShader = PIXI.Loader.shared.resources["test"].data;
  const vertFilter = new PIXI.Filter(null, fShader, uniforms);
  const horiFilter = new PIXI.Filter(null, fShader, uniforms2);
  const testFilter = new PIXI.Filter(null, fShader, uniforms3);
  clearSprite.filters = [vertFilter, horiFilter];
}

window.onload = () => {
  initialize();
};
