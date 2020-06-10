import React, {Component} from 'react';
import Btn from "../../components/Btn";
import {Link} from "react-router-dom";
import TutorialPanel from "../../components/tutorialPanel";

class Landmark extends Component {
  render() {
    const {redirectTo, tutorial, validateTutorial} = this.props;

    return (
      <div className={'page page--managementSection'}>

        {tutorial.landmark[0] ? <TutorialPanel content={tutorial.landmark[0]} validateTutorial={() => validateTutorial()}/> : null}

        <div className={'managementSection__content'}>

          <h2 className={'title title--size1 title--center managementSection__title'}>Lieu</h2>

          <nav className={'managementSection__menu'}>
            <ul className={'menu__btn__li'}>
              <li className={'menu__btn__el'}>
                <Btn
                  title={'Marché'}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Explorer'}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Rencontres'}
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
              <Link className={'navbar__link navbar__link--active'} to={'/stop/landmark'}>Lieu</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={`navbar__link ${tutorial.horde[0] ? 'navbar__link--tuto' : ''}`} to={'/game/stop/horde'}>Horde</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={`navbar__link ${tutorial.resources[0] ? 'navbar__link--tuto' : ''}`}  to={'/game/stop/resources'}>Matériel</Link>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={`navbar__link ${tutorial.camp[0] ? 'navbar__link--tuto' : ''}`}  to={'/game/stop/camp'}>Camp</Link>
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


export default Landmark;