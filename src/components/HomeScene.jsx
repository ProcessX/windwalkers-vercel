import React, {Component} from 'react';
import * as PIXI from 'pixi.js'

import {imgData} from '../data/imgData.json';

const simulatedWidth = 320;
const imgAverageVelocity = 1;
const imgBurstRate = 100;
const imgBurstAcceleration = 1.005;

const imgParticleRatio = 5;

const imgVelocityMin = 2;

var canvas;
var view;
var loader;
var img = new PIXI.Graphics();

var imgBurstTimer = 0;
var imgBurstingPixel = 0;
var imgDeadPixel = 0;

const imgPixelNbr = imgData.length;

var imgParticles = [];

let animationTimer;


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

    this.resizeCanvas();
    window.onresize = this.resizeCanvas;

    view.stage.addChild(img);

    loader = new PIXI.Loader();
    loader.onComplete.add(() => {
      this.initImg();
      this.drawImg();
      //this.initTitleAnimation();
      view.ticker.start();
    });
    loader.load();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.titleAnimation !== this.props.titleAnimation){
      this.initTitleAnimation();
      animationTimer = window.setTimeout(this.props.startGame, 8000);
    }
  }


  resizeCanvas = () => {
    view.height = window.innerHeight;
    view.width = window.innerWidth;

    let viewResolution = view.width / simulatedWidth;
    view.renderer.resolution = viewResolution
  }


  initImg = () => {
    let testI = 0;
    let testJ = 0;
    for(let i = 0; i < imgData.length; i++){
      if((i % imgParticleRatio === 0)){
        imgParticles.push(imgData[i])
      }
    }

    imgParticles.forEach((pixel, i) => {
      pixel.velocity = this.getRandomVelocity();
      pixel.lifetime = 2;
      pixel.size = Math.random() * 2;
    });

    console.log(imgParticles);
  }


  drawImg = () => {
    img.clear();

    for(let i = imgBurstingPixel + 1; i < imgPixelNbr; i++){
      let pixel = imgData[i];
      img.beginFill(pixel.color);
      img.drawRect(pixel.x, pixel.y, 1, 1);
      img.endFill();
    }

    for(let j = imgDeadPixel; j < (imgBurstingPixel / imgParticleRatio); j++){
      let pixel = imgParticles[j];
      img.beginFill(pixel.color);
      img.drawRect(pixel.x, pixel.y, pixel.size, pixel.size);
      img.endFill();
    }
  }


  imgBurst = () => {
    let framerate = view.ticker.FPS;

    //imgBurstingPixel = Math.min(Math.floor((imgBurstingPixel + (imgBurstRate / framerate)) * imgBurstAcceleration), imgPixelNbr - 1);
    //imgBurstingPixel = Math.min(Math.floor(imgBurstingPixel + (imgBurstRate / framerate)), imgPixelNbr - 1);
    imgBurstingPixel = Math.min(imgBurstingPixel + imgBurstRate, imgPixelNbr - 1);
    //imgBurstingPixel = Math.min(Math.floor((imgBurstingPixel + imgBurstRate) * imgBurstAcceleration), imgPixelNbr - 1);
  }


  imgMove = () => {
    let framerate =  1 / view.ticker.FPS;

    for(let i = imgDeadPixel; i <= (imgBurstingPixel / imgParticleRatio); i++){
      let pixel = imgParticles[i];
      pixel.x += pixel.velocity.x * imgAverageVelocity;
      pixel.y += pixel.velocity.y * imgAverageVelocity;
      pixel.lifetime -= framerate;

      if(pixel.lifetime <= 0){
        imgDeadPixel += 1;
      }
    }

  }


  getRandomVelocity = () => {
    let velocity = {x: -imgVelocityMin, y: 0};
    velocity.x -= Math.random() * 2;
    velocity.y = (0.3 - Math.random());

    return velocity;
  }

  getRandomInt = (max) => {
    return Math.floor(
      Math.random() * max
    );
  }


  initTitleAnimation = () => {
    view.ticker.add(() => {
      this.imgBurst();
      this.imgMove();
      this.drawImg();
    });
    view.ticker.start();
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