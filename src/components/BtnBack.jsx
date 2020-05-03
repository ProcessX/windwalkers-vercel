import React, {Component} from 'react';

class BtnBack extends Component {
  goBack = () => {
    window.history.back();
  }

  render() {
    return (
      <div className={'btn btn--oldSchool btn--oldSchool--back'} onClick={() => this.goBack()}>
        {'<'}
      </div>
    );
  }
}


export default BtnBack;