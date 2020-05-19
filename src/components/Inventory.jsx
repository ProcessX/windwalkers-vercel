import React, {Component} from 'react';


class Inventory extends Component {

  displayResources = () => {
    const {inventory} = this.props;

    let resources = [];
    let item;

    item = <li className={'resource__el'} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/items/item-food.png)`}}>
      <p className={'resource__counter'}>{inventory.food}</p>
    </li>;
    resources.push(item);

    for(let i = 0; i < 5; i++){
      item = <li className={'resource__el resource__el--empty'}>
        <p className={'resource__counter'}>0</p>
      </li>;
      resources.push(item);
    }

    return resources;
  }

  render() {
    const resources = this.displayResources();

    return (
      <div className={'inventory'}>
        <ul className={'resource__li'}>
          {resources}
        </ul>
      </div>
    );
  }
}

export default Inventory;