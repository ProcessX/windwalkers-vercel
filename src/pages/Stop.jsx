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
    const {nextLocation, accessLandmark, currentLocation, progressIndex} = this.props;
    const illu = {
      backgroundImage: `url(${baseURL}/${currentLocation.url}-Illu.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };

    let pageStyle = progressIndex === 2 ? 'page--stop--white' : '';

    return (
      <div className={`page page--stop ${pageStyle}`}>
        <div className={'illu stop__illu pixelArt'} style={illu}></div>
        <h2 className={'stop__landmarkName'}>{currentLocation.name}</h2>
        <Btn title={'Continuer'} action={() => accessLandmark()}/>
      </div>
    );
  }
}

export default Stop;