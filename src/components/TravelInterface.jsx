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
    const {horde, inventory, requestStop} = this.props;

    return (
      <div className={"travel__interface"} data-showcontent={showContent}>
        <div className={'travel__interface__content'}>
          <TravelHorde
            horde={horde}
          />
          <TravelStats/>
        </div>

        <ul className={`travel__interface__tab__li`}>
          <li className={`travel__interface__tab__el travel__interface__tab__el--travel travel__interface__tab__el--mobileOnly`}
              onClick={() => this.showContentSubsection('hide')}>Travel</li>
          <li className={`travel__interface__tab__el travel__interface__tab__el--horde`}
              onClick={() => this.showContentSubsection('horde')}>Horde</li>
          <li className={`travel__interface__tab__el travel__interface__tab__el--stats`}
              onClick={() => this.showContentSubsection('stats')}>Stats</li>
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