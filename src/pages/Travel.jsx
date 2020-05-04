import React, {Component} from 'react';
import TravelInterface from "../components/TravelInterface";
import TravelScene from "../components/TravelScene";

class Travel extends Component {
  constructor() {
    super();
    this.state = {
      walking: false,
      walkingDistance: 0,
      requestingStop: false,
      eventSequence: [],

    }
  }


  //Lance la marche de la Horde.
  startWalking = () => {
    let {walking, walkingDistance} = this.state;
    walking = true;
    walkingDistance = this.getWalkingDistance();
    this.setState({walking: walking, walkingDistance: walkingDistance}, this.stopWalking);
  }


  //Stop la marche de la Horde.
  stopWalking = () => {
    let {walking} = this.state;
    walking = false;
    this.setState({walking: walking}, this.addDistanceTraveled());
  }


  //Ajoute la distance parcourue lors du tour, puis appelle la fonction chargée de gérer les événements aléatoires.
  addDistanceTraveled = () => {
    let {walkingDistance} = this.state;
    this.props.addDistanceTraveled(walkingDistance, this.checkNextEvent());
  }


  //Vérifie la présence d'un événement.
  checkNextEvent = () => {
    let {requestingStop, eventSequence} = this.state;

    if(!eventSequence[0]){
      if(this.getWalkingDistance() <= 0){
        console.log('Destination atteinte');
        this.quitWalking('/stop/location');
      }
      else{
        if(requestingStop){
          this.quitWalking('/stop/camp');
        }
      }
    }
  }


  //Calcule et renvoit la cadence de marche réelle, avec bonus/malus.
  getWalkingDistance = () => {
    let {horde} = this.props;
    let walkingDistance = Math.min(this.getRemainingDistance(), horde.pacing);

    return walkingDistance;
  }


  //Fait la demande d'un arrêt. Si la Horde est en marche, il faudra attendre la fin de la marche pour que l'arrêt soit effectif.
  requestStop = () => {
    let {walking, requestingStop, eventSequence} = this.state;
    if(!walking && !eventSequence[0]){
      this.quitWalking('/stop/camp');
    }
    else{
      requestingStop = true;
      this.setState({requestingStop: requestingStop});
    }
  }


  //Redirige la navigation vers une autre page.
  quitWalking = (url) => {
    this.props.redirectTo(url);
  }


  //Renvoit la distance entre la Horde et l'étape suivante.
  getRemainingDistance = () => {
    let {distanceTraveled, nextLocation} = this.props;
    return nextLocation.distanceFromStart - distanceTraveled;
  }


  render() {

    return (
      <div className={'page page--travel'}>
        <TravelScene/>
        <TravelInterface/>
        {/*}
        <button onClick={() => this.startWalking()}>Walk</button>
        <button onClick={() => this.requestStop()}>Quit travelling</button>
        {*/}
      </div>
    );
  }
}

export default Travel;