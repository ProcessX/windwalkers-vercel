import React, {Component} from 'react';

class Healthbar extends Component {


  getIndicatorColor = (maxHealth, health) => {
    if((health / maxHealth) < 0.25){
      return 'red';
    }

    if((health / maxHealth) < 0.5){
      return '#F0C500';
    }

    return '#12CA07';
  }


  render() {
    const {maxHealth, health} = this.props;

    const indicatorColor = this.getIndicatorColor(maxHealth, health);

    const indicatorStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: `${(health / maxHealth) * 100}%`,
      backgroundColor: indicatorColor,
    };

    return (
      <div className={'healthbar'}>
        <div className={'healthbar__indicator'} style={indicatorStyle}></div>
      </div>
    );
  }
}

export default Healthbar;