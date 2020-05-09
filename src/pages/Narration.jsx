import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Narration extends Component {
  render() {
    return (
      <div className={'page page--narration'}>
        <h1>Narration</h1>
        <Link to={'/travel/'}>Continuer</Link>
      </div>
    );
  }
}

export default Narration;