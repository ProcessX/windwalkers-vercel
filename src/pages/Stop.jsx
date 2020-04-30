import React, {Component} from 'react';


class Stop extends Component {

  goToHorde = () => {
    document.body.setAttribute('data-stop-subsection', 'landmark');
    this.props.redirectTo('/stop/horde');
  }

  render() {
    const {redirectTo} = this.props;

    return (
      <div className={'page page--stop'} onClick={() => this.goToHorde()}>
        <div className={'stop__illu'}>Landmark's Illu</div>
        <h1 className={'stop__landmarkName'}>Landmark's Name</h1>
        <p className={'stop__instructions stop__instructions--mobile'}>APPUYER pour continuer</p>
        <p className={'stop__instructions stop__instructions--desktop'}>CLIQUER pour continuer</p>
      </div>
    );
  }
}

export default Stop;