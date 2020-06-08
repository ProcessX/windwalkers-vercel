import React, {Component} from 'react';
import Healthbar from "./Healthbar";

let characters = [];

class Campfire extends Component {

  componentDidMount() {
    characters = document.getElementsByClassName('campfire__character');
  }


  toggleHoverCharacter = (characterIndex) => {
    for(let i = 0; i < characters.length; i++){
      if(i === characterIndex){
        characters[i].classList.toggle('campfire__character--highlight');
      }
      else{
        characters[i].classList.toggle('campfire__character--atenuated');
      }
    }
  }


  displayCharacters = () => {
    const {horde} = this.props;
    let characters = [];

    characters.push(horde.members.map((member, i) => {
      let characterName = member.firstname;
      if(member.lastname)
        characterName += ` ${member.lastname}`;

      let symbolClassSpecial;
      if(i === 4)
        symbolClassSpecial = 'campfire__character__symbol--caracole';
      if(i === 5)
        symbolClassSpecial = 'campfire__character__symbol--coriolis';

      let backgroundURL = `url(${process.env.PUBLIC_URL}/assets/mugshots/Mugshot-${member.firstname}`;
      let backgroundAltURL = backgroundURL + '-alt';


      let character =
        <li className={'campfire__el campfire__character'} key={i}
            onMouseEnter={() => this.toggleHoverCharacter(i)}
            onMouseLeave={() => this.toggleHoverCharacter(i)}>
          <div className={'campfire__character__mugshot pixelArt'} style={{backgroundImage: `${backgroundURL}.png`}}>
            <div className={'campfire__character__mugshot--alt pixelArt'} style={{backgroundImage: `${backgroundAltURL}.png`}}></div>
          </div>
          <Healthbar className={'healthbar'} maxHealth={100} health={member.health}/>
          <div className={'campfire__character__info'}>
            <p className={'campfire__character__name'}>{characterName}</p>
            <p className={`campfire__character__symbol ${symbolClassSpecial}`}>{member.symbol}</p>
            <p className={`campfire__character__purpose`}>{member.purpose}</p>
          </div>
        </li>;

      return character;
    }));

    return characters;
  }


  render() {
    const {title, action} = this.props;

    const campfireCharacters = this.displayCharacters();

    return (
      <ul className={'campfire'}>
        {campfireCharacters}
        <div className={'campfire__el campfire__illu'}></div>
      </ul>

    );
  }
}

export default Campfire;