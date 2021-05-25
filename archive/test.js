var ring;
var displace;
var displace2;
var bg2;
var container2;
var container;
var viewport;

function initialize() {
  const app = new PIXI.Application();
  document.body.appendChild(app.view);
  app.stage.interactive = true;
  container = new PIXI.Container();
  container2 = new PIXI.Container();

  app.stage.addChild(container);

  app.stage.addChild(container2);
  //container2.addChild(viewport);
  //app.stage.addChild(viewport);

  const padding = 100;

  app.loader
    .add([
      {
        name: "bg",
        //url: 'https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/img_midground_good.png'
        url: "./images/img_midground_good.png",
      },
      {
        name: "ring",
        //url: 'https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/ring.png',
        url: "./images/ring.png",
      },
      {
        name: "filter",
        //url: 'https://test-video-bucket-darren.s3-ap-southeast-1.amazonaws.com/displace.png',
        url: "./images/displace.png",
      },
    ])
    .load(() => {
      const bg = new PIXI.Sprite(app.loader.resources.bg.texture);
      bg2 = new PIXI.Sprite(app.loader.resources.bg.texture);
      container.width = app.screen.width / 2;
      container.height = app.screen.height / 2;
      container2.width = app.screen.width / 2;
      container2.height = app.screen.height / 2;
      bg.width = app.screen.width / 2;
      bg.height = app.screen.height / 2;
      bg2.width = app.screen.width / 2;
      bg2.height = app.screen.height / 2;
      container.addChild(bg);
      container2.mask = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawRect(0, bg2.height, bg2.width, bg2.height)
        .endFill();

      //viewport.addChild(bg2);
      //viewport.position.y = bg.height;
      container2.addChild(bg2);
      container2.position.y = bg.height;

      ring = new PIXI.Sprite(app.loader.resources.ring.texture);
      ring.anchor.set(0.5);
      ring.visible = false;
      container.addChild(ring);

      displace = new PIXI.Sprite(app.loader.resources.filter.texture);
      displace2 = new PIXI.Sprite(app.loader.resources.filter.texture);
      displace2.scale.set(3);
      const displacementFilter = new PIXI.filters.DisplacementFilter(displace);
      const displacementFilter2 = new PIXI.filters.DisplacementFilter(
        displace2
      );
      container.addChild(displace);
      container.filters = [displacementFilter];
      container2.addChild(displace2);
      container2.filters = [displacementFilter2];
      displacementFilter.scale.x = 110;
      displacementFilter.scale.y = 110;
      displacementFilter2.scale.x = 110;
      displacementFilter2.scale.y = 110;
      displace.anchor.set(0.5);
      //displace2.anchor.set(0.5);
      viewport.drag().pinch();

      app.stage.on("mousemove", onPointerMove).on("touchmove", onPointerMove);
    });
}

function onPointerMove(eventData) {
  ring.visible = true;
  displace.position.set(eventData.data.global.x, eventData.data.global.y);
  ring.position.copyFrom(displace.position);
  var offset = document.documentElement.clientHeight / 2;
  var radius = 170;
  var zoom = (offset / radius / 1.3) * 0.9;
  //displace2.pivot.set(eventData.data.global.x, eventData.data.global.y);
  //displace2.position.set(eventData.data.global.x, eventData.data.global.y);

  //container2.position.set(50,50);
  //bg2.position.set(100,100);
  container2.position.set(
    -eventData.data.global.x * 2,
    -eventData.data.global.y * 2 + 50
  );
  bg2.position.set(
    -eventData.data.global.x * 2,
    -eventData.data.global.y * 2 + 50
  );
  bg2.scale.set(0.5);
  displace2.position.set(
    eventData.data.global.x + 200,
    eventData.data.global.y + 300
  );
  //console.log(eventData.data.global.x, eventData.data.global.y);
  //displace2.position.set(400, 500);
  //bg2.scale = new PIXI.Point(1.2,1.2);
  //bg2.position.copyFrom(displace2.position);

  //viewport.drag();
  //viewport.fit(false, 200, 200);
  //bg2.setTransform(zoom, 0, 0, zoom, 0, 0, 0, eventData.data.global.x, eventData.data.global.y);
  /*
  viewport.setTransform(
    (container.width / 2 - eventData.data.global.x) * zoom - container.width / 2 * (zoom - 1), 
    (1 / 1.3 * container.height / 2 - eventData.data.global.y + offset) * zoom - 1 / 1.3 * container.height / 2 * (zoom - 1) - (0.3/ 1.3 * container.height / 2 - 80)* zoom,
    zoom,
    zoom,
    0,
    0,
    0,
    0.5,
    0.5
  )
  */
}

window.onload = () => {
  initialize();
};
