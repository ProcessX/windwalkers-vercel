import React, {Component} from 'react';
import Btn from "./Btn";
import Parallaxe from "./Parallaxe";

class TravelScene extends Component {

  nextMessage = () => {
  }


  render() {
    const {horde, walkingTime, distanceTraveled, nextLocation, walking, event, removeEvent, progressIndex, windStrength, stormwind} = this.props;
    let messageClass = 'travel__scene__message--hidden';
    let messageContent = 'Message';
    let messageSpeaker;
    let speakerMugshotURL = `url(${process.env.PUBLIC_URL}/assets/mugshots/Mugshot-`;
    let speakerMugshotStyle;

    let messageType = 'message';
    if(!walking){
      if(event){
        messageClass = "";
        messageContent = event.message

        if(event.speaker){
          messageType = 'dialog';
          messageSpeaker = event.speaker;
          speakerMugshotURL += `${event.speaker}.png`;
          speakerMugshotStyle = {
            backgroundImage: speakerMugshotURL,
          }
        }
      }
    }

    return (
      <div className={"travel__scene"} style={{width: '100%', height: '50vh'}}>
        <Parallaxe
          stormwind={stormwind}
          windStrength={windStrength}
          walkingTime={walkingTime}
          distanceTraveled={distanceTraveled}
          nextLocation={nextLocation}
          horde={horde}
          walking={walking}
          progressIndex={progressIndex}
        />

        <div className={`travel__scene__message ${messageClass}`} data-messagetype={messageType}>
          <div className={'message__speaker'}>
            <div className={'message__speaker__mugshot pixelArt'} style={speakerMugshotStyle}></div>
            <p className={'message__speaker__name'}>{messageSpeaker}</p>
          </div>
          <p className={'message__content'}>{messageContent}</p>
          <Btn title={'Suivant'} action={() => removeEvent()}/>
        </div>
      </div>
    );
  }
}

export default TravelScene;