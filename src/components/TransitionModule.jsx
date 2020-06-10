import React, {Component} from 'react';

class TransitionModule extends Component {

  curtain;
  transitionTimer;

  componentDidMount() {
    this.curtain = document.querySelector('.transitionModule__curtain');
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.startTransition !== this.props.startTransition){
      this.initTransition();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.transitionTimer);
  }

  initTransition = () => {
    this.curtain.addEventListener('transitionend', this.endTransition);
  }


  endTransition = () => {
    console.log('End Transition');
    this.transitionTimer = window.setTimeout(() => this.props.callback(), 500);
  }


  render() {
    const {startTransition} = this.props;
    const curtainClass = startTransition ? 'transitionModule__curtain--closing' : '';

    return (
      <div className={'transitionModule'}>
        <div className={`transitionModule__curtain ${curtainClass}`}>
          <div className={'curtain__elem curtain__elem--hor curtain__elem--top'}>Top</div>
          <div className={'curtain__elem curtain__elem--ver curtain__elem--right'}>Right</div>
          <div className={'curtain__elem curtain__elem--hor curtain__elem--bottom'}>Bottom</div>
          <div className={'curtain__elem curtain__elem--ver curtain__elem--left'}>Left</div>
        </div>
      </div>
    );
  }
}

export default TransitionModule;