import React, {Component} from 'react';

class Loot extends Component {


  render() {
    const {minigame} = this.props;
    return (
      <div>
        <h1>Loot</h1>
        {/*}
        <p>{payout}</p>
        <p>{playerStatus}</p>
        {*/}
      </div>
    );
  }
}

export default Loot;