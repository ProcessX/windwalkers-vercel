import React, {Component} from 'react';
import Btn from "../components/Btn";
import {Redirect} from "react-router-dom";
import TransitionModule from "../components/TransitionModule";


class Landing extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
      startTransition: false,
    }
  }

  startTransition = () => {
    let {startTransition} = this.state;

    startTransition = true;
    this.setState({startTransition});
  }


  redirectTo = (url) => {
    let {redirectURL} = this.state;

    redirectURL = url;
    this.setState({redirectURL});
  }


  relocateTo = (url) => {
    window.open(url, '_blank');
  }

  render() {
    const baseURL = process.env.PUBLIC_URL + '/assets/';

    const introStyle = {
      backgroundImage: `url(${baseURL}Landing-Illu.png)`,
    }

    const mainTitleStyle = {
      backgroundImage: `url(${baseURL}Title-Illu.png)`,
    }

    const conceptStyle01 = {
      backgroundImage: `url(${baseURL}Wind-Icon.png)`,
    }

    const conceptStyle02 = {
      backgroundImage: `url(${baseURL}Horde-Icon.png)`,
    }

    const artworkStyle01 = {
      backgroundImage: `url(${baseURL}OregonTrail-Icon.png)`,
    }

    const artworkStyle02 = {
      backgroundImage: `url(${baseURL}Book-Icon.png)`,
    }

    const {redirectURL, startTransition} = this.state;
    return (
      <div className={'page page--landing'}>

        <TransitionModule startTransition={startTransition} callback={() => this.redirectTo('/game')}/>

        <section className={'landing__section landing__section--intro'} style={introStyle}>
          <div className={'landing__content'}>
            <h1 className={'title title--landing'} style={mainTitleStyle}>Windwalkers</h1>
            <p className={'content__intro'}>Inspirée du jeu Oregon Trail et du roman de SF La Horde du Contrevent.</p>
            <Btn action={() => this.startTransition()} title={'Tester la démo'}/>
          </div>
        </section>

        <section className={'landing__section landing__section--narration'}>
          <div className={'landing__content'}>
            <h2 className={'title title--landing--section title--landing--section--lightBlue'}>Explorer et découvrir</h2>
            <ul className={'concept__li'}>
              <li className={'concept__el'}>
                <div className={'concept__illu'} style={conceptStyle01}>illu</div>
                <p className={'concept__description'}>Affrontez des bourrasques incessantes, capables de déraciner des arbres et d’abattre des villages.</p>
              </li>
              <li className={'concept__el'}>
                <div className={'concept__illu'} style={conceptStyle02}>illu</div>
                <p className={'concept__description'}>Menez la 34ème Horde du Contrevent, les plus tenaces des explorateurs. Soyez le premier à atteindre la source du vent, où tout s’arrête et tout commence.</p>
              </li>
            </ul>
          </div>
        </section>

        <section className={'landing__section landing__section--context'}>
          <div className={'landing__content'}>
            <h2 className={'title title--landing--section title--landing--section--white'}>Mêler deux univers</h2>
            <p className={'context'}>Le projet scolaire Windwalkers est venu au monde de la volonté de mélanger deux œuvres passionnantes :</p>
            <ul className={'artwork__li'}>
              <li className={'artwork__el'}>
                <div className={'artwork__illu'} style={artworkStyle01}>illu</div>
                <h3 className={'artwork__title'}>Oregon Trail</h3>
                <h4 className={'artwork__info'}>(Apple II, 1990)</h4>
                <p className={'artwork__description'}>Célèbre jeu de gestion et d’exploration de l’époque micro.</p>
                <Btn title={'Découvrir'} action={() => this.relocateTo('https://www.myabandonware.com/game/the-oregon-trail-2ku')}/>
              </li>
              <li className={'artwork__el'}>
                <div className={'artwork__illu'} style={artworkStyle02}>illu</div>
                <h3 className={'artwork__title'}>La Horde du Contrevent</h3>
                <h4 className={'artwork__info'}>(Alain Damasio, 2004)</h4>
                <p className={'artwork__description'}>Roman de SF français au succès titanesque.</p>
                <Btn title={'Découvrir'} action={() => this.relocateTo('https://lavolte.net/livres/la-horde-du-contrevent/')}/>
              </li>
            </ul>
          </div>
        </section>

        <section className={'landing__section landing__section--callToAction'}>
          <div className={'landing__content'}>
            <h3 className={'title title--landing--section'}>Venez marcher au sein d’un univers sans pareil avec la Horde du quatrième Golgoth.</h3>
            <Btn action={() => this.redirectTo('/game/')} title={'Tester la démo'}/>
          </div>
        </section>

        <footer className={'landing__footer'}>
          <ul className={'landing__notice__li'}>
            <li className={'landing__notice__el'}>Windwalkers - a fan's game</li>
            <li className={'landing__notice__el'}>Lucas Geshef</li>
            <li className={'landing__notice__el'}>HEAJ - DWM</li>
            <li className={'landing__notice__el'}>2020</li>
          </ul>
        </footer>


        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Landing;