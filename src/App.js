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

import {locations} from "./data/locationList.json";
import {tutorialSequence} from "./data/tutorial.json";

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
      }
    };
  }


  componentDidMount() {
    this.setupHorde();

    //Test
    //this.addTutorial();
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
      redirectURL: '/',
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
      }
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
    console.log(redirectURL);

    this.setState({redirectURL: redirectURL});
  }


  reachLandmark = () => {
    let {progressIndex} = this.state;
    progressIndex += 1;
    console.log(progressIndex)
    this.setState({progressIndex: progressIndex}, () => {
      this.redirectTo('/game/stop/');
      this.addTutorial();
    });
    /*
    if(progressIndex < locations.length) {
      this.setState({progressIndex: progressIndex}, () => {
        this.redirectTo('/stop/');
        this.addTutorial();
      });
    }
     */
    /*
    else{
      this.redirectTo('/victory/');
    }

     */
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
    console.log('remove scripted event');
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

    console.log("Walk damage : " + damage);
    console.log("Food consumed : " + foodConsumed);

    let heal = foodConsumed * eatingHeal;
    console.log("Eating heal : " + heal);

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

    console.log(playerStatus);
    console.log(payout);

    minigame.success = !playerStatus;
    minigame.payout = payout;

    this.addToInventory(payout);

    this.setState({minigame: minigame}, () => this.redirectTo('/game/minigame/loot/'));
  }



  render() {
    const {horde, inventory, distanceTraveled, redirectURL, progressIndex, locations, minigame, tutorial} = this.state;
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
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/options'} exact>
              <Options/>
            </Route>

            <Route path={'/game/credits'} exact>
              <Credits/>
            </Route>

            <Route path={'/game/travel'} exact>
              <Travel
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
                progressIndex={progressIndex}
              />
            </Route>

            <Route path={'/game/guide'} exact>
              <Guide/>
            </Route>

            <Route path={'/game/stop'} exact>
              <Stop
                currentLocation={currentLocation}
                nextLocation={nextLocation}
                accessLandmark={() => this.accessLandmark()}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/game/victory'} exact>
              <Victory
                resetGame={() => this.resetGame()}
              />
            </Route>

            <Route path={'/game/defeat'} exact>
              <Defeat
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
