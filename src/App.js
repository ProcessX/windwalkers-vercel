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

import Horde from "./pages/stop/Horde";
import Landmark from "./pages/stop/Landmark";
import Resources from "./pages/stop/Resources";
import Camp from "./pages/stop/Camp";
import Credits from "./pages/Credits";
import Rest from "./pages/horde/Rest";
import Harvest from "./pages/minigame/Harvest";
import Loot from "./pages/Loot";


const maxHealth = 100;
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
        pacing: 10,
      },
      inventory: {
        food: 0,
        medkit: 0,
      },
      distanceTraveled: 0,
      progressIndex: 0,
      locations: locations,
      redirectURL: null,
      minigame: {
        success: true,
        payout: null,
      }
    };
  }


  componentDidMount() {
    this.setupHorde();
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


  //Ajoute la distance parcourue au total
  addDistanceTraveled = (distance, callback) => {
    let {distanceTraveled} = this.state;
    distanceTraveled += distance;

    this.setState({distanceTraveled: distanceTraveled}, callback ? callback() : null);
  };


  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;
    console.log(redirectURL);

    this.setState({redirectURL: redirectURL});
  }


  reachLandmark = () => {
    let {progressIndex} = this.state;
    progressIndex += 1;
    if(progressIndex < locations.length) {
      this.setState({progressIndex: progressIndex}, () => this.redirectTo('/stop/'));
    }
    else{
      this.redirectTo('/victory/');
    }
  }


  accessLandmark = () => {
    let {progressIndex} = this.state;
    if(progressIndex > 1){
      this.redirectTo('/stop/horde/');
    }
    else{
      this.redirectTo('/narration/');
    }
  }


  removeScriptedEvent = () => {
    console.log('remove scripted event');
  }


  hurtMember = (i, damage) => {
    let {horde} = this.state;
    horde.members[i].health -= damage;
    horde.members[i].health = Math.max(horde.members[i].health, 0);

    this.setState({horde: horde});
  }


  healMember = (i, heal) => {
    let {horde} = this.state;
    horde.members[i].health += heal;
    horde.members[i].health = Math.min(horde.members[i].health, maxHealth);

    this.setState({horde: horde});
  }


  addToInventory = (loot) => {
    let {inventory} = this.state;
    inventory.food += loot.food;
    this.setState({inventory: inventory});
  }


  endHarvesting = (playerStatus, payout) => {
    let {minigame} = this.state;
    minigame.success = playerStatus;
    minigame.payout = payout;

    this.addToInventory(payout);

    this.setState({minigame: minigame}, () => this.redirectTo('/minigame/loot/'));
  }


  render() {
    const {horde, inventory, distanceTraveled, redirectURL, progressIndex, locations, minigame} = this.state;
    const nextLocation = locations[progressIndex];

    return (
      <div className="App">
        <Router>

          <Switch>
            <Route path={'/'} exact>
              <Home
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/options'} exact>
              <Options/>
            </Route>

            <Route path={'/credits'} exact>
              <Credits/>
            </Route>

            <Route path={'/travel'} exact>
              <Travel
                horde={horde}
                inventory={inventory}
                distanceTraveled={distanceTraveled}
                nextLocation={nextLocation}
                addDistanceTraveled={(distance) => this.addDistanceTraveled(distance)}
                redirectTo={(url) => this.redirectTo(url)}
                reachLandmark={() => this.reachLandmark()}
                removeScriptedEvent={() => this.removeScriptedEvent()}
                hurtMember={(i, damage) => this.hurtMember(i, damage)}
                healMember={(i, heal) => this.healMember(i, heal)}
              />
            </Route>

            <Route path={'/minigame'} exact>
              <Minigame/>
            </Route>

            <Route path={'/packing'} exact>
              <Packing/>
            </Route>

            <Route path={'/narration'} exact>
              <Narration
                progressIndex={progressIndex}
              />
            </Route>

            <Route path={'/guide'} exact>
              <Guide/>
            </Route>

            <Route path={'/stop'} exact>
              <Stop
                nextLocation={nextLocation}
                accessLandmark={() => this.accessLandmark()}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/victory'} exact>
              <Victory/>
            </Route>

            <Route path={'/defeat'} exact>
              <Defeat/>
            </Route>

            <Route path={'/minigame/loot'} exact>
              <Loot
                minigame={minigame}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/stop/horde/rest'} exact>
              <Rest
                horde={horde}
                inventory={inventory}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/minigame/harvest/'} exact>
              <Harvest
                endHarvesting={(playerStatus, payout) => this.endHarvesting(playerStatus, payout)}
              />
            </Route>
          </Switch>


          <Switch>
            <Route path={'/stop/landmark'} exact>
              <Landmark
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/stop/horde'} exact>
              <Horde
                horde={horde}
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/stop/resources'} exact>
              <Resources
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/stop/camp'} exact>
              <Camp
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
