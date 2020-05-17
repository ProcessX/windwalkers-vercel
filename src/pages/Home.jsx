import React, {Component} from 'react';
import Btn from "../components/Btn";

const illuURL = '../assets/Home-Illu.png';

class Home extends Component {
  render() {
    const {redirectTo} = this.props;
    const illu = {
      backgroundImage: `url(${illuURL})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
    };

    return (
      <div className={'page page--home'}>
        <h1 className={'illu home__illu'} style={illu}>Windwalkers</h1>

        <nav className={'menu menu--fullScreen menu--home'}>
          <ul className={'menu__btn__li'}>
            <li className={'menu__btn__el'}>
              <Btn
                title={'Jouer'}
                action={() => redirectTo('/narration')}
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
      </div>
    );
  }
}

export default Home;