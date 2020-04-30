import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import GuideResources from "./guide/GuideResources";
import GuideCharacter from "./guide/GuideCharacter";


class Guide extends Component {

  render() {
    return (
      <div>
        <h1>Guide</h1>
        <Router>
          <Switch>
            <Route path={'/guide/resources'} exact>
              <GuideResources/>
            </Route>

            <Route path={'/guide/characters'} exact>
              <GuideCharacter/>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}


export default Guide;