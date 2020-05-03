import React, {Component} from 'react';
import Btn from "../../components/Btn";
import {Link} from 'react-router-dom';
import Campfire from "../../components/Campfire";

class Horde extends Component {


  render() {
    const {redirectTo} = this.props;

    return (
      <div className={'page page--managementSection page--horde'}>

        <div className={'managementSection__content'}>
          <div className={'managementSection__illu'}>Section's illu</div>

          <h2 className={'title title--size1 title--center managementSection__title'}>Horde</h2>

          <nav className={'managementSection__menu'}>
            <ul className={'menu__btn__li'}>
              <li className={'menu__btn__el menu__btn__el--portraitOnly'}>
                <Btn
                  title={'Santé'}
                  action={() => redirectTo('/horde/health')}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Repos'}
                  action={() => redirectTo('stop/horde/rest')}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Soigner'}
                  action={() => redirectTo('stop/horde/heal')}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Cadence'}
                  action={() => redirectTo('stop/horde/pacing')}
                />
              </li>
            </ul>
          </nav>

          <div className={'managementSection__rightPanel'}>
            <Campfire className={'Test'}/>
          </div>

        </div>

        <nav className={'managementSection__navbar'}>
          <ul className={'navbar__link__li'}>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link'} to={'/stop/landmark'}>Lieu</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link navbar__link--active'} to={'/stop/horde'}>Horde</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link'}  to={'/stop/resources'}>Matériel</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link'}  to={'/stop/camp'}>Camp</Link>
            </li>
            <li className={'navbar__link__el  navbar__link__el--toOptions'}>
              <Link className={'navbar__link navbar__link--toOptions'}  to={'/options'}>Options</Link>
            </li>
          </ul>
        </nav>

      </div>
    );
  }
}

export default Horde;