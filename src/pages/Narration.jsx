import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';

import {chapters} from '../data/narration';
import Btn from "../components/Btn";

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
    }

  }


  nextChapter = () => {
    let {panelIndex, currentChapter} = this.state;
    console.log(currentChapter);
    panelIndex += 1;
    if(panelIndex < currentChapter.panelSequence.length){
      this.setState({panelIndex: panelIndex});
    }
    else{
      this.quitNarration();
    }
  }


  quitNarration = () => {
    console.log('Quit Narration');
    const {progressIndex} = this.props;
    let {redirectURL} = this.state;

    if(progressIndex === 0 || progressIndex === 1)
      redirectURL = '/travel/';

    this.setState({redirectURL: redirectURL});
  }


  displayText = (text) => {
    let splitText = text.split('\n');
    console.log(splitText);

    let paragraphs = splitText.map((paragraph, i) => {
      return <p className={'narration__text'} key={i}>{paragraph}</p>;
    });

    return paragraphs;
  }


  render() {
    const {redirectURL, currentChapter, panelIndex} = this.state;
    const panel = currentChapter.panelSequence[panelIndex];

    const text = this.displayText(panel.text);

    return (
      <div className={'page page--narration'}>
        <div className={'narration__illu'}></div>
        {text}
        <Btn action={() => this.nextChapter()} title={'Suivant'}/>
        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}

export default Narration;