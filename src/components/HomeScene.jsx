import React, {Component} from 'react';
import * as PIXI from 'pixi.js'

import {imgData} from '../data/imgData.json';

const simulatedWidth = 320;
const imgAverageVelocity = 1;
const imgBurstRate = 50;

const imgParticleRatio = 8;

const imgVelocityMin = 2;

var canvas;
var container;
var view;
var loader;
var offset;
var img = new PIXI.Graphics();

var imgBurstingPixel = 0;
var imgDeadPixel = 0;

const imgPixelNbr = imgData.length;

var imgParticles = [];

let animationTimer;

var viewResolution;
var newViewResolution;

const titleSize = {
  height: 82,
  width: 310,
}

let particleContainer = [];
let particleRenderer = new PIXI.Graphics();
const particleMax = 10;
const particleColor = 0xFFFFFF;


class HomeScene extends Component {

  componentDidMount() {
    canvas = document.querySelector('.home__scene__canvas');
    container = document.querySelector('.home__scene');

    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight - 10;

    view = new PIXI.Application({
      view: canvas,
      height: canvasHeight,
      width: canvasWidth,
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    view.height = window.innerHeight;
    view.width = window.innerWidth;

    viewResolution = view.width / simulatedWidth;

    view.renderer.resolution = viewResolution;

    this.resizeCanvas();
    window.onresize = this.resizeCanvas;

    view.stage.addChild(img);

    loader = new PIXI.Loader();
    loader.onComplete.add(() => {
      this.initImg();
      this.drawImg();
      this.initParticles();
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

  componentWillUnmount() {
    particleContainer = [];
    view.destroy();
  }


  resizeCanvas = () => {

    view.height = window.innerHeight;
    view.width = window.innerWidth;

    newViewResolution = view.width / simulatedWidth;

    img.scale.y = newViewResolution / viewResolution;

    offset = {
      x: (simulatedWidth - titleSize.width) / 2,
      y: ((container.offsetHeight / newViewResolution) - (titleSize.height / img.scale.y)) / 2,
    }

    img.x = offset.x;
    img.y = offset.y;

    this.drawImg();
  }


  initImg = () => {
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

    imgBurstingPixel = Math.min(imgBurstingPixel + imgBurstRate, imgPixelNbr - 1);
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


  initTitleAnimation = () => {
    view.ticker.add(() => {
      this.imgBurst();
      this.imgMove();
      this.drawImg();
    });
  }


  initParticles = () => {
    for(let i = 0; i < particleMax; i++){
      particleContainer.push({
        x: Math.random() * simulatedWidth,
        y: Math.random() * simulatedWidth,
        size: 1,
        velocity: this.getRandomVelocity()
      });
    }

    particleRenderer.zIndex = 10000;

    view.stage.addChild(particleRenderer);
    view.ticker.add(this.drawParticles);
    view.ticker.add((deltaTime) => this.moveParticle(deltaTime));
  }


  drawParticles = () => {
    particleRenderer.clear();

    particleContainer.forEach((particle) => {
      particleRenderer.beginFill(particleColor);
      particleRenderer.drawRect(particle.x, particle.y, particle.size, particle.size);
      particleRenderer.endFill();
    });
  }


  moveParticle = (deltaTime) => {
    particleContainer.forEach((particle) => {

      particle.x += particle.velocity.x * deltaTime;
      particle.y += particle.velocity.y * deltaTime;

      if(particle.x < (0 - particle.size)){
        let particleCoord = this.replaceParticle();
        particle.x = particleCoord.x;
        particle.y = particleCoord.y;
      }
    });
  }


  replaceParticle = () => {
    let particleCoord = {
      x: simulatedWidth,
      y: Math.random() * simulatedWidth,
    };
    return particleCoord;
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