import React, {Component} from 'react';
import Btn from "../../components/Btn";
import {Link} from "react-router-dom";

class Resources extends Component {
  render() {
    const {redirectTo} = this.props;

    return (
      <div className={'page page--managementSection'}>
        <div className={'managementSection__content'}>
          <div className={'managementSection__illu'}>Section's illu</div>

          <h2 className={'title title--size1 title--center managementSection__title'}>Resources</h2>

          <nav className={'managementSection__menu'}>
            <ul className={'menu__btn__li'}>
              <li className={'menu__btn__el'}>
                <Btn
                  title={'Récolter'}
                  action={() => redirectTo('/minigame/')}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Rations'}
                />
              </li>
            </ul>
          </nav>

          <div className={'managementSection__rightPanel'}>
            <div className={'camp__illu'}>Resources Illu</div>
          </div>

        </div>

        <nav className={'managementSection__navbar'}>
          <ul className={'navbar__link__li'}>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link'} to={'/stop/landmark'}>Lieu</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link'} to={'/stop/horde'}>Horde</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={'navbar__link navbar__link--active'}  to={'/stop/resources'}>Matériel</Link>
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


export default Resources;