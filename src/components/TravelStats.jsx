import React, {Component} from 'react';

class TravelStats extends Component {
  render() {
    const {horde, inventory, nextLocation, distanceTraveled} = this.props

    return (
      <div className={'travel__interface__content__sub travel__interface__content__sub--stats travel__stats'}>
        <ul className={'stat__li'}>
          <li className={'stat__el'}>
            <p className={'stat__title'}>Vivres</p>
            <p className={'stat__counter'}>{inventory.food} rations</p>
          </li>
          <li className={'stat__el'}>
            <p className={'stat__title'}>Distance</p>
            <p className={'stat__counter'}>{nextLocation.distanceFromStart - distanceTraveled} km</p>
          </li>
          <li className={'stat__el'}>
            <p className={'stat__title'}>Cadence</p>
            <p className={'stat__counter'}>{horde.pacing} km/tour</p>
          </li>
          <li className={'stat__el'}>
            <p className={'stat__title'}>Consommation</p>
            <p className={'stat__counter'}>{horde.foodConsumption} rations/tour</p>
          </li>
        </ul>
      </div>
    );
  }
}

export default TravelStats;