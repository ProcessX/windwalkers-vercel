import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Home from "./pages/Home";
import Options from "./pages/Options";
import Travel from "./pages/Travel";
import Minigame from "./pages/resources/Minigame";
import Guide from "./pages/Guide";
import Packing from "./pages/Packing";
import Narration from "./pages/Narration";
import Stop from "./pages/Stop";
import Victory from "./pages/Victory";
import Defeat from "./pages/Defeat";
import Horde from "./pages/stop/Horde";
import Landmark from "./pages/stop/Landmark";
import Resources from "./pages/stop/Resources";
import Camp from "./pages/stop/Camp";
import Credits from "./pages/Credits";
import Rest from "./pages/horde/Rest";
import Harvest from "./pages/minigame/Harvest";
import Loot from "./pages/Loot";
import InventoryMobile from "./pages/resources/InventoryMobile";
import CampfireMobile from "./pages/horde/CampfireMobile";
import Landing from "./pages/Landing";

import * as PIXI from 'pixi.js';

import {locations} from "./data/locationList.json";
import {tutorialSequence} from "./data/tutorial.json";

import AudioManager from "./js/AudioManager";

const maxHealth = 100;
const basicPacing = 10;
const basicFoodConsumption = 10;
const walkingDamage = 0.75;
const eatingHeal = 0.5;

const hordeMembers = [
  {
    firstname: 'Golgoth',
    symbol: 'Ω',
    purpose: 'Traceur',
  },
  {
    firstname: 'Erg',
    lastname: 'Machaon',
    symbol: 'Д',
    purpose: 'Combattant protecteur',
  },
  {
    firstname: 'Sov',
    lastname: 'Strochnis',
    symbol: ')',
    purpose: 'Scribe',
  },
  {
    firstname: 'Oroshi',
    lastname: 'Melicerte',
    symbol: 'х',
    purpose: 'Aéromaître',
  },
  {
    firstname: 'Caracole',
    symbol: ',?',
    purpose: 'Troubadour',
  },
  {
    firstname: 'Coriolis',
    symbol: '~ ~',
    purpose: 'Croc',
  }
];




class App extends Component {

  constructor() {
    super();

    let distFromStart = 0;
    locations.forEach((location) => {
      distFromStart += location.distanceFromPrevious;
      location.distanceFromStart = distFromStart;
    });

    this.state = {
      horde: {
        members: [],
        pacing: basicPacing,
        foodConsumption: basicFoodConsumption,
      },
      inventory: {
        food: 100,
        medkit: 0,
      },
      distanceTraveled: 0,
      progressIndex: 0,
      locations: locations,
      redirectURL: null,
      minigame: {
        success: true,
        payout: null,
      },
      turnNbr: 0,
      tutorial:{
        harvest: [],
        horde: [],
        resources: [],
        landmark: [],
        camp: [],
      },
      audioManager: new AudioManager(),
      musicVolume: 1,
      soundEffectVolume: 1,
    };

  }


  componentDidMount() {
    this.setupHorde();

    this.loadTextures();
  }


  loadTextures = () => {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    let loader = PIXI.Loader.shared;
    //console.log(loader.resources);

    loader.baseUrl = process.env.PUBLIC_URL + '/assets/';
    loader
      .add('landscape_01', 'Dune-01.png')
      .add('landscape_02', 'Mountain-01.png')
      .add('landmarkVillage', 'Landmark-Village.png')
      .add('landmarkPort', 'Landmark-Port.png')
      .add('landmarkCamp', 'Landmark-Camp.png')
      .add('characterWalking', 'characters/test/Figure-ThreeThird-Walking.json')
      .add('oroshiAnim', 'characters/Spritesheet-Oroshi.json')
      .add('sovAnim', 'characters/Spritesheet-Sov.json')
      .add('caracoleAnim', 'characters/Spritesheet-Caracole.json')
      .add('ergAnim', 'characters/Spritesheet-Erg.json')
      .add('coriolisAnim', 'characters/Spritesheet-Coriolis.json')
      .add('golgothAnim', 'characters/Spritesheet-Golgoth.json')
      .add('fruitTreeAnim', 'fruitTreeSpritesheet.json')
      .add('rock01', 'Rock.png')
      .add('grass01', 'Grass.png')
      .add('limits', 'limits.png')
      .add('blaast', 'blaast.png')
      .add('rocks', 'Harvest-Rocks.json')
      .add('decoPlant', 'Harvest-Deco-Plant.json')
      .add('decoRock', 'Harvest-Deco-Rock.json');

    loader.load();
  }


  resetGame = () => {
    this.setState({
      horde: {
        members: [],
        pacing: basicPacing,
        foodConsumption: basicFoodConsumption,
      },
      inventory: {
        food: 120,
        medkit: 0,
      },
      distanceTraveled: 0,
      progressIndex: 0,
      locations: locations,
      redirectURL: '/game',
      minigame: {
        success: true,
        payout: null,
      },
      turnNbr: 0,
      tutorial:{
        harvest: [],
        horde: [],
        resources: [],
        landmark: [],
        camp: [],
      },
    });
  }


  setupHorde = () => {
    let {horde} = this.state;

    horde.members = hordeMembers;

    horde.members.forEach((member) => {
      //member.health = maxHealth;
      member.health = maxHealth;
      member.crippled = false;
    });

    this.setState({horde: horde});
  }


  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;

    this.setState({redirectURL: redirectURL});
  }


  reachLandmark = () => {
    let {progressIndex} = this.state;
    progressIndex += 1;
    this.setState({progressIndex: progressIndex}, () => {
      this.redirectTo('/game/stop/');
      this.addTutorial();
    });
  }


  accessLandmark = () => {
    let {progressIndex, inventory} = this.state;
    if(progressIndex === 3){
      this.redirectTo('/game/victory');
    }
    else{
      if(progressIndex > 1){
        this.redirectTo('/game/stop/horde/');
      }
      else{
        this.redirectTo('/game/narration/');
        inventory.food += 80;
        this.setState({inventory});
      }
    }
  }


  addTutorial = () => {
    let {progressIndex, tutorial} = this.state;
    let newTutorial = tutorialSequence.find(tuto => tuto.progressIndex === progressIndex);
    if(newTutorial){
      Object.keys(newTutorial).forEach((key, i) => {
        if(key !== 'progressIndex')
          tutorial[key].push(...newTutorial[key]);
      });
      this.setState({tutorial});
    }

  }


  validateTutorial = (key) => {
    let {tutorial} = this.state;
    tutorial[key].shift();
    this.setState({tutorial});
  }


  removeScriptedEvent = () => {
  }


  hurtMember = (i, damage) => {
    let {horde} = this.state;
    horde.members[i].health -= damage;
    horde.members[i].health = Math.max(horde.members[i].health, 0);

    if(horde.members[i].health === 0){
      return false;
    }

    return true;

    this.setState({horde: horde});
  }


  healMember = (i, heal) => {
    let {horde} = this.state;
    horde.members[i].health += heal;
    horde.members[i].health = Math.min(horde.members[i].health, maxHealth);

    this.setState({horde: horde});
  }


  takeTurn = (distance, callback) => {
    let {horde, inventory, turnNbr, distanceTraveled} = this.state;

    let damage = (distance * walkingDamage) * (horde.pacing / basicPacing);

    let foodConsumed = Math.min(horde.foodConsumption, inventory.food);
    if(distance > 0)
      foodConsumed *= distance / horde.pacing;

    inventory.food -= foodConsumed;
    turnNbr += 1;
    distanceTraveled += distance;

    let heal = foodConsumed * eatingHeal;

    if(heal > damage){
      for(let i = 0; i < horde.members.length; i++){
        this.healMember(i, heal - damage);
      }
    }
    else{
      for(let i = 0; i < horde.members.length; i++){
        this.hurtMember(i, damage - heal);
      }
    }

    this.setState({inventory: inventory, turnNbr: turnNbr, distanceTraveled: distanceTraveled},callback ? callback() : null);
  }


  addToInventory = (loot) => {
    let {inventory} = this.state;
    inventory.food += loot.food;
    this.setState({inventory: inventory});
  }


  endHarvesting = (playerStatus, payout) => {
    let {minigame} = this.state;

    minigame.success = !playerStatus;
    minigame.payout = payout;

    this.addToInventory(payout);

    this.setState({minigame: minigame}, () => this.redirectTo('/game/minigame/loot/'));
  }


  setMusicVolume = (volume) => {
    let {musicVolume, audioManager} = this.state;
    musicVolume = volume;
    audioManager.setVolume(volume);
    this.setState({musicVolume});
  }


  setSoundEffectVolume = (volume) => {
    let {soundEffectVolume} = this.state;
    soundEffectVolume = volume;
    this.setState({soundEffectVolume});
  }


  playMusic = (id) => {
    let {audioManager} = this.state;
    console.log(id);
    console.log(audioManager.music);

    if(!audioManager.music){
      audioManager.playMusic(id);
    }
    else{
      if(audioManager.music.id !== id){
        audioManager.playMusic(id);
      }
    }
  }


  fadeOutMusic = (timelapse) => {
    let {audioManager} = this.state;
    audioManager.fadeOutMusic(timelapse);
  }



  render() {
    const {
      horde,
      inventory,
      distanceTraveled,
      redirectURL,
      progressIndex,
      locations,
      minigame,
      tutorial,
      audioManager,
      musicVolume,
      soundEffectVolume
    } = this.state;

    const nextLocation = locations[progressIndex];
    const currentLocation = progressIndex > 0 ? locations[progressIndex - 1] : nextLocation;

    return (
      <div className="App">
        <Router>

          <Switch>
            <Route path={'/'} exact>
              <Landing/>
            </Route>

            <Route path={'/game/'} exact>
              <Home
                playMusic={(id) => this.playMusic(id)}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/options'} exact>
              <Options
                progressIndex={progressIndex}
                audioManager={audioManager}
                musicVolume={musicVolume}
                soundEffectVolume={soundEffectVolume}
                setMusicVolume={(volume) => this.setMusicVolume(volume)}
                setSoundEffectVolume={(volume) => this.setSoundEffectVolume(volume)}
              />
            </Route>

            <Route path={'/game/credits'} exact>
              <Credits/>
            </Route>

            <Route path={'/game/travel'} exact>
              <Travel
                playMusic={(id) => this.playMusic(id)}
                fadeOutMusic={(timelapse) => this.fadeOutMusic(timelapse)}
                progressIndex={progressIndex}
                horde={horde}
                inventory={inventory}
                distanceTraveled={distanceTraveled}
                nextLocation={nextLocation}
                takeTurn={(distance, callback) => this.takeTurn(distance, callback)}
                redirectTo={(url) => this.redirectTo(url)}
                reachLandmark={() => this.reachLandmark()}
                removeScriptedEvent={() => this.removeScriptedEvent()}
                hurtMember={(i, damage) => this.hurtMember(i, damage)}
                healMember={(i, heal) => this.healMember(i, heal)}
              />
            </Route>

            <Route path={'/game/minigame'} exact>
              <Minigame/>
            </Route>

            <Route path={'/game/packing'} exact>
              <Packing/>
            </Route>

            <Route path={'/game/narration'} exact>
              <Narration
                fadeOutMusic={(timelapse) => this.fadeOutMusic(timelapse)}
                progressIndex={progressIndex}
              />
            </Route>

            <Route path={'/game/guide'} exact>
              <Guide/>
            </Route>

            <Route path={'/game/stop'} exact>
              <Stop
                playMusic={(id) => this.playMusic(id)}
                currentLocation={currentLocation}
                nextLocation={nextLocation}
                accessLandmark={() => this.accessLandmark()}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/victory'} exact>
              <Victory
                audioManager={audioManager}
                resetGame={() => this.resetGame()}
              />
            </Route>

            <Route path={'/game/defeat'} exact>
              <Defeat
                audioManager={audioManager}
                resetGame={() => this.resetGame()}
              />
            </Route>

            <Route path={'/game/minigame/loot'} exact>
              <Loot
                minigame={minigame}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/game/stop/horde/rest'} exact>
              <Rest
                horde={horde}
                inventory={inventory}
                takeTurn={() => this.takeTurn(0)}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/game/minigame/harvest/'} exact>
              <Harvest
                playMusic={(id) => this.playMusic(id)}
                fadeOutMusic={(timelapse) => this.fadeOutMusic(timelapse)}
                audioManager={audioManager}
                horde={horde}
                hurtPlayer={(i, damage) => this.hurtMember(i, damage)}
                validateTutorial={() => this.validateTutorial('harvest')}
                tutorial={tutorial}
                endHarvesting={(playerStatus, payout) => this.endHarvesting(playerStatus, payout)}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/game/stop/landmark'} exact>
              <Landmark
                validateTutorial={() => this.validateTutorial('landmark')}
                tutorial={tutorial}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/stop/horde'} exact>
              <Horde
                validateTutorial={() => this.validateTutorial('horde')}
                tutorial={tutorial}
                horde={horde}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/stop/horde/campfire'} exact>
              <CampfireMobile
                horde={horde}
              />
            </Route>

            <Route path={'/game/stop/resources'} exact>
              <Resources
                validateTutorial={() => this.validateTutorial('resources')}
                tutorial={tutorial}
                inventory={inventory}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/stop/resources/inventory'}>
              <InventoryMobile inventory={inventory}/>
            </Route>

            <Route path={'/game/stop/camp'} exact>
              <Camp
                distanceTraveled={distanceTraveled}
                nextLocation={nextLocation}
                validateTutorial={() => this.validateTutorial('camp')}
                tutorial={tutorial}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>
          </Switch>

          {redirectURL ? <Redirect to={redirectURL}/> : null}

        </Router>
      </div>
    );
  }
}

export default App;
