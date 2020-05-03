import React, {Component} from 'react';

let characters = [];

class Campfire extends Component {

  componentDidMount() {
    characters = document.getElementsByClassName('campfire__character');
    for(let i = 0; i < characters.length; i++){
      characters[i].addEventListener('mouseenter', () => this.toggleHoverCharacter(i));
      characters[i].addEventListener('mouseout', () => this.toggleHoverCharacter(i));
      characters[i].addEventListener('touchstart', () => this.toggleHoverCharacter(i));
    }
  }

  toggleHoverCharacter = (characterIndex) => {
    console.log('Hover character nbr ' + characterIndex);
    for(let i = 0; i < characters.length; i++){
      if(i === characterIndex){
        characters[i].classList.toggle('campfire__character--highlight');
      }
      else{
        characters[i].classList.toggle('campfire__character--atenuated');
      }
    }
  }

  render() {
    const {title, action} = this.props;

    return (
      <ul className={'campfire'}>
        <li className={'campfire__el campfire__character'} >
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <li className={'campfire__el campfire__character'}>
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <li className={'campfire__el campfire__character'}>
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <li className={'campfire__el campfire__character'}>
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <li className={'campfire__el campfire__character'}>
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <li className={'campfire__el campfire__character'}>
          <div className={'campfire__character__mugshot'}></div>
          <div className={'campfire__character__healthbar'}></div>
        </li>
        <div className={'campfire__el campfire__illu'}></div>
      </ul>

    );
  }
}

export default Campfire;