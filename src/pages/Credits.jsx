import React, {Component} from 'react';
import BtnBack from "../components/BtnBack";

class Credits extends Component {
  render() {
    return (
      <div className={'page page--credits'}>
        <BtnBack redirectURL={'/game/'}/>
        <section className={'credits__section'}>
          <h1>Crédits</h1>
          <p>Windwalkers est un projet scolaire mené dans le cadre de mes études en Développement Web et Mobile (HEAJ, 2020)</p>
          <p>Tous les droits du roman La Horde du Contrevent appartiennent à Alain Damasio et aux éditions La Volte.</p>
          <p>Remerciements à mes professeurs, qui m'auront poussé à donner le meilleur de moi, ainsi qu'à toute personne ayant contribué au projet.</p>
        </section>
        <section className={'credits__section'}>
          <h2>Sources</h2>
          <h3>Musiques et bruitages</h3>
          <h3>Technologie</h3>
          <ul className={'source__li'}>
            <li className={'source__el'}>
              <a href={'https://fr.reactjs.org/'} target={"_blank"} className={'source__link'}>React</a>
            </li>
            <li className={'source__el'}>
              <a href={'https://www.pixijs.com/'} target={"_blank"} className={'source__link'}>PixiJS</a>
            </li>
            <li className={'source__el'}>
              <a href={'https://github.com/davidchin/react-input-range'} target={"_blank"} className={'source__link'}>React Input Range</a>
            </li>
            <li className={'source__el'}>
              <a href={'https://howlerjs.com/'} target={"_blank"} className={'source__link'}>HowlerJS</a>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}

export default Credits;