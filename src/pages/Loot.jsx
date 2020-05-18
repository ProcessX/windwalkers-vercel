import React, {Component} from 'react';
import Btn from "../components/Btn";
import {Redirect} from "react-router-dom";

class Loot extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
    }
  }


  displayMessage = () => {
    const {minigame} = this.props;

    let message = [];

    if(minigame.success){
      message.push(<p key={'message01'}>Vous avez affronté le blaast avec succès et rapporté vos ressources au campement.</p>);
    }
    else{
      message.push(<p key={'message01'}>Le blaast vous a surprit hors de votre cachette.</p>);
      message.push(<p key={'message02'}>L'impact a causé des blessures, mais vous parvenez néanmoins à ramener la moitié de votre butin au camp.</p>);
    }

    return message;
  }


  displayPayout = () => {
    const {minigame} = this.props;

    let payout = [];

    for (let [key, value] of Object.entries(minigame.payout)) {
      payout.push(<li className={'payout__el'}>
        <p key={key}>{key} : {value}</p>
      </li>);
    }

    return payout;
  }


  returnTo = () => {
    let {redirectURL} = this.state;
    redirectURL = '/game/stop/resources/';
    this.setState({redirectURL});
  }


  render() {
    const {minigame} = this.props;
    const message = this.displayMessage();
    const payout = this.displayPayout();
    const {redirectURL} = this.state;

    return (
      <div className={'page page--loot'}>
        {message}
        <ul className={'payout__li'}>
          {payout}
        </ul>

        <Btn title={'Retour au camp'} action={() => this.returnTo()}/>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Loot;