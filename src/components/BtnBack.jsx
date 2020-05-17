import React, {Component} from 'react';
import {Redirect} from "react-router-dom";

class BtnBack extends Component {

  constructor() {
    super();
    this.state={
      redirectURL: null,
    }
  }

  goBack = () => {
    let {redirectURL} = this.state;
    redirectURL = this.props.redirectURL;
    this.setState({redirectURL});
  }

  render() {
    const {redirectURL} = this.state;

    return (
      <div className={'btn btn--oldSchool btn--oldSchool--back'} onClick={() => this.goBack()}>
        {'<'}
        {redirectURL ? <Redirect to={redirectURL}/> : null}
      </div>
    );
  }
}


export default BtnBack;