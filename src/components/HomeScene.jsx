import React, {Component} from 'react';
import * as PIXI from 'pixi.js'

const simulatedWidth = 320;

var canvas;
var view;
var loader;
var img = new PIXI.Graphics();

var imgData = [{x: 0, y: 0, color: 0xf05c00},{x: 1, y: 1, color: 0xf05c00}, {x: 0, y: 1, color: 0xffffff}, {x: 1, y: 0, color: 0xffffff}];

class HomeScene extends Component {

  componentDidMount() {
    canvas = document.querySelector('.home__scene__canvas');

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight - 10;
    console.log(canvasWidth);

    view = new PIXI.Application({
      view: canvas,
      height: canvasHeight,
      width: canvasWidth,
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    console.log(window.innerWidth);

    this.resizeCanvas();
    window.onresize = this.resizeCanvas;

    view.stage.addChild(img);

    loader = new PIXI.Loader();
    loader.onComplete.add(() => {
      this.initImg();
    });
    loader.load();
  }

  resizeCanvas = () => {
    view.height = window.innerHeight;
    view.width = window.innerWidth;

    let viewResolution = view.width / simulatedWidth;
    view.renderer.resolution = viewResolution
  }


  initImg = () => {
    imgData.forEach((pixel) => {
      img.beginFill(pixel.color);
      img.drawRect(pixel.x + 100, pixel.y + 50, 1, 1);
      img.endFill();
    })
  }


  render() {
    return (
      <div className={'home__scene'}>
        <canvas className={'home__scene__canvas'}></canvas>
      </div>
    );
  }
}

export default HomeScene;