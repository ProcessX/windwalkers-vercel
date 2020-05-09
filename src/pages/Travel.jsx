import React, {Component} from 'react';
import TravelInterface from "../components/TravelInterface";
import TravelScene from "../components/TravelScene";

import {randomEvents} from "../data/randomEvents.json";

const randomEventChance = 0.2;

const walkingTime = 3;
let walkingTimer;



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


  componentDidMount() {
    this.setupEventSequence();
  }

  componentWillUnmount() {
    clearTimeout(walkingTimer);
  }


  setupEventSequence = () => {
    const {nextLocation, distanceTraveled} = this.props;
    let {eventSequence} = this.state;

    if((nextLocation.distanceFromStart - nextLocation.distanceFromPrevious) === distanceTraveled){
      if(nextLocation.eventOnLeaving)
        eventSequence = nextLocation.eventOnLeaving;
    }

    this.setState({eventSequence: eventSequence}, this.checkNextEvent);
  }


  //Lance la marche de la Horde.
  startWalking = () => {
    const {nextLocation} = this.props;
    let {walking, walkingDistance, eventSequence} = this.state;
    walking = true;
    walkingDistance = this.getWalkingDistance();

    if(walkingDistance < this.getRemainingDistance()){

      for(let i = 0; i < nextLocation.eventOnWalking.length; i++){
        if(nextLocation.eventOnWalking[i][0]){
          eventSequence = nextLocation.eventOnWalking[i];
          break;
        }
      }

      if(!eventSequence[0])
        eventSequence = [this.getRandomEvent()];
    }
    else{
      eventSequence = nextLocation.eventOnArriving;
    }

    this.setState(
      {walking: walking, walkingDistance: walkingDistance, eventSequence: eventSequence},
      () => walkingTimer = window.setTimeout(this.stopWalking, walkingTime * 1000));
  }


  //Stop la marche de la Horde.
  stopWalking = () => {
    let {walking} = this.state;
    walking = false;
    this.setState({walking: walking}, this.addDistanceTraveled());

    this.checkNextEvent();
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
        this.props.reachLandmark();
        //this.quitWalking('/stop/');
      }
      else{
        if(requestingStop){
          this.quitWalking('/stop/horde');
        }
        else{
          this.startWalking();
        }
      }
    }
    else{
      this.applyEvent();
    }
  }


  applyEvent = () => {
    let {eventSequence} = this.state;
    const {horde, hurtMember} = this.props;


    if(eventSequence[0].damage){
      let victimIndex = this.getRandomInt(horde.members.length);
      hurtMember(victimIndex, eventSequence[0].damage);
      let victim = horde.members[victimIndex];
      eventSequence[0].message = eventSequence[0].message.replace(/%victim%/, victim.firstname);
    }

    this.setState({eventSequence: eventSequence});
  }


  removeEvent = () => {
    let {eventSequence} = this.state;
    eventSequence.shift();
    this.setState({eventSequence: eventSequence}, this.checkNextEvent);

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
      this.quitWalking('/stop/horde');
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


  getRandomEvent = () => {
    console.log('Get Random Event');
    if(Math.random() >= randomEventChance)
      return randomEvents[this.getRandomInt(randomEvents.length)];

    console.log('No random event');

    return null;
  }


  getRandomInt = (max) => {
    return Math.floor(
      Math.random() * max
    );
  }


  render() {
    const {eventSequence, walking} = this.state;
    const {horde, inventary, nextLocation, distanceTraveled} = this.props;

    return (
      <div className={'page page--travel'}>
        <TravelScene
          walkingTime={walkingTime}
          horde={horde}
          event={eventSequence[0]}
          nextLocation={nextLocation}
          distanceTraveled={distanceTraveled}
          walking={walking}
          removeEvent={() => this.removeEvent()}
        />
        <TravelInterface
          horde={horde}
          requestStop={() => this.requestStop()}
        />
      </div>
    );
  }
}

export default Travel;