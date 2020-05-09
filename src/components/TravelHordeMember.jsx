import React, {Component} from 'react';
import Healthbar from "./Healthbar";

class TravelHordeMember extends Component {
  render() {
    const {name, health, crippled} = this.props;

    return (
      <div className={'travel__horde__member'}>
        <p className={'travel__horde__member__name'}>{name}</p>
        <Healthbar maxHealth={100} health={health}/>
        <div className={'travel__horde__member__state'}>State</div>
      </div>
    );
  }
}

export default TravelHordeMember;