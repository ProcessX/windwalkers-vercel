import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import Btn from "../../components/Btn";
import BtnBack from "../../components/BtnBack";

class Minigame extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
    }
  }


  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;
    this.setState({redirectURL});
  }


  render() {
    const {redirectURL} = this.state;

    return (
      <div className={'page page--minigame'}>
        <BtnBack redirectURL={'/stop/resources'}/>
        <h1>Harvesting</h1>
        <p>Voici les règles du jeu :</p>

        <ul className={'minigame__rule__li'}>
          <li className={'minigame__rule__el'}>
            <div className={'minigame__rule__illu'}>Illu</div>
            <p className={'minigame__rule'}>Déplacez-vous avec les touches ZQSD ou avec les flèches directionnelles.</p>
          </li>
          <li className={'minigame__rule__el'}>
            <div className={'minigame__rule__illu'}>Illu</div>
            <p className={'minigame__rule'}>Approchez des arbustes pour récolter de la nourriture.</p>
          </li>
          <li className={'minigame__rule__el'}>
            <div className={'minigame__rule__illu'}>Illu</div>
            <p className={'minigame__rule'}>Lorsque l'alerte "BLAAST" apparaît, cachez-vous derrière un rocher.</p>
          </li>
        </ul>

        <Btn title={'Commencer'} action={() => this.redirectTo('/minigame/harvest')}/>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Minigame;