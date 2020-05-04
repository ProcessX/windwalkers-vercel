import React, {Component} from 'react';
import TravelHordeMember from "./TravelHordeMember";

class TravelHorde extends Component {
  render() {
    return (
      <div className={'travel__interface__content__sub travel__horde'}>
        <TravelHordeMember character={{name: 'Golgoth', health: 15, hurt: false}}/>
        <TravelHordeMember character={{name: 'Erg', health: 5, hurt: false}}/>
        <TravelHordeMember character={{name: 'Sov', health: 15, hurt: false}}/>
        <TravelHordeMember character={{name: 'Oroshi', health: 15, hurt: false}}/>
        <TravelHordeMember character={{name: 'Caracole', health: 15, hurt: false}}/>
        <TravelHordeMember character={{name: 'Coriolis', health: 15, hurt: false}}/>
      </div>
    );
  }
}

export default TravelHorde;