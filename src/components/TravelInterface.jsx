import React, {Component} from 'react';
import Btn from "./Btn";
import TravelHorde from "./TravelHorde";
import TravelStats from "./TravelStats";

class TravelInterface extends Component {

  constructor() {
    super();

    this.state = {
      showContent: 'hide',
    }
  }


  showContentSubsection = (subsection) => {
    let {showContent} = this.state;
    showContent = subsection;
    this.setState({showContent: showContent});
  }


  render() {
    const {showContent} = this.state;
    const {horde, inventory, requestStop, distanceTraveled, nextLocation} = this.props;

    const iconBaseURL = `${process.env.PUBLIC_URL}/assets/icons`;

    const travelIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Walk.png)`,
    }

    const hordeIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Health.png)`,
    }

    const statsIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Stats.png)`,
    }

    return (
      <div className={"travel__interface"} data-showcontent={showContent}>
        <div className={'travel__interface__content'}>
          <TravelHorde
            horde={horde}
          />
          <TravelStats
            horde={horde}
            inventory={inventory}
            distanceTraveled={distanceTraveled}
            nextLocation={nextLocation}
          />
        </div>

        <ul className={`travel__interface__tab__li`}>
          <li className={`travel__interface__tab__el travel__interface__tab__el--travel travel__interface__tab__el--mobileOnly`}
              onClick={() => this.showContentSubsection('hide')}>Travel<div className={'travel__interface__tab__icon pixelArt'} style={travelIcon}></div></li>
          <li className={`travel__interface__tab__el travel__interface__tab__el--horde`}
              onClick={() => this.showContentSubsection('horde')}>Horde<div className={'travel__interface__tab__icon pixelArt'} style={hordeIcon}></div></li>
          <li className={`travel__interface__tab__el travel__interface__tab__el--stats`}
              onClick={() => this.showContentSubsection('stats')}>Stats<div className={'travel__interface__tab__icon pixelArt'} style={statsIcon}></div></li>
          <Btn
            title={'Stop'}
            action={() => requestStop()}
          />
        </ul>
      </div>
    );
  }
}

export default TravelInterface;