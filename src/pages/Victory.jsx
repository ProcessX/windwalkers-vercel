import React, {Component} from 'react';
import Btn from "../components/Btn";


const illuURL = '../assets/landmarks/Victory-Illu.png';


class Victory extends Component {


  render() {
    const {resetGame} = this.props;

    const illu = {
      backgroundImage: `url(${illuURL})`,
      backgroundRepeat: 'no-repeat',
    }

    return (
      <div className={'page page--victory page--narration'}>
        <div className={'illu narration__illu'} style={illu}></div>
        <p className={'narration__text'}>Bravo, vous êtes arrivés à la fin de l'aventure.</p>

        <Btn action={resetGame} title={`Retour à l'accueil`}/>
      </div>
    );
  }
}

export default Victory;