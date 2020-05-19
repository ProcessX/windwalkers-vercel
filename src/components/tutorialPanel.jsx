import React, {Component} from 'react';
import Btn from "./Btn";

class TutorialPanel extends Component {


  validate = () => {
    const {validateTutorial} = this.props;
    validateTutorial();
  }


  displayText = () => {
    const {content} = this.props;

    let splitText = content.text.split('\n');

    let paragraphs = splitText.map((paragraph, i) => {
      return <p className={'tutorial__text'} key={i}>{paragraph}</p>;
    });

    return paragraphs;
  }


  render() {
    const text = this.displayText();
    const {validateTutorial} = this.props;

    return (
      <div className={'tutorial'}>
        <div className={'tutorial__panel'}>
          <h2 className={'tutorial__title'}>Tutoriel</h2>
          {text}
          <Btn title={'Compris'} action={() => validateTutorial()}/>
        </div>
      </div>
    );
  }
}

export default TutorialPanel;