import React, {Component} from 'react';
import Btn from "../components/Btn";
import {Redirect} from "react-router-dom";

class Landing extends Component {

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
      <div className={'page page--landing'}>
        <section className={'landing__section landing__section--intro'}>
          <div className={'landing__content'}>
            <h1 className={'title title--landing'}>Windwalkers - a fan's game</h1>
            <p className={'content__intro'}>Inspirée du jeu Oregon Trail et du roman de SF La Horde du Contrevent.</p>
            <Btn action={() => this.redirectTo('/game/')} title={'Tester la démo'}/>
          </div>
        </section>

        <section className={'landing__section landing__section--narration'}>
          <div className={'landing__content'}>
            <h2 className={'title title--landing--section title--landing--section--lightBlue'}>Explorer et découvrir</h2>
            <ul className={'concept__li'}>
              <li className={'concept__el'}>
                <div className={'concept__illu'}>illu</div>
                <p className={'concept__description'}>Affrontez des bourrasques incessantes, capables de déraciner des arbres et d’abattre des villages.</p>
              </li>
              <li className={'concept__el'}>
                <div className={'concept__illu'}>illu</div>
                <p className={'concept__description'}>Affrontez des bourrasques incessantes, capables de déraciner des arbres et d’abattre des villages.</p>
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
                <div className={'artwork__illu'}>illu</div>
                <h3 className={'artwork__title'}>Oregon Trail</h3>
                <h4 className={'artwork__info'}>(Apple II, 1985)</h4>
                <p className={'artwork__description'}>Célèbre jeu de gestion et d’exploration de l’époque micro.</p>
                <Btn title={'Découvrir'}/>
              </li>
              <li className={'artwork__el'}>
                <div className={'artwork__illu'}>illu</div>
                <h3 className={'artwork__title'}>La Horde du Contrevent</h3>
                <h4 className={'artwork__info'}>(Alain Damasio, 2003)</h4>
                <p className={'artwork__description'}>Roman de SF français au succès titanesque.</p>
                <Btn title={'Découvrir'}/>
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