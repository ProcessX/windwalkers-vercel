import React, {Component} from 'react';
import * as PIXI from 'pixi.js'


let particleContainer = [];
let particleRenderer = new PIXI.Graphics();
const particleMax = 10;
const particleSizeMax = 1.3;
const particleNormalSpeed = 2;
const particleMinSpeed = particleNormalSpeed;
const particleMaxSpeed = particleMinSpeed * 2;
const particleColor = 0xffffff;

var hordeReplacing = false;
const hordeReplaceSpeed = 0.1;


class Parallaxe extends Component {


  parallaxeView;
  parallaxeContainer;
  simulatedCanvasHeight = 140;

  groundHeightDesktop = 56;
  groundHeightMobile = 80;

  groundHeight = 60;

  hordeMembersPosition;

  hordeMembersPositionNormal = [
    {
      x: 70,
      y: 6,
    },
    {
      x: 54,
      y: 0,
    },
    {
      x: 50,
      y: 20,
    },
    {
      x: 36,
      y: 2,
    },
    {
      x: 32,
      y: 19,
    },
    {
      x: 16,
      y: 8,
    },
  ];

  hordeMembersPosition = this.hordeMembersPositionNormal;

  hordeMembersPositionWindy = [
    {
      x: 62,
      y: 10,
    },
    {
      x: 54,
      y: 6,
    },
    {
      x: 52,
      y: 14,
    },
    {
      x: 44,
      y: 7,
    },
    {
      x: 40,
      y: 12,
    },
    {
      x: 32,
      y: 8,
    },
  ];

  canvasScale = 1;
  groundColor = 0xf05c00;
  parallaxeSpeed = 18;
  parallaxeRunning = 0;

  parallaxe;

//Init ground.
  ground = new PIXI.Graphics();

//Init landscape -- groupe d'éléments positionné depuis le coin inférieur gauche du canvas
  landscape = new PIXI.Container();

//Init sky -- groupe d'éléments positionné depuis le coin supérieur gauche du canvas
  sky = new PIXI.Container();

  nextLandmark;

//Character sprite
//let character;
//Group of characters
  horde = new PIXI.Container();
  hordeToManipulate = [];

//Character animated texture (4 frames)
  characterAnimatedTexture;

  loader;





  componentDidMount() {
    this.parallaxeView = document.body.getElementsByClassName('parallaxe__view')[0];
    this.parallaxeContainer = document.body.getElementsByClassName('parallaxe__container')[0];

    this.parallaxe = new PIXI.Application({
      view: this.parallaxeView,
      height: this.parallaxeView.height,
      width: this.parallaxeView.width,
    });

    window.onresize = this.resizeCanvas;

    this.parallaxe.stage.addChild(this.ground);

    this.loader = PIXI.Loader.shared;

    this.initLandscape();
    this.loadCharacter();
    this.initNextLandmark();
    this.resizeCanvas();
    this.setupLoop();
    this.checkForCasulties();
    this.initParticles();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    const {walking, horde, windStrength, stormwind} = this.props;
    if(walking && !prevProps.walking){
      console.log('walk');
      this.hordeToManipulate.forEach((member, i) => {
        member.texture = null;
        if(windStrength > 1){
          member.textures = this.characterAnimatedTexture[i].animations['ThreeThird-Hunched-Walking'];
        }
        else{
          member.textures = this.characterAnimatedTexture[i].animations['ThreeThird-Walking'];
        }
        member.play();
        console.log(member.playing);
      });
    }
    else{
      if(!walking && prevProps.walking){
        console.log('stop walking');
        this.hordeToManipulate.forEach((member, i) => {
          if(windStrength > 1){
            member.texture = this.characterAnimatedTexture[i].textures['ThreeThird-Hunched-Still_0.png'];
          }
          else{
            member.texture = this.characterAnimatedTexture[i].textures['ThreeThird-Still_0.png'];
          }
          member.stop();
        });
      }
    }

    if(!walking){
      this.checkForCasulties();
    }

    if(windStrength !== prevProps.windStrength){
      this.changeHordePosition();
      this.hordeToManipulate.forEach((member, i) => {
        member.textures = this.characterAnimatedTexture[i].animations['ThreeThird-Walking'];
        member.play();
      });

      if(windStrength > 1){
        console.log('VENT !');
        particleContainer.forEach((particle) => {
          particle.velocity.x *= 3;
          particle.velocity.x /= 3;
        });
      }
      else{
        particleContainer.forEach((particle) => {
          particle.velocity.x /= 3;
          particle.velocity.x /= 3;
        });
      }
    }

    if(stormwind !== prevProps.stormwind){
      if(stormwind === "incoming"){
        console.log('Storm incoming');
      }
    }

  }


  componentWillUnmount() {
    this.loader.destroy();
    particleContainer = [];
    this.parallaxe.destroy();
  }


  checkForCasulties = () => {
    let {horde} = this.props;

    for(let i = 0; i < this.horde.children.length; i++){
      if(horde.members[i].health <= 0){
        this.horde.children[i].visible = false;
      }
    }
  }


  setupLoop = () => {
    this.parallaxe.ticker.add(() => {
      this.landscape.children.forEach((elem) => {
        elem.tilePosition.x -= elem.translationSpeed * (this.parallaxeSpeed / this.parallaxe.ticker.FPS) * this.parallaxeRunning;
      });

      this.nextLandmark.simulateX -= (this.parallaxeSpeed / this.parallaxe.ticker.FPS) * this.parallaxeRunning;
      this.nextLandmark.x = this.nextLandmark.simulateX * this.canvasScale;

    });
  }



  resizeCanvas = () => {
    this.parallaxeView.height = this.parallaxeContainer.offsetHeight;
    this.parallaxeView.width = this.parallaxeContainer.offsetWidth;

    this.canvasScale = Math.min(this.parallaxeView.height, this.parallaxeView.width) / this.simulatedCanvasHeight;

    if(this.parallaxeView.height > this.parallaxeView.width){
      this.groundHeight = this.groundHeightMobile;
    }
    else{
      this.groundHeight = this.groundHeightDesktop;
    }

    this.landscape.scale.set(this.canvasScale);

    this.setHorde();

    this.resizeNextLandmark();

    this.setGround(this.groundColor);

    this.setLandscapeHeight();

  }



  //Ajoute un rectangle de couleur en bas du canvas (le sol)
  setGround = (color) => {
    let groundTopLeftCorner = this.parallaxeView.height - (this.groundHeight * this.canvasScale);

    this.ground.clear();
    this.ground.beginFill(color);
    this.ground.drawRect(0, groundTopLeftCorner, this.parallaxeView.width, this.groundHeight * this.canvasScale);
    this.ground.endFill();
  }



  //Ajoute les différentes couches du parallaxe - landscape (bas de l'écran)
  initLandscape = () => {
    let landscape_02 = new PIXI.TilingSprite(
      this.loader.resources.landscape_02.texture,
    );

    landscape_02.width = this.parallaxeView.width;
    landscape_02.height = landscape_02.texture.height;
    landscape_02.tileScale.x = 1 * this.canvasScale;
    landscape_02.anchor.y = 1;
    //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
    landscape_02.translationSpeed = 0.6;

    this.landscape.addChild(landscape_02);

    let landscape_01 = new PIXI.TilingSprite(
      this.loader.resources.landscape_01.texture,
    );

    landscape_01.width = this.parallaxeView.width;
    landscape_01.height = landscape_01.texture.height;
    landscape_01.tileScale.x = 1 * this.canvasScale;
    landscape_01.anchor.y = 1;

    //Custom var : vitesse relative de l'élément à l'intérieur du parallaxe.
    landscape_01.translationSpeed = 1;

    this.landscape.addChild(landscape_01);

    this.landscape.scale.set(1, this.canvasScale);

    this.parallaxe.stage.addChild(this.landscape);
  }



  initParticles = () => {
    for(let i = 0; i < particleMax; i++){
      particleContainer.push({
        x: Math.random() * this.parallaxeView.width,
        y: Math.random() * this.parallaxeView.height,
        size: Math.max(Math.random() * particleSizeMax * this.canvasScale, this.canvasScale),
        velocity: {
          x: Math.min(-particleMinSpeed - ((particleMaxSpeed - particleMinSpeed) * Math.random()), -particleMinSpeed),
          y: (0.5 - Math.random()) / 10,
        }
      });
    }

    this.parallaxe.stage.addChild(particleRenderer);
    this.parallaxe.ticker.add(this.drawParticles);
    this.parallaxe.ticker.add((deltaTime) => this.moveParticle(deltaTime));
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
    const {windStrength} = this.props;

    particleContainer.forEach((particle) => {
      particle.x += particle.velocity.x * particleNormalSpeed * deltaTime * windStrength;
      particle.y += particle.velocity.y * particleNormalSpeed * deltaTime * windStrength;

      if(particle.x <= (0 - particle.size)){
        let particleCoord = this.replaceParticle();
        particle.x = particleCoord.x;
        particle.y = particleCoord.y;
      }
    });
  }


  replaceParticle = () => {
    let particleCoord = {
      x: this.parallaxeView.width,
      y: Math.random() * this.parallaxeView.height
    };
    return particleCoord;
  }


  initNextLandmark = () => {
    const {horde, nextLocation, distanceTraveled, walkingTime, progressIndex} = this.props;

    let remainingDistance = nextLocation.distanceFromStart - distanceTraveled;
    let remainingSteps = remainingDistance / horde.pacing;

    let landmarkTextures = [];
    landmarkTextures.push(this.loader.resources.landmarkVillage.texture);
    landmarkTextures.push(this.loader.resources.landmarkPort.texture);
    landmarkTextures.push(this.loader.resources.landmarkCamp.texture);

    this.nextLandmark = new PIXI.Sprite(
      landmarkTextures[progressIndex],
    );

    this.nextLandmark.anchor.set(0, 0.2);
    this.nextLandmark.simulateX = 120 + (remainingSteps * this.parallaxeSpeed * walkingTime);


    this.resizeNextLandmark();

    this.parallaxe.stage.addChild(this.nextLandmark);
  }



  resizeNextLandmark = () => {
    this.nextLandmark.height = this.nextLandmark.texture.height * this.canvasScale;
    this.nextLandmark.width = this.nextLandmark.texture.width * this.canvasScale;

    this.nextLandmark.y = (this.parallaxeView.height - (this.groundHeight * this.canvasScale));
    this.nextLandmark.x = this.nextLandmark.simulateX * this.canvasScale;

  }



  setLandscapeHeight = () => {
    let landscapeTopLeftCorner = (this.parallaxeView.height - (this.groundHeight * this.canvasScale));
    this.landscape.y = landscapeTopLeftCorner;

    this.landscape.children.forEach((elem, i) => {
      elem.width = this.parallaxeView.width;
      elem.tileScale.x = 1;
    })
  }



  loadCharacter = () => {

    this.characterAnimatedTexture = [];
    this.characterAnimatedTexture.push(this.loader.resources["golgothAnim"].spritesheet);
    this.characterAnimatedTexture.push(this.loader.resources["ergAnim"].spritesheet);
    this.characterAnimatedTexture.push(this.loader.resources["sovAnim"].spritesheet);
    this.characterAnimatedTexture.push(this.loader.resources["oroshiAnim"].spritesheet);
    this.characterAnimatedTexture.push(this.loader.resources["caracoleAnim"].spritesheet);
    this.characterAnimatedTexture.push(this.loader.resources["coriolisAnim"].spritesheet);

    this.props.horde.members.forEach((member, i) => {
      let character = new PIXI.AnimatedSprite(this.characterAnimatedTexture[i].animations['ThreeThird-Walking']);
      character.texture = this.characterAnimatedTexture[i].textures['ThreeThird-Still_0.png'];
      character.x = this.hordeMembersPosition[i].x;
      character.y = this.hordeMembersPosition[i].y;
      character.zIndex = (i + 1) % 2;

      this.horde.addChild(character);
      this.horde.children.forEach((member) => {
        member.animationSpeed = 0.1;
        member.stop();
      });
    });

    this.hordeToManipulate = this.horde.children.map((member) => {
      return member;
    })

    //Trier les enfants d'un container Pixi va modifier leur ordre au rendu ET pour le programme.
    //On se retrouve donc avec une Horde mélangée, ce qui pose problème pour les changements de texture.
    //Pour éviter les soucis, on utilise un second tableau Horde pour toutes les manipulations.
    this.horde.sortableChildren = true;

    this.parallaxe.stage.addChild(this.horde);
    this.setHorde();

    this.parallaxe.ticker.add(() => this.replaceHordeLoop());
  }



  setHorde = () => {
    this.horde.scale.set(this.canvasScale);
    let hordeTopLeftCorner = this.parallaxeView.height - (this.groundHeight * this.canvasScale);
    this.horde.y = hordeTopLeftCorner;
    this.horde.x = 30 * this.canvasScale;
  }


  changeHordePosition = () => {
    const {windStrength} = this.props;
    console.log('Change horde position');
    hordeReplacing = true;
    if(windStrength === 1){
      this.hordeMembersPosition = this.hordeMembersPositionNormal;
    }
    else{
      this.hordeMembersPosition = this.hordeMembersPositionWindy;
    }
  }


  replaceHordeLoop = () => {
    const {windStrength} = this.props;
    if(hordeReplacing){
      let membersReplaced = 0;
      this.hordeToManipulate.forEach((member, i) => {
        let remainingDistanceX = this.hordeMembersPosition[i].x - member.x;
        let remainingDistanceY = this.hordeMembersPosition[i].y - member.y;
        member.x += Math.sign(remainingDistanceX) * Math.min(hordeReplaceSpeed, Math.abs(remainingDistanceX));
        member.y += Math.sign(remainingDistanceY) * Math.min(hordeReplaceSpeed, Math.abs(remainingDistanceY));
        if(member.x === this.hordeMembersPosition[i].x && member.y === this.hordeMembersPosition[i].y && member.playing){
          membersReplaced += 1;
          if(windStrength > 1)
            member.texture = this.characterAnimatedTexture[i].textures['ThreeThird-Hunched-Still_0.png'];
          else
            member.texture = this.characterAnimatedTexture[i].textures['ThreeThird-Still_0.png'];
        }
      });

      if(membersReplaced === this.horde.children.length) {
        hordeReplacing = false;
        this.hordeToManipulate.forEach((member, i) => {
          member.stop();
        });
      }
    }
  }




  render() {
    const {walking} = this.props;
    this.parallaxeRunning = walking ? 1 : 0;

    return (
      <div className={'parallaxe__container'}>
        <canvas className="parallaxe__view"></canvas>
      </div>
    );
  }
}

export default Parallaxe;