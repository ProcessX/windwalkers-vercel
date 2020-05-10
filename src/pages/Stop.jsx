import React, {Component} from 'react';
import Btn from "../components/Btn";


class Stop extends Component {

  render() {
    const {nextLocation, accessLandmark} = this.props;

    return (
      <div className={'page page--stop'}>
        <div className={'stop__illu'}>Landmark's Illu</div>
        <h1 className={'stop__landmarkName'}>{nextLocation.name}</h1>
        <Btn title={'Continuer'} action={() => accessLandmark()}/>
      </div>
    );
  }
}

export default Stop;