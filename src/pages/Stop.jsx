import React, {Component} from 'react';
import Btn from "../components/Btn";


class Stop extends Component {

  render() {
    const {nextLocation, accessLandmark} = this.props;

    return (
      <div className={'page page--stop'}>
        <div className={'stop__illu'}>Landmark's Illu</div>
        <h1 className={'stop__landmarkName'}>{nextLocation.name}</h1>
        {/*}
        <p className={'stop__instructions stop__instructions--mobile'}>APPUYER pour continuer</p>
        <p className={'stop__instructions stop__instructions'}>CLIQUER pour continuer</p>
        {*/}
        <Btn title={'Continuer'} action={() => accessLandmark()}/>
      </div>
    );
  }
}

export default Stop;