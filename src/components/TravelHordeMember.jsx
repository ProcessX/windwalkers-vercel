import React, {Component} from 'react';
import Healthbar from "./Healthbar";

class TravelHordeMember extends Component {
  render() {
    const {character} = this.props;

    return (
      <div className={'travel__horde__member'}>
        <p className={'travel__horde__member__name'}>{character.name}</p>
        <Healthbar maxHealth={20} health={character.health}/>
        <div className={'travel__horde__member__state'}>State</div>
      </div>
    );
  }
}

export default TravelHordeMember;