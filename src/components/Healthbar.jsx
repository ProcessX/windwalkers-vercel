import React, {Component} from 'react';

class Healthbar extends Component {


  getIndicatorClass = () => {
    const {maxHealth, health} = this.props;
    let indicatorClass = '';

    if((health / maxHealth) < 0.25){
      indicatorClass = 'healthbar__indicator--endLife';
    }
    else{
      if((health / maxHealth) < 0.5){
        indicatorClass = 'healthbar__indicator--midLife';
      }
    }

    return indicatorClass;
  }


  render() {
    const {maxHealth, health} = this.props;

    const indicatorClass = this.getIndicatorClass();

    const indicatorStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${(health / maxHealth) * 100}%`,
    };

    return (
      <div className={'healthbar'}>
        <div className={`healthbar__indicator ${indicatorClass}`} style={indicatorStyle}></div>
      </div>
    );
  }
}

export default Healthbar;