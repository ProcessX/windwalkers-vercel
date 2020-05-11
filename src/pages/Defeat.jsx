import React, {Component} from 'react';
import Btn from "../components/Btn";
import {Redirect} from "react-router-dom";

class Defeat extends Component {
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
      <div className={'page page--defeat page--narration'}>
        <div className={'narration__illu'}></div>
        <p className={'narration__text'}>Votre Horde entière a été décimée. L'aventure s'arrête ici pour vous.</p>
        <p className={'narration__text'}>Merci toutefois d'avoir jouer. N'hésitez pas à retenter votre chance.</p>

        <Btn action={this.backToLobby} title={`Retour à l'accueil`}/>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Defeat;