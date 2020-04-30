import React, {Component} from 'react';
import TravelInterfaceTab from "./TravelInterfaceTab";

class TravelInterface extends Component {
  render() {
    return (
      <div className={"travel__interface"}>
        <h2>Travel Interface</h2>
        <div className={'travel__interface__content'}>
          Content
        </div>
        <ul className={'travel__interface__tab__li'}>
          <TravelInterfaceTab name={'Horde'}/>
          <TravelInterfaceTab name={'Stats'}/>
        </ul>
      </div>
    );
  }
}

export default TravelInterface;