import React, {Component} from 'react';
import Btn from "../components/Btn";
import HomeScene from "../components/HomeScene";
import {Redirect} from "react-router-dom";

const illuURL = '../assets/Home-Illu.png';

class Home extends Component {

  constructor() {
    super();
    this.state = {
      redirectURL: null,
      titleAnimation: false,
    }
  }

  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;
    this.setState({redirectURL});
  }


  startTitleAnimation = () => {
    let {titleAnimation} = this.state;
    titleAnimation = true;
    this.setState({titleAnimation});
  }


  render() {
    const {redirectURL, titleAnimation} = this.state;

    const illu = {
      backgroundImage: `url(${illuURL})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
    };



    return (
      <div className={'page page--home'}>
        {/*}
        <h1 className={'illu home__illu'} style={illu}>Windwalkers</h1>
        {*/}

        <HomeScene
          titleAnimation={titleAnimation}
          startGame={() => this.redirectTo('/game/narration/')}
        />

        <nav className={'menu menu--fullScreen menu--home'}>
          <ul className={'menu__btn__li'}>
            <li className={'menu__btn__el'}>
              <Btn
                title={'Jouer'}
                action={() => this.startTitleAnimation()}
              />
            </li>

            <li className={'menu__btn__el'}>
              <Btn
                title={'Options'}
              />
            </li>

            <li className={'menu__btn__el'}>
              <Btn
                className={'test'}
                title={'Crédits'}
              />
            </li>
          </ul>
        </nav>

        <ul className={'home__info__li'}>
          <li className={'home__info__el'}>
            <p className={'home__info'}>2020 - Lucas Geshef</p>
          </li>
          <li className={'home__info__el'}>
            <p className={'home__info'}>Albert Jacquard (DWM)</p>
          </li>
        </ul>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Home;