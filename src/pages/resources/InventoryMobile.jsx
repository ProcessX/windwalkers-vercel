import React, {Component} from 'react';
import BtnBack from "../../components/BtnBack";
import Inventory from "../../components/Inventory";

class InventoryMobile extends Component {
  render() {
    return (
      <div className={'page page--mobile page--inventoryMobile'}>
        <BtnBack redirectURL={'/stop/resources'}/>

        <Inventory inventory={this.props.inventory}/>
      </div>
    );
  }
}

export default InventoryMobile;