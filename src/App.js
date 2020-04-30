import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Home from "./pages/Home";
import Options from "./pages/Options";
import Travel from "./pages/Travel";
import Minigame from "./pages/Minigame";
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
    };
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

    this.setState({redirectURL: redirectURL});
  }



  render() {
    const {horde, inventory, distanceTraveled, redirectURL, progressIndex, locations} = this.state;
    const nextLocation = locations[progressIndex + 1];

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
              />
            </Route>

            <Route path={'/minigame'} exact>
              <Minigame/>
            </Route>

            <Route path={'/packing'} exact>
              <Packing/>
            </Route>

            <Route path={'/narration'} exact>
              <Narration/>
            </Route>

            <Route path={'/guide'} exact>
              <Guide/>
            </Route>

            <Route path={'/stop'} exact>
              <Stop
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/victory'} exact>
              <Victory/>
            </Route>

            <Route path={'/defeat'} exact>
              <Defeat/>
            </Route>
          </Switch>


          <Switch>
            <Route path={'/stop/landmark'} exact>
              <Landmark/>
            </Route>

            <Route path={'/stop/horde'} exact>
              <Horde
                redirectTo={(url) => this.redirectTo(url)}
              />
            </Route>

            <Route path={'/stop/resources'} exact>
              <Resources/>
            </Route>

            <Route path={'/stop/camp'} exact>
              <Camp/>
            </Route>
          </Switch>



          {redirectURL ? <Redirect push to={redirectURL}/> : null}
        </Router>

      </div>
    );
  }
}

export default App;
