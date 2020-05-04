import React, {Component} from 'react';
import Btn from "./Btn";
import Parallaxe from "./Parallaxe";

class TravelScene extends Component {

  nextMessage = () => {
    console.log('Next Message');
  }


  render() {
    return (
      <div className={"travel__scene"} style={{width: '100%', height: '50vh'}}>
        {/*}
        <div className={'travel__scene__render'}></div>
        {*/}
        <Parallaxe/>
        {/*}
        <div className={'travel__scene__message'} data-messagetype={'dialog'}>
          <div className={'message__speaker'}>
            <div className={'message__speaker__mugshot'}></div>
            <p className={'message__speaker__name'}>Caracole</p>
          </div>
          <p className={'message__content'}>Content</p>
          <Btn title={'Suivant'} action={() => this.nextMessage()}/>
        </div>
        {*/}
      </div>
    );
  }
}

export default TravelScene;