import React, {Component} from 'react';
import BtnBack from "../../components/BtnBack";
import Campfire from "../../components/Campfire";

class CampfireMobile extends Component {
  render() {
    const {horde} = this.props;

    return (
      <div className={'page page--mobile page--campfireMobile'}>
        <BtnBack redirectURL={'/game/stop/horde'}/>

        <Campfire horde={horde}/>
      </div>
    );
  }
}

export default CampfireMobile;