import React, {Component} from 'react';

class TravelInterfaceTab extends Component {
  render() {
    const {name} = this.props;

    return (
      <li>
        {name}
      </li>
    );
  }
}

export default TravelInterfaceTab;