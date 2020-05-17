import React, {Component} from 'react';
import Healthbar from "./Healthbar";

class TravelHordeMember extends Component {
  render() {
    const {name, health, crippled} = this.props;

    let backgroundURL = `url(${process.env.PUBLIC_URL}/assets/icons/Icon-Skull.png`;

    let stateStyle;

    if(health <= 0){
      stateStyle = {
        backgroundImage: backgroundURL
      };
    }

    return (
      <div className={'travel__horde__member'}>
        <p className={'travel__horde__member__name'}>{name}</p>
        <Healthbar maxHealth={100} health={health}/>
        <div className={'travel__horde__member__state'} style={stateStyle}>State</div>
      </div>
    );
  }
}

export default TravelHordeMember;