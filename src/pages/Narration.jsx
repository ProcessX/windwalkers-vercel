import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';

import {chapters} from '../data/narration';
import Btn from "../components/Btn";
import TransitionModule from "../components/TransitionModule";


const illuRef = ['Intro', null, 'Stormwind'];


class Narration extends Component {

  constructor(props) {
    super(props);

    let currentChapter = chapters.find((chapter) => {
      return chapter.progressIndex === this.props.progressIndex;
    });

    this.state = {
      redirectURL: null,
      currentChapter: currentChapter,
      panelIndex: 0,
      startTransition: false,
    }

  }


  nextChapter = () => {
    let {panelIndex, currentChapter} = this.state;
    panelIndex += 1;
    if(panelIndex < currentChapter.panelSequence.length){
      this.setState({panelIndex: panelIndex});
    }
    else{
      this.startTransition();
    }
  }


  quitNarration = () => {
    const {progressIndex} = this.props;
    let {redirectURL} = this.state;

    if(progressIndex === 0 || progressIndex === 1)
      redirectURL = '/game/travel/';
    else{
      redirectURL = '/game/stop/horde';
    }

    this.setState({redirectURL: redirectURL});
  }


  displayText = (text) => {
    let splitText = text.split('\n');

    let paragraphs = splitText.map((paragraph, i) => {
      return <p className={'narration__text'} key={i}>{paragraph}</p>;
    });

    return paragraphs;
  }


  startTransition = () => {
    let {startTransition} = this.state;
    let{progressIndex} = this.props;

    startTransition = true;
    this.setState({startTransition});

    if(progressIndex === 2){
      this.props.crossFadeMusic('stop', 1000);
    }
    else{
      this.props.fadeOutMusic(1000);
    }
  }


  render() {
    const {redirectURL, currentChapter, panelIndex, startTransition} = this.state;
    const {progressIndex} = this.props;
    const panel = currentChapter.panelSequence[panelIndex];

    const text = this.displayText(panel.text);

    let illuStyle;

    if(illuRef[progressIndex]){
      let illuURL = `/assets/narration/${illuRef[progressIndex]}-Illu.png`;
      illuStyle = {
        backgroundImage: `url(${illuURL})`,
      }
    }

    let pageStyle = progressIndex === 2 ? 'page--narration--white' : '';

    return (
      <div className={`page page--narration ${pageStyle}`}>
        <TransitionModule startTransition={startTransition} callback={() => this.quitNarration()}/>

        <div className={'narration__illu illu pixelArt'} style={illuStyle}></div>
        {text}
        <Btn action={() => this.nextChapter()} title={'Suivant'}/>
        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Narration;