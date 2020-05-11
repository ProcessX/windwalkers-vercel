import React, {Component} from 'react';
import Btn from "../components/Btn";
import {Redirect} from "react-router-dom";

class Victory extends Component {

  constructor() {
    super();

    this.state = {
      redirectURL: null,
    }
  }


  displayScore = () => {
  }


  backToLobby = () => {
    let {redirectURL} = this.state;
    redirectURL = '/';
    this.setState({redirectURL});
  }


  render() {
    const {redirectURL} = this.state;

    return (
      <div className={'page page--victory page--narration'}>
        <div className={'narration__illu'}></div>
        <p className={'narration__text'}>Bravo, vous êtes arrivés à la fin de l'aventure.</p>
        <p className={'narration__text'}>Merci d'avoir jouer.</p>

        <Btn action={this.backToLobby} title={`Retour à l'accueil`}/>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Victory;