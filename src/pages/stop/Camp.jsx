import React, {Component} from 'react';
import Btn from "../../components/Btn";
import {Link, Redirect} from "react-router-dom";
import TutorialPanel from "../../components/tutorialPanel";

class Camp extends Component {

  constructor() {
    super();
    this.state={
      redirectURL: null,
    }
  }

  redirectTo = (url) => {
    let {redirectURL} = this.state;
    redirectURL = url;
    this.setState({redirectURL});
  }



  render() {
    const {redirectTo, tutorial, validateTutorial, nextLocation, distanceTraveled} = this.props;
    const {redirectURL} = this.state;

    const iconBaseURL = `${process.env.PUBLIC_URL}/assets/icons`;

    const campIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Fire.png)`,
    }

    const resourcesIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Resources.png)`,
    }

    const hordeIcon = {
      backgroundImage: `url(${iconBaseURL}/Icon-Horde.png)`,
    }

    return (
      <div className={'page page--managementSection'}>

        {tutorial.camp[0] ? <TutorialPanel content={tutorial.camp[0]} validateTutorial={() => validateTutorial()}/> : null}

        <div className={'managementSection__content'}>
          <div className={'managementSection__illu'}>Section's illu</div>

          <h2 className={'title title--size1 title--center managementSection__title'}>Camp</h2>

          <nav className={'managementSection__menu'}>
            <ul className={'menu__btn__li'}>
              <li className={'menu__btn__el'}>
                <Btn
                  title={'Carte'}
                />
              </li>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Guide'}/>
              </li>

              <p className={'menu__distanceIndicator'}>Prochain arrêt : {nextLocation.distanceFromStart - distanceTraveled} km</p>

              <li className={'menu__btn__el'}>
                <Btn
                  title={'Repartir'}
                  action={() => this.redirectTo('/travel')}
                />
              </li>
            </ul>
          </nav>

          <div className={'managementSection__rightPanel'}>
            <div className={'camp__illu'}>Camp Illu</div>
          </div>

        </div>

        <nav className={'managementSection__navbar'}>
          <ul className={'navbar__link__li'}>
            {/*}
            <li className={`navbar__link__el`}>
              <Link className={`navbar__link ${tutorial.landmark[0] ? 'navbar__link--tuto' : ''}`} to={'/stop/landmark'}>Lieu</Link>
            </li>
            {*/}
            <li className={'navbar__link__el'}>
              <Link className={`navbar__link ${tutorial.horde[0] ? 'navbar__link--tuto' : ''}`} to={'/stop/horde'}>Horde</Link>
              <div className={'navbar__link__illu'} style={hordeIcon}></div>
            </li>
            <li className={'navbar__link__el'}>
              <Link className={`navbar__link ${tutorial.resources[0] ? 'navbar__link--tuto' : ''}`}  to={'/stop/resources'}>Matériel</Link>
              <div className={'navbar__link__illu'} style={resourcesIcon}></div>
            </li>
            <li className={'navbar__link__el navbar__link__el--active'}>
              <Link className={'navbar__link navbar__link--active'}  to={'/stop/camp'}>Camp</Link>
              <div className={'navbar__link__illu'} style={campIcon}></div>
            </li>
            {/*}
            <li className={'navbar__link__el  navbar__link__el--toOptions'}>
              <Link className={'navbar__link navbar__link--toOptions'}  to={'/options'}>Options</Link>
            </li>
            {*/}
          </ul>
        </nav>

        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Camp;