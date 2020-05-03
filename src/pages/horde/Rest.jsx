import React, {Component} from 'react';
import BtnBack from "../../components/BtnBack";
import Btn from "../../components/Btn";
import InputRange from "react-input-range";

import 'react-input-range/lib/css/index.css';
import Healthbar from "../../components/Healthbar";

const maxRestingTime = 10;
let restingClock;

/*
https://www.npmjs.com/package/react-input-range
 */

class Rest extends Component {
  constructor() {
    super();
    this.state = {
      resting: false,
      restingTime: 1,
      restingTikInterval: 1,
      restingTikTotal: 3,
      currentRestingTik: 0,
    }
  }


  rest = () => {
    let {resting, restingTikInterval, restingTikTotal, currentRestingTik} = this.state;
    resting = true;
    currentRestingTik = restingTikTotal;

    this.setState(
      {resting: resting, currentRestingTik: currentRestingTik},
      () => restingClock = window.setTimeout(this.restForATik, restingTikInterval * 1000));
  }


  restForATik = () => {
    let {resting, restingTime, restingTikInterval, restingTikTotal, currentRestingTik} = this.state;

    currentRestingTik -= 1;
    if(currentRestingTik <= 0) {
      restingTime -= 1;
      if(restingTime <= 0){
        restingTime = 1;
        this.stopRest();
        return;
      }
      this.setState({restingTime: restingTime, currentRestingTik: restingTikTotal},
        () => restingClock = window.setTimeout(this.restForATik, restingTikInterval * 1000));
    }
    else{
      this.setState(
        {currentRestingTik: currentRestingTik},
        () => restingClock = window.setTimeout(this.restForATik, restingTikInterval * 1000));
    }
  }


  stopRest = () => {
    let {resting} = this.state;
    resting = false;
    this.setState({resting: resting});

    clearTimeout(restingClock);
  }


  render() {
    const {resting, restingTime, currentRestingTik} = this.state;

    const btnTitle = resting ? 'Fin du repos' : 'Se reposer';
    const btnAction = resting ? this.stopRest : this.rest;

    const indicatorStyle = {
      visibility: resting ? 'visible' : 'hidden',
    };


    return (
      <div className={'page page--rest'}>
        <BtnBack/>
        <ul className={'rest__hordeMember__li'}>
          <li className={'rest__hordeMember__el'}>
            <p className={'rest__hordeMember__name'}>G</p>
            <Healthbar maxHealth={20} health={4}/>
          </li>

          <li className={'rest__hordeMember__el'}>
            <p className={'rest__hordeMember__name'}>E</p>
            <Healthbar maxHealth={20} health={19}/>
          </li>

          <li className={'rest__hordeMember__el'}>
            <p className={'rest__hordeMember__name'}>S</p>
            <Healthbar maxHealth={20} health={14}/>
          </li>
        </ul>

        <div className={'rest__settings'}>
          <p className={'rest__indicator'} style={indicatorStyle}>Resting<span className={'rest__indicator__dots'}>{Array(currentRestingTik + 1).join('.')}</span></p>
          <p className={'rest__timeIndicator'}>{restingTime} jour{restingTime > 1 ? 's' : ''}</p>
          <InputRange
            onChange={(value) => this.setState({restingTime: value})}
            value={restingTime}
            maxValue={maxRestingTime}
            minValue={1}
          />
        </div>

        <ul className={'menu__btn__li rest__btn'}>
          <li className={'menu__btn__el'}>
            <Btn
              title={btnTitle}
              action={() => btnAction()}
            />
          </li>
        </ul>

      </div>
    );
  }
}

export default Rest;