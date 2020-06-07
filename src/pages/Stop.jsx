import React, {Component} from 'react';
import Btn from "../components/Btn";

const baseURL = process.env.PUBLIC_URL + "/assets/landmarks";

class Stop extends Component {

  componentDidMount() {
    let {currentLocation} = this.props;
    console.log(currentLocation.url.toLowerCase());
    this.props.playMusic(`landmark-${currentLocation.url.toLowerCase()}`);
  }

  render() {
    const {nextLocation, accessLandmark, currentLocation} = this.props;
    const illu = {
      backgroundImage: `url(${baseURL}/${currentLocation.url}-Illu.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };

    return (
      <div className={'page page--stop'}>
        <div className={'illu stop__illu'} style={illu}></div>
        <h2 className={'stop__landmarkName'}>{currentLocation.name}</h2>
        <Btn title={'Continuer'} action={() => accessLandmark()}/>
      </div>
    );
  }
}

export default Stop;