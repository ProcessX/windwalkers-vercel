import React, {Component} from 'react';
import * as PIXI from 'pixi.js'
import {Redirect} from "react-router-dom";

//Le timer ici se calcule en minutes.
const harvestingTime = 1;
let harvestingTimer;


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
const windStrength = 2;
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
let groundColor = 0xf05c00;
let limitsColor = 0x8f3700;

let playerMovement = {
  x: 0,
  y: 0,
}

let payout = {
  food: 0,
}



/*
Inputs
 */
let inputUp = keyboard(controls.up);

inputUp.press = () => {
  playerMovement.y = Math.min(playerMovement.y + 1, 1);
}

inputUp.release = () => {
  playerMovement.y -= 1;
}


let inputDown = keyboard(controls.down);

inputDown.press = () => {
  playerMovement.y = Math.max(playerMovement.y - 1, -1);

}

inputDown.release = () => {
  playerMovement.y += 1;
}


let inputLeft = keyboard(controls.left);

inputLeft.press = () => {
  playerMovement.x = Math.max(playerMovement.x - 1, -1);
}

inputLeft.release = () => {
  playerMovement.x += 1;
}


let inputRight = keyboard(controls.right);

inputRight.press = () => {
  playerMovement.x = Math.min(playerMovement.x + 1, 1);

}

inputRight.release = () => {
  playerMovement.x -= 1;
}


let inputAction = keyboard(controls.action);

inputAction.press = () => {
  console.log('go action');
}

inputAction.release = () => {
  console.log('stop action');
}


/*PIXI elements*/
let harvest;

let player;

//On n'utilise pas un Pixi Container car il serait alors impossible de jouer avec le z-index par rapport au joueur.
let obstacles = [];

let safezones = [];

//On n'utilise pas un Pixi Container car il serait alors impossible de jouer avec le z-index par rapport au joueur.
let harvestables = [];

let harvestableLimit = new PIXI.Graphics();
harvestableLimit.x = 0;
harvestableLimit.y = 0;

let walkingArea = new PIXI.Container();

let blaast;

let alertMessage;

let lootMessages = [];

let loader;



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
    };
  }


  componentDidMount() {
    harvestView = document.getElementsByClassName("harvest__view")[0];
    harvestContainer = document.getElementsByClassName("harvest__container")[0];

    harvest = new PIXI.Application({
      view: harvestView,
      height: harvestView.height,
      width: harvestView.width,
    });

    //Change le resizing mode, afin de garder l'apparence des sprites en pixel art.
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    loader = new PIXI.Loader();
    loader.baseUrl = process.env.PUBLIC_URL + '/assets/';

    loader
      .add('player', 'player.png')
      .add('rock01', 'rock01.png')
      .add('grass01', 'grass01.png')
      .add('limits', 'limits.png')
      .add('harvestable', 'fruitTree01.png')
      .add('blaast', 'blaast.png');

    loader.onComplete.add(() => {
      this.setup();
    });

    loader.load();

    window.onresize = () => {
      this.resizeCanvas();
      this.resizeSprite();
    };

    harvestingTimer = window.setTimeout(() => this.exitMinigame(), harvestingTime * 60000);
  }


  componentWillUnmount() {
    loader.destroy();
  }


  exitMinigame = () => {
    this.props.endHarvesting(player.dead, payout);
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
    console.log(offsetX);
    let offsetY = player.y / previousView.height;

    player.x *= offsetX;
  }


  resizeSprite = () => {
    blaast.width = tileWidth * canvasGridSize;
    blaast.height = blaast.texture.height;

    alertMessage.x = (harvestView.width / 2) / canvasScaleWidth;
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

    harvest.ticker.start();
    harvest.stage.sortableChildren = true;
  }


  setupPlayer = () => {
    player = new PIXI.Sprite(
      loader.resources.player.texture,
    );

    player.anchor.set(0.5,1);
    player.hitbox = {width: 1, height: 0.5};
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

    levelDesign.obstacles.forEach((position) => {
      obstacle = new PIXI.Sprite(
        loader.resources.rock01.texture,
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
    let harvestable;

    levelDesign.harvestables.forEach((position) => {
      harvestable = new PIXI.Sprite(
        loader.resources.harvestable.texture,
      );
      harvestable.coord = position;
      harvestable.anchor.set(0.5, 1);
      harvestable.hitbox = {width: 1, height: 1};
      harvestable.content = {food: 10};
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
    blaast = new PIXI.Sprite(
      loader.resources.blaast.texture,
    );

    blaast.anchor.set(0, 1);
    blaast.y = 0;
    blaast.blowing = false;
    blaast.hitbox = 2;
    blaast.delay = 10;
    blaast.timer = 10;


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


  playerLoop = () => {
    this.movePlayer();
  }


  movePlayer = () => {
    let newPosition = {x: player.x, y: player.y};

    if(!player.blownAway){
      if(!player.dead){
        newPosition.x += playerMovement.x * playerSpeed;
        newPosition.y -= playerMovement.y * playerSpeed;

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
          console.log('Collision detected');
        }
      }
      else{
        if(harvestable.giving){
          harvestable.giving = false;
          this.removeHarvestableLimit();
          console.log('Collision lost');
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
            console.log('Tik');
          }
          else{
            harvestable.giving = false;
            this.removeHarvestableLimit();
            console.log('Harvestable Empty');
          }
        }
      }
    });
  }


  blaastLoop = (delta) => {

    if(blaast.y >= (harvestView.height + blaast.height)){
      blaast.y = 0;
      blaast.blowing = false;
    }

    if(blaast.blowing){
      blaast.y += blaastSpeed;
      if(!player.safe){
        let playerY = walkingArea.toGlobal(player.position).y;
        if(playerY < blaast.y && playerY >= blaast.y - 30){
          if(!player.blownAway && !player.dead){
            console.log('player hit');
            player.blownAway = true;
          }
        }
        else{
          if(player.blownAway){
            player.blownAway = false;
            console.log('player dead');
            this.killPlayer();
          }
        }
      }
    }
    else{
      blaast.timer -= delta;
      if(blaast.timer <= 5){
        alertMessage.visible = true;
      }
      if(blaast.timer <= 0){
        blaast.blowing = true;
        blaast.timer = blaast.delay;
        alertMessage.visible = false;
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
    player.dead = true;
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

    harvestingTimer = window.setTimeout(this.exitMinigame, 5000);
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


  addToPayout = (harvestable) => {
    console.log(harvestable.content.food);
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
    console.log('Display limit');
    harvestableLimit.x = hitbox.x - hitbox.width/2;
    harvestableLimit.y = hitbox.y - hitbox.height;
    harvestableLimit.lineStyle(1, limitsColor, 1, 1);
    harvestableLimit.beginFill(groundColor);
    harvestableLimit.drawRect(0, 0, hitbox.width, hitbox.height);
    harvestableLimit.endFill();
  }


  removeHarvestableLimit = () => {
    console.log('Remove limit');
    harvestableLimit.clear();
  }


  displayLootMessage = (loot, coord) => {
    let message = lootMessages[0];
    console.log(loot.food / 2);
    message.position.set(coord.x, coord.y);
    message.visible = true;
    if(loot.food){
      console.log('Brat');
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






  render() {
    const {redirectURL} = this.state;

    return (
      <div className={'page page--harvest'}>
        <div className={'harvest__container'}>
          <canvas className={'harvest__view'}></canvas>
        </div>
      </div>
    );
  }
}

export default Harvest;