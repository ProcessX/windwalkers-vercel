import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import Btn from "../../components/Btn";
import BtnBack from "../../components/BtnBack";
import TransitionModule from "../../components/TransitionModule";

class Minigame extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
      startTransition: false,
    }
  }


  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;
    this.setState({redirectURL});
  }

  startTransition = () => {
    let {startTransition} = this.state;

    startTransition = true;
    this.setState({startTransition});
  }


  render() {
    const {redirectURL, startTransition} = this.state;

    return (
      <div className={'page page--minigame'}>
        <TransitionModule startTransition={startTransition} callback={() => this.redirectTo('/game/minigame/harvest')}/>

        <BtnBack redirectURL={'/game/stop/resources'}/>
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

        <Btn title={'Commencer'} action={() => this.startTransition()}/>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Minigame;