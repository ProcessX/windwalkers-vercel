import React, {Component} from 'react';
import * as PIXI from 'pixi.js'

import duneSprite from  '../assets/Dune-01.png';
import mountainSprite from '../assets/Mountain-01.png';
import characterSpritesheet from '../assets/characters/test/Figure-ThreeThird-Walking.json';

let parallaxeView;
let parallaxeContainer;
const simulatedCanvasHeight = 140;

const groundHeight = 40;

let canvasScale = 1;
let groundColor = 0xf05c00;
let parallaxeSpeed = 1.45;

let parallaxe;

//Init ground.
let ground = new PIXI.Graphics();

//Init landscape -- groupe d'éléments positionné depuis le coin inférieur gauche du canvas
let landscape = new PIXI.Container();

//Init sky -- groupe d'éléments positionné depuis le coin supérieur gauche du canvas
let sky = new PIXI.Container();

//Character sprite
//let character;
//Group of characters
let horde = new PIXI.Container();

//Character animated texture (4 frames)
let characterAnimatedTexture;

let loader;



class Parallaxe extends Component {

  componentDidMount() {
    parallaxeView = document.body.getElementsByClassName('parallaxe__view')[0];
    parallaxeContainer = document.body.getElementsByClassName('parallaxe__container')[0];

    parallaxe = new PIXI.Application({
      view: parallaxeView,
      height: parallaxeView.height,
      width: parallaxeView.width,
    });

    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    window.onresize = this.resizeCanvas();
    this.resizeCanvas();

    parallaxe.stage.addChild(ground);

    loader = PIXI.Loader.shared;
    loader.baseUrl = process.env.PUBLIC_URL + '/assets/';
    loader
      .add('landscape_01', 'Dune-01.png')
      .add('landscape_02', 'Mountain-01.png')
      .add('characterWalking', 'characters/test/Figure-ThreeThird-Walking.json');

    loader.onComplete.add(() => {
      this.initLandscape();
      this.loadCharacter();
    });

    loader.load();

    parallaxe.ticker.add(() => {
      landscape.children.forEach((elem) => {
        elem.tilePosition.x -= elem.translationSpeed * parallaxeSpeed;
      });

    });
  }



  resizeCanvas = () => {
    parallaxeView.height = parallaxeContainer.offsetHeight;
    parallaxeView.width = parallaxeContainer.offsetWidth;

    canvasScale = parallaxeView.height / simulatedCanvasHeight;

    this.setGround(groundColor);

    this.setLandscapeHeight();
  }



  //Ajoute un rectangle de couleur en bas du canvas (le sol)
  setGround = (color) => {
    let groundTopLeftCorner = parallaxeView.height - (groundHeight * canvasScale);

    ground.clear();
    ground.beginFill(color);
    ground.drawRect(0, groundTopLeftCorner, parallaxeView.width, groundHeight * canvasScale);
    ground.endFill();
  }



  //Ajoute les différentes couches du parallaxe - landscape (bas de l'écran)
  initLandscape = () => {
    let landscape_02 = new PIXI.TilingSprite(
      loader.resources.landscape_02.texture,
    );

    landscape_02.width = parallaxeView.width;
    landscape_02.height = landscape_02.texture.height;
    landscape_02.tileScale.x = 1 * canvasScale;
    landscape_02.anchor.y = 1;
    //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
    landscape_02.translationSpeed = 0.6;

    landscape.addChild(landscape_02);

    let landscape_01 = new PIXI.TilingSprite(
      loader.resources.landscape_01.texture,
    );

    landscape_01.width = parallaxeView.width;
    landscape_01.height = landscape_01.texture.height;
    landscape_01.tileScale.x = 1 * canvasScale;
    landscape_01.anchor.y = 1;

    //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
    landscape_01.translationSpeed = 1;

    landscape.addChild(landscape_01);

    landscape.scale.set(1, canvasScale);

    parallaxe.stage.addChild(landscape);

  }



  setLandscapeHeight = () => {
    let landscapeTopLeftCorner = (parallaxeView.height - (groundHeight * canvasScale));
    landscape.y = landscapeTopLeftCorner;
  }



  loadCharacter = () => {
    characterAnimatedTexture = loader.resources["characterWalking"].spritesheet;
    console.log(characterAnimatedTexture);

    let character = new PIXI.AnimatedSprite(characterAnimatedTexture.animations["walking"]);

    horde.addChild(character);
    horde.children.forEach((member) => {
      member.animationSpeed = 0.1;
      member.play();
    });

    parallaxe.stage.addChild(horde);
    this.setHorde();

  }



  setHorde = () => {
    let hordeTopLeftCorner = parallaxeView.height - (groundHeight * canvasScale);
    horde.scale.set(canvasScale);
    horde.y = hordeTopLeftCorner;
  }



  render() {
    return (
      <div className={'parallaxe__container'}>
        <canvas className="parallaxe__view"></canvas>
      </div>
    );
  }
}

export default Parallaxe;