import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Minigame extends Component {
  render() {
    return (
      <div className={'page page--minigame'}>
        <h1>Harvest</h1>
        <Link to={'/minigame/harvest'}>Harvest</Link>
      </div>
    );
  }
}

export default Minigame;