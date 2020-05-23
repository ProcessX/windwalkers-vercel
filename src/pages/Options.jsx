import React, {Component} from 'react';

import InputRange from "react-input-range";
import 'react-input-range/lib/css/index.css';

const volumeMax = 100;

class Options extends Component {


  setSoundEffectVolume = (volume) => {
    this.props.setSoundEffectVolume(volume / volumeMax);
  }


  setMusicVolume = (volume) => {
    this.props.setMusicVolume(volume / volumeMax);
  }


  render() {
    const {audioManager, musicVolume, soundEffectVolume} = this.props;

    return (
      <div className={'page page--options'}>
        <h1>Options</h1>
        <ul className={'option__input__li'}>
          <li className={'option__input__el'}>
            <p className={'option__input__title'}>Musique</p>
            <InputRange onChange={(volume) => this.setMusicVolume(volume)} value={musicVolume * volumeMax} minValue={0} maxValue={volumeMax}/>
          </li>
          <li className={'option__input__el'}>
            <p className={'option__input__title'}>Bruitages</p>
            <InputRange onChange={(volume) => this.setSoundEffectVolume(volume)} value={soundEffectVolume * volumeMax} minValue={0} maxValue={volumeMax}/>
          </li>
        </ul>
      </div>
    );
  }
}

export default Options;