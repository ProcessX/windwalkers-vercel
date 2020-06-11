import React, {Component} from 'react';
import * as PIXI from 'pixi.js'
import TutorialPanel from "../../components/tutorialPanel";
import DirectionStick from "../../components/DirectionStick";
import TransitionModule from "../../components/TransitionModule";
import {Redirect} from "react-router-dom";

//Le timer ici se calcule en minutes.
const harvestingTime = 1;
let harvestingTimer;

const damageIfDead = 15;

let harvestView;
let harvestContainer;

const simulatedCanvasSize = 272;
const canvasGridSize = simulatedCanvasSize / 16;
const controls = {
  up: ['z', 'ArrowUp'],
  down: ['s', 'ArrowDown'],
  left: ['q', 'ArrowLeft'],
  right: ['d', 'ArrowRight'],
  action: [' ', 'spacebar', 'Enter'],
}
const playerSpeed = 0.8;
var windStrength = 1;
const blaastSpeed = 5;
const lootMessageSpeed = 0.1;

let levelDesign = {
  obstacles: [
    [1,6],
    [12,4],
    [7,8],
    [8,8],
    [9,8],
    [9,13],
  ],
  harvestables: [
    [1,1],
    [9,1],
    [12, 13],
  ],
};

let canvasScale = 1;
let canvasScaleHeight = 1;
let canvasScaleWidth = 1;
let tileHeight;
let tileWidth;
let groundColor = 0xf1d1a8;
let limitsColor = 0x8f3700;

let playerMovement = {
  x: 0,
  y: 0,
}

let payout = {
  food: 0,
}


let inputUp;
let inputDown;
let inputLeft;
let inputRight;
let inputAction;


function switchPlayerAnimation(){
  if(playerMovement.x === 0 && playerMovement.y === 0){
    player.texture = playerTexture.textures['Face-Still_0.png'];
    player.stop();
  }
  else{
    if(!player.dead){
      if(playerMovement.y > 0){
        if(Math.abs(playerMovement.x) > 0){
          player.textures = playerTexture.animations['ThreeThirdBack-Walking'];
        }
        else{
          player.textures = playerTexture.animations['Back-Walking'];
        }
      }
      else{
        if(Math.abs(playerMovement.x) > 0){
          player.textures = playerTexture.animations['ThreeThird-Walking'];
        }
        else{
          player.textures = playerTexture.animations['Face-Walking'];
        }
      }
      player.scale.x = 1;
      if(playerMovement.x < 0){
        player.scale.x = -1;
      }

      player.play();
    }
  }
}


/*PIXI elements*/
let harvest;

let player;
let playerTexture;

//On n'utilise pas un Pixi Container car il serait alors impossible de jouer avec le z-index par rapport au joueur.
let obstacles = [];

let safezones = [];

//On n'utilise pas un Pixi Container car il serait alors impossible de jouer avec le z-index par rapport au joueur.
let harvestables = [];
let fruitTreeTexture;

let decoPlants = [];

let harvestableLimit = new PIXI.Graphics();
harvestableLimit.x = 0;
harvestableLimit.y = 0;

let walkingArea = new PIXI.Container();

let blaast;

let alertMessage;

let lootMessages = [];

let loader;


let particleContainer = [];
let particleRenderer = new PIXI.Graphics();
const particleMax = 10;
const particleNormalSpeed = 1;
const particleColor = 0x000000;



//Ajoute les events nécessaires pour la réception des inputs (les touches pressées)
function keyboard(values) {
  let key = {};
  key.values = values;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (key.values.includes(event.key)) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (key.values.includes(event.key)) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}



class Harvest extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
      tutorialBlaast: [],
      characterIndex: 3,
      startTransition: false,
    };
  }


  componentDidMount() {
    let {characterIndex} = this.state;
    const {horde} = this.props;

    loader = PIXI.Loader.shared;

    for (let i = 1; i < (horde.members.length - 1); i++){
      if(horde.members[characterIndex].health < horde.members[i].health){
        characterIndex = i;
      }
    }

    this.setState({characterIndex});

    harvestView = document.getElementsByClassName("harvest__view")[0];
    harvestContainer = document.getElementsByClassName("harvest__container")[0];

    harvest = new PIXI.Application({
      view: harvestView,
      height: harvestView.height,
      width: harvestView.width,
    });

    window.onresize = () => {
      this.resizeCanvas();
      this.resizeSprite();
    };

    this.setupControls();
    this.setup();

    this.props.playMusic('harvest');

    harvestingTimer = window.setTimeout(() => this.startTransition(), harvestingTime * 60000);
  }


  componentWillUnmount() {
    this.clearAll();
  }


  clearAll = () => {
    loader.destroy();
    harvest.destroy();

    obstacles = [];
    safezones = [];
    harvestables = [];
    decoPlants = [];
    lootMessages = [];
    particleContainer = [];

    inputUp.unsubscribe();
    inputDown.unsubscribe();
    inputLeft.unsubscribe();
    inputRight.unsubscribe();

    clearTimeout(harvestingTimer);
  }


  exitMinigame = () => {
    this.props.endHarvesting(player.dead, payout);

    let {redirectURL} = this.state;
    redirectURL = '/game/minigame/loot';
    this.setState({redirectURL})
  }


  resizeCanvas = () => {

    let previousView = {
      height: harvestView.height,
      width: harvestView.width,
    }

    let previousScaleHeight = harvestView.height / simulatedCanvasSize;
    let previousScaleWidth = harvestView.width / simulatedCanvasSize;

    harvestView.height = harvestContainer.offsetHeight;
    harvestView.width = harvestContainer.offsetWidth;

    canvasScaleHeight = harvestView.height / simulatedCanvasSize;
    canvasScaleWidth = harvestView.width / simulatedCanvasSize;

    this.repositionSprites(previousView, previousScaleHeight, previousScaleWidth);

    canvasScale = Math.min(canvasScaleHeight, canvasScaleWidth);

    if(canvasScaleHeight > canvasScaleWidth){
      tileWidth = 16;
      tileHeight = 16 * ((canvasScaleHeight / canvasScaleWidth));
    }
    else{
      tileHeight = 16;
      tileWidth = 16 * ((canvasScaleWidth / canvasScaleHeight));
    }

    harvest.renderer.resolution = canvasScale;

  }


  repositionSprites = (previousView, previousScaleHeight, previousScaleWidth) => {
    let offsetX = canvasScaleWidth / previousScaleWidth;
    let offsetY = player.y / previousView.height;

    player.x *= offsetX;
  }


  resizeSprite = () => {
    blaast.width = tileWidth * canvasGridSize;
    blaast.height = blaast.texture.height;

    alertMessage.x = (harvestView.width / 2) / canvasScale;
    alertMessage.y = 16;

    obstacles.forEach((obstacle) => {
      obstacle.x = (obstacle.coord[0] * tileWidth  + (obstacle.texture.width / 2));
      obstacle.y = (obstacle.coord[1] * tileHeight);
      obstacle.zIndex = obstacle.y;
    });

    safezones.forEach((safezone) => {
      safezone.x = (safezone.coord[0] * tileWidth) + (safezone.texture.width / 2);
      safezone.y = ((safezone.coord[1] * tileHeight)) + (safezone.texture.height / 1.1);
    });

    harvestables.forEach((harvestable) => {
      harvestable.x = (harvestable.coord[0] * tileWidth) + (harvestable.texture.width / 2);
      harvestable.y = (harvestable.coord[1] * tileHeight) + harvestable.texture.height;
    });
  }


  //Initie la scène telle qu'elle a besoin d'être
  setup = () => {
    harvest.renderer.backgroundColor = groundColor;

    this.setupBlaast();
    this.setupPlayer();
    this.setupObstacles();
    this.setupSafezones();
    this.setupHarvestables();

    harvestableLimit.zIndex = -50;
    harvest.stage.addChild(harvestableLimit);

    this.setupAlertMessage();

    this.setupLootMessages();

    this.resizeCanvas();
    this.resizeSprite();

    this.initParticles();
    this.setupDeco();

    harvest.ticker.start();
    harvest.stage.sortableChildren = true;
  }


  setupControls = () => {
    inputUp = keyboard(controls.up);

    inputUp.press = () => {
      playerMovement.y = Math.min(playerMovement.y + 1, 1);
      switchPlayerAnimation();
    }

    inputUp.release = () => {
      playerMovement.y -= 1;
      switchPlayerAnimation();
    }


    inputDown = keyboard(controls.down);

    inputDown.press = () => {
      playerMovement.y = Math.max(playerMovement.y - 1, -1);
      switchPlayerAnimation();
    }

    inputDown.release = () => {
      playerMovement.y += 1;
      switchPlayerAnimation();
    }


    inputLeft = keyboard(controls.left);

    inputLeft.press = () => {
      playerMovement.x = Math.max(playerMovement.x - 1, -1);
      switchPlayerAnimation();
    }

    inputLeft.release = () => {
      playerMovement.x += 1;
      switchPlayerAnimation();
    }


    inputRight = keyboard(controls.right);

    inputRight.press = () => {
      playerMovement.x = Math.min(playerMovement.x + 1, 1);
      switchPlayerAnimation();

    }

    inputRight.release = () => {
      playerMovement.x -= 1;
      switchPlayerAnimation();
    }
  }


  setupPlayer = () => {
    const {characterIndex} = this.state;

    let playerTextureMap = [];
    playerTextureMap.push(loader.resources["golgothAnim"].spritesheet);
    playerTextureMap.push(loader.resources["ergAnim"].spritesheet);
    playerTextureMap.push(loader.resources["sovAnim"].spritesheet);
    playerTextureMap.push(loader.resources["oroshiAnim"].spritesheet);
    playerTextureMap.push(loader.resources["caracoleAnim"].spritesheet);
    playerTextureMap.push(loader.resources["coriolisAnim"].spritesheet);

    playerTexture = playerTextureMap[characterIndex];

    player = new PIXI.AnimatedSprite(
      playerTexture.animations['ThreeThird-Walking'],
    );

    player.texture = playerTexture.textures['Face-Still_0.png'];

    player.animationSpeed = 0.1;

    player.anchor.set(0.5,1);
    player.hitbox = {width: 0.6, height: 0.5};
    player.x = 80;
    player.y = 80;
    player.zIndex = 30;
    player.safe = false;
    player.blownAway = false;
    player.dead = false;

    harvest.stage.addChild(player);

    harvest.ticker.add(() => {
      this.playerLoop();
    });
  }


  setupObstacles = () => {
    let obstacle;

    let rockTextures = loader.resources['rocks'];

    levelDesign.obstacles.forEach((position, i) => {
      obstacle = new PIXI.Sprite(
        rockTextures.textures[`Harvest-Rocks_${i % 3}.png`],
      );


      obstacle.coord = position;
      obstacle.anchor.set(0.5,1);
      obstacle.hitbox = {width: 1, height: 0.5};
      obstacle.zIndex = obstacle.y;

      obstacles.push(obstacle);
    })

    obstacles.forEach((obstacle) => {
      harvest.stage.addChild(obstacle);
    });
  }


  setupSafezones = () => {
    let safezone;
    levelDesign.obstacles.forEach((position) => {
      safezone = new PIXI.Sprite(
        loader.resources.grass01.texture,
      )
      safezone.coord = position;
      safezone.anchor.set(0.5,1);
      safezone.hitbox = {width: 0.6, height: 0.2};

      safezones.push(safezone);
    });

    safezones.forEach((safezone) => {
      harvest.stage.addChild(safezone);
    });
  }


  setupHarvestables = () => {

    fruitTreeTexture = loader.resources["fruitTreeAnim"].spritesheet;

    let harvestable;

    levelDesign.harvestables.forEach((position) => {

      harvestable = new PIXI.AnimatedSprite(
        fruitTreeTexture.animations['FruitTree'],
      );
      harvestable.animationSpeed = 0.08;

      harvestable.coord = position;
      harvestable.anchor.set(0.5, 1);
      harvestable.hitbox = {width: 1, height: 1};
      harvestable.content = {food: 40};
      harvestable.giving = false;
      harvestable.timer = 0;
      harvestable.timeBetweenTik = 5;
      harvestable.tikNbr = 4;

      harvestables.push(harvestable);
    });

    harvestables.forEach((harvestable) => {
      harvest.stage.addChild(harvestable);
    });

    harvest.ticker.add((deltaMS) => {
      this.harvestablesLoop((deltaMS/1000) * (harvest.ticker.FPS/2));
    })
  }


  setupBlaast = () => {
    blaast = new PIXI.TilingSprite(
      loader.resources.blaast.texture,
    );

    blaast.anchor.set(0, 1);
    blaast.y = 0;
    blaast.blowing = false;
    blaast.hitbox = 2;
    blaast.delay = 10;
    blaast.timer = 10;
    blaast.tileScale.x = 2;


    harvest.stage.addChild(blaast);
    harvest.ticker.add((deltaMS) => {
      this.blaastLoop((deltaMS/1000) * (harvest.ticker.FPS/2));
    });

  }


  setupAlertMessage = () => {
    alertMessage = new PIXI.Text("Blaast !");
    alertMessage.style = {
      fontFamily: 'Press Start 2P',
      fontSize: 18,
    };
    alertMessage.anchor.set(0.5, 0);

    alertMessage.visible = false;

    harvest.stage.addChild(alertMessage);
  }


  setupLootMessages = () => {
    for(let i = 0; i < 3; i++){
      let lootMessage = new PIXI.Text(`Loot Message ${i}`);
      lootMessage.style = {
        fontFamily: 'Press Start 2P',
        fontSize: 6,
      }

      lootMessage.visible = false;
      lootMessage.y = i * 30;
      lootMessage.anchor.set(0.5, 1);

      lootMessages.push(lootMessage);
    }

    lootMessages.forEach((message) => {
      harvest.stage.addChild(message);
    });

    harvest.ticker.add(() => {
      this.lootMessagesLoop();
    });
  }


  setupDeco = () => {
    let decoPlantTextures = loader.resources['decoPlant'].spritesheet;

    for(let i = 0; i < 10; i++){

      let plant = new PIXI.Sprite(
        decoPlantTextures.textures[`Harvest-Deco-Plant_${i % 4}.png`],
      );

      plant.x = Math.random() * (harvestView.width / canvasScale);
      plant.y = Math.random() * (harvestView.height / canvasScale);
      plant.zIndex = 2;
      decoPlants.push(plant);
    }

    decoPlants.forEach((plant) => {
      harvest.stage.addChild(plant);
    })
  }


  playerLoop = () => {
    this.movePlayer();
  }


  movePlayer = () => {
    let newPosition = {x: player.x, y: player.y};

    if(!player.blownAway){
      if(!player.dead){
        newPosition.x += playerMovement.x * playerSpeed;
        newPosition.y -= playerMovement.y * playerSpeed;

        if(!player.safe)
          newPosition.y += (windStrength - 1) * 0.5;
      }
    }
    else{
      newPosition.y += blaastSpeed;
    }

    if(!player.dead){
      let limitX = (player.width * player.hitbox.width) / 2;
      newPosition.x = Math.max(newPosition.x, limitX);
      newPosition.x = Math.min(newPosition.x, (harvestView.width / canvasScale) - limitX);

      newPosition.y = Math.max(newPosition.y, player.height);
      newPosition.y = Math.min(newPosition.y, harvestView.height / canvasScale);

      //AMELIORATION : cette version du code impose de faire deux tests de collision.
      //Peut-être trouver une version alternative permettant tout de même de savoir de quel côté vient la collision.

      let playerHitboxX = {
        x: newPosition.x,
        y: player.y,
        height: player.height * player.hitbox.height,
        width: player.width * player.hitbox.width,
      }

      let playerHitboxY = {
        x: player.x,
        y: newPosition.y,
        height: player.height * player.hitbox.height,
        width: player.width * player.hitbox.width,
      }

      let obstacleHitbox, collisionX, collisionY;

      for(let i = 0; i < obstacles.length; i++){
        obstacleHitbox = {
          x: obstacles[i].x,
          y: obstacles[i].y,
          height: obstacles[i].height * obstacles[i].hitbox.height,
          width: obstacles[i].width * obstacles[i].hitbox.width,
        }

        collisionX = this.hitTestRectangle(playerHitboxX, obstacleHitbox);
        collisionY = this.hitTestRectangle(playerHitboxY, obstacleHitbox);

        if(collisionX || collisionY){
          break;
        }
      }

      if(!collisionX){
        player.x = newPosition.x;
      }
      if(!collisionY){
        player.y = newPosition.y;
        player.zIndex = player.y;
      }


      let safezoneHitbox, safezone, collisionWithSafezone;
      for(let i = 0; i < safezones.length; i++){
        safezone = safezones[i];
        safezoneHitbox = {
          x: safezone.x,
          y: safezone.y - (safezone.height * (1 - safezone.hitbox.height)),
          height: safezone.height * safezone.hitbox.height,
          width: safezone.width * safezone.hitbox.width,
        }

        collisionWithSafezone = this.hitTestRectangle(playerHitboxX, safezoneHitbox);

        if(collisionWithSafezone){
          break;
        }
      }

      if(collisionWithSafezone){
        if(!player.safe){
          player.safe = true;
          for(let i = 0; i < safezones.length; i++){
            safezones[i].zIndex = simulatedCanvasSize;
          }
        }
      }
      else{
        if(player.safe){
          player.safe = false;
          for(let i = 0; i < safezones.length; i++){
            safezones[i].zIndex = 1;
          }
        }
      }
    }
  }


  harvestablesLoop = (delta) => {

    let playerHitbox = {
      x: player.x,
      y: player.y,
      height: player.height * player.hitbox.height,
      width: player.width * player.hitbox.width,
    };

    let collisionWithPlayer;

    harvestables.forEach((harvestable) => {

      let harvestableHitbox = {
        x: harvestable.x,
        y: harvestable.y,
        height: harvestable.height * harvestable.hitbox.height,
        width: harvestable.width * harvestable.hitbox.width,
      }

      collisionWithPlayer = this.hitTestRectangle(harvestableHitbox, playerHitbox);

      if(collisionWithPlayer){
        if(!harvestable.giving && harvestable.tikNbr > 0){
          harvestable.giving = true;
          harvestable.timer = harvestable.timeBetweenTik;
          this.displayHarvestableLimit(harvestableHitbox);
          harvestable.play();
        }
      }
      else{
        if(harvestable.giving){
          harvestable.giving = false;
          this.removeHarvestableLimit();
          harvestable.gotoAndStop(0);
        }
      }

      if(harvestable.giving){
        if(harvestable.timer > 0){
          harvestable.timer -= delta;
        }
        else{
          this.addToPayout(harvestable);
          harvestable.tikNbr -= 1;
          if(harvestable.tikNbr > 0){
            harvestable.timer = harvestable.timeBetweenTik;
          }
          else{
            harvestable.giving = false;
            this.removeHarvestableLimit();
            harvestable.texture = fruitTreeTexture.textures['FruitTree_empty.png'];
            harvestable.stop();
          }
        }
      }
    });
  }


  blaastLoop = (delta) => {
    const {tutorial, audioManager} = this.props;

    if(blaast.y > ((harvestView.height / canvasScale) + blaast.height)){
      blaast.y = 0;
      blaast.blowing = false;
      windStrength = 1;
      harvestables.forEach((harvestable) => {
        harvestable.stop();
      })
    }

    if(blaast.blowing){
      blaast.y += blaastSpeed;
      if(!player.safe){
        let playerY = walkingArea.toGlobal(player.position).y;
        if(playerY < blaast.y && playerY >= blaast.y - 24){
          if(!player.blownAway && !player.dead){
            player.blownAway = true;
          }
        }
        else{
          if(player.blownAway){
            player.blownAway = false;
            this.killPlayer();
          }
        }
      }
    }
    else{
      blaast.timer -= delta;
      if(blaast.timer <= 5) {
        alertMessage.visible = true;
        windStrength = 2;
        harvestables.forEach((harvestable) => {
          harvestable.play();
        })
        if(tutorial.harvest[0])
          this.displayTutorial();
      }
      if(blaast.timer <= 0){

        blaast.blowing = true;
        blaast.timer = blaast.delay + this.getRandomInt(5);
        alertMessage.visible = false;
        audioManager.playSoundEffect('wave');
      }
    }
  }


  lootMessagesLoop = () => {
    lootMessages.forEach((message) => {
      if(message.visible){
        message.y -= lootMessageSpeed;
      }
    });
  }


  killPlayer = () => {
    const {audioManager} = this.props;

    audioManager.playSoundEffect('playerHit');

    player.dead = true;
    player.texture = playerTexture.textures['Hit_0.png'];

    //QUESTION : comment boucler dans un objet ?
    if(payout.food > 0){
      payout.food /= 2;

      let lostLoot = {...payout};
      lostLoot.food /= 2;
      payout.food -= lostLoot.food;
      lostLoot.food = -lostLoot.food;

      let messageCoord = {
        x: player.x,
        y: player.y - player.texture.frame.height,
      };

      this.displayLootMessage(lostLoot, messageCoord);
    }

    harvestingTimer = window.setTimeout(this.backToStillTexture, 200);

    this.props.hurtPlayer(this.state.characterIndex, damageIfDead);
  }


  backToStillTexture = () => {
    player.texture = playerTexture.textures['Face-Still_0.png'];
    harvestingTimer = window.setTimeout(this.startTransition, 2000);
  }



  //Collision check
  hitTestRectangle = (r1, r2) => {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //hit will determine whether there's a collision
    hit = false;

    //Find the center points of each sprite
    r1.centerX = r1.x;
    r1.centerY = r1.y - r1.height / 2;
    r2.centerX = r2.x;
    r2.centerY = r2.y - r2.height / 2;

    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {

        //There's definitely a collision happening
        hit = true;
      } else {

        //There's no collision on the y axis
        hit = false;
      }
    } else {

      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };


  getRandomInt = (max) => {
    return Math.floor(
      Math.random() * max
    );
  }


  addToPayout = (harvestable) => {
    const {audioManager} = this.props;

    audioManager.playSoundEffect('harvestable');

    let loot = {
      food: harvestable.content.food / harvestable.tikNbr,
    };
    payout.food += loot.food;
    harvestable.content.food -= loot.food;

    let messageCoord = {
      x: harvestable.x,
      y: harvestable.y - harvestable.texture.height,
    }

    this.displayLootMessage(loot, messageCoord);
  }


  displayHarvestableLimit = (hitbox) => {
    harvestableLimit.x = hitbox.x - hitbox.width/2;
    harvestableLimit.y = hitbox.y - hitbox.height;
    harvestableLimit.lineStyle(1, limitsColor, 1, 1);
    harvestableLimit.beginFill(groundColor);
    harvestableLimit.drawRect(0, 0, hitbox.width, hitbox.height);
    harvestableLimit.endFill();
  }


  removeHarvestableLimit = () => {
    harvestableLimit.clear();
  }


  displayLootMessage = (loot, coord) => {
    let message = lootMessages[0];
    message.position.set(coord.x, coord.y);
    message.visible = true;
    if(loot.food){
      if(loot.food > 0){
        message.text = `+ ${loot.food} food`;
      }
      else{
        if(loot.food < 0){
          message.text = `- ${Math.abs(loot.food)} food`;
        }
      }
    }
    window.setTimeout(() => this.removeLootMessage(message), 2000);
  }


  removeLootMessage = (message) => {
    message.visible = false;
  }


  displayTutorial = () => {
    const {tutorial} = this.props;
    harvest.ticker.stop();
    this.setState({tutorialBlaast: tutorial.harvest});
  }

  validateTutorial = () => {
    const {tutorialBlaast} = this.state;
    if(tutorialBlaast.length === 1)
      harvest.ticker.start();

    this.props.validateTutorial();
  }


  getMobileInput = (input) => {
    let previousPlayerMovement = playerMovement;
    playerMovement = input;

    if((Math.sign(playerMovement.x) !== Math.sign(previousPlayerMovement.x)) || (Math.sign(playerMovement.y) !== Math.sign(previousPlayerMovement.y))){
      switchPlayerAnimation();
    }
  }


  initParticles = () => {
    for(let i = 0; i < particleMax; i++){
      particleContainer.push({
        x: Math.random() * (harvestView.width / canvasScale),
        y: Math.random() * (harvestView.height / canvasScale),
        size: 1,
        velocity: {
          x: (0.5 - Math.random()) / 8,
          y: 1 + (Math.random() / 2),
        }
      });
    }

    particleRenderer.zIndex = 10000;

    harvest.stage.addChild(particleRenderer);
    harvest.ticker.add(this.drawParticles);
    harvest.ticker.add((deltaTime) => this.moveParticle(deltaTime));
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
      //particle.x += particle.velocity.x * particleNormalSpeed * deltaTime * windStrength;
      //particle.y += particle.velocity.y * particleNormalSpeed * deltaTime * windStrength;

      particle.x += particle.velocity.x * particleNormalSpeed * deltaTime * windStrength;
      particle.y += particle.velocity.y * particleNormalSpeed * deltaTime * windStrength;

      if(particle.y >= (harvestView.height / canvasScaleHeight)){
        let particleCoord = this.replaceParticle();
        particle.x = particleCoord.x;
        particle.y = particleCoord.y;
      }
    });
  }


  replaceParticle = () => {
    let particleCoord = {
      x: Math.random() * (harvestView.width / canvasScale),
      y: -3
    };
    return particleCoord;
  }


  startTransition = () => {
    let {startTransition} = this.state;

    startTransition = true;
    this.setState({startTransition});

    this.props.fadeOutMusic(1000);
  }

  redirectURL = (url) => {

  }



  render() {
    const {redirectURL, tutorialBlaast, startTransition} = this.state;
    const {tutorial, validateTutorial} = this.props;

    return (
      <div className={'page page--harvest'}>
        <TransitionModule startTransition={startTransition} callback={() => this.exitMinigame()}/>

        {tutorialBlaast[0] ? <TutorialPanel content={tutorialBlaast[0]} validateTutorial={() => this.validateTutorial()}/> : null}

        <div className={'harvest__container'}>
          <canvas className={'harvest__view'}></canvas>
        </div>

        <div className={'harvest__controller'}>
          <DirectionStick sendInput={(input) => this.getMobileInput(input)}/>
        </div>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Harvest;