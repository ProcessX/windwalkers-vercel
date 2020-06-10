import React, {Component} from 'react';
import Btn from "../components/Btn";

class Defeat extends Component {

  render() {

    return (
      <div className={'page page--defeat page--narration'}>
        <div className={'narration__illu pixelArt'}></div>
        <p className={'narration__text'}>Votre Horde entière a été décimée. L'aventure s'arrête ici pour vous.</p>
        <p className={'narration__text'}>Merci toutefois d'avoir jouer. N'hésitez pas à retenter votre chance.</p>

        <Btn action={this.props.resetGame} title={`Retour à l'accueil`}/>

      </div>
    );
  }
}

export default Defeat;