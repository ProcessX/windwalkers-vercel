import React, {Component} from 'react';
import TravelHordeMember from "./TravelHordeMember";

class TravelHorde extends Component {


  displayHorde = () => {
    const {horde} = this.props;
    let members = [];

    horde.members.map((member, i) => {
      members.push(<TravelHordeMember
        key={i}
        name={member.firstname}
        health={member.health}
        crippled={member.crippled}
      />);
    });

    return members;
  }


  render() {
    return (
      <div className={'travel__interface__content__sub travel__horde'}>
        {this.displayHorde()}
      </div>
    );
  }
}

export default TravelHorde;