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


  displayHorde = () => {
    const {horde} = this.props;

    let hordeIndicators = [];

    hordeIndicators.push(horde.members.map((member, i) => {
      let specialTagClass = '';
      if(i === 4){
        specialTagClass = 'rest__hordeMember__tag--symbol--caracole';
      }
      if(i === 5){
        specialTagClass = 'rest__hordeMember__tag--symbol--coriolis';
      }

      return <li className={'rest__indicator__el'} key={i}>
        <p className={'rest__hordeMember__tag rest__hordeMember__tag--name'}>{member.firstname}</p>
        <p className={`rest__hordeMember__tag rest__hordeMember__tag--symbol ${specialTagClass}`}>{member.symbol}</p>
        <Healthbar maxHealth={100} health={member.health}/>
      </li>;
    }));

    return hordeIndicators;
  }


  render() {
    const {resting, restingTime, currentRestingTik} = this.state;
    const {horde, inventory} = this.props;

    const btnTitle = resting ? 'Fin du repos' : 'Se reposer';
    const btnAction = resting ? this.stopRest : this.rest;

    const indicatorStyle = {
      visibility: resting ? 'visible' : 'hidden',
    };

    const hordeIndicators = this.displayHorde();


    return (
      <div className={'page page--rest'}>
        <BtnBack/>

        <ul className={'rest__indicator__li'}>
          <p className={'rest__indicator__el rest__indicator__el--food'}>Vivres : {inventory.food} kg</p>

          {hordeIndicators}
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