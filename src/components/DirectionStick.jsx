import React, {Component} from 'react';

class DirectionStick extends Component {
  
  interactiveArea;
  directionPointer;
  directionPointerData;

  componentDidMount() {
    this.interactiveArea = document.querySelector('.controller--directionStick');
    this.directionPointer = document.querySelector('.directionStick__pointer');
    this.directionPointerData = this.directionPointer.getBoundingClientRect();
  }


  moveStick = (e) => {
    let interactiveAreaData = this.interactiveArea.getBoundingClientRect();
    let interactiveAreaCenter = {
      x: interactiveAreaData.left + (interactiveAreaData.width / 2),
      y: interactiveAreaData.top + (interactiveAreaData.height / 2),
    }

    let touchCoordX = e.touches[0].clientX;
    let touchCoordY = e.touches[0].clientY;

    let offset = {
      x: touchCoordX - interactiveAreaCenter.x,
      y: touchCoordY - interactiveAreaCenter.y,
    }

    let directionPointerPinPoint = {
      x: (interactiveAreaData.width / 2) - (this.directionPointerData.width / 2),
      y: (interactiveAreaData.height / 2) - (this.directionPointerData.height / 2),
    }

    let angle = Math.atan(Math.abs(offset.y) / Math.abs(offset.x));
    let hyp = Math.min(interactiveAreaData.width / 2, Math.sqrt((offset.y * offset.y) + (offset.x * offset.x)));
    let adj = Math.cos(angle) * hyp;
    let op = Math.sin(angle) * hyp;

    this.directionPointer.style.left = directionPointerPinPoint.x + (Math.sign(offset.x) * adj) + 'px';
    this.directionPointer.style.top = directionPointerPinPoint.y + (Math.sign(offset.y) * op) + 'px';

    let input = {
      x: (Math.sign(offset.x) * adj) / hyp,
      y: (Math.sign(offset.y) * -op) / hyp,
    }

    this.props.sendInput(input);
  }


  resetStick = () => {
    let interactiveAreaData = this.interactiveArea.getBoundingClientRect();
    let interactiveAreaCenter = {
      x: interactiveAreaData.left + (interactiveAreaData.width / 2),
      y: interactiveAreaData.top + (interactiveAreaData.height / 2),
    }

    let directionPointerPinPoint = {
      x: (interactiveAreaData.width / 2) - (this.directionPointerData.width / 2),
      y: (interactiveAreaData.height / 2) - (this.directionPointerData.height / 2),
    }

    this.directionPointer.style.left = directionPointerPinPoint.x + 'px';
    this.directionPointer.style.top = directionPointerPinPoint.y + 'px';

    let input = {
      x: 0,
      y: 0,
    }

    this.props.sendInput(input);
  }




  render() {
    return (
      <div className={'controller controller--directionStick'} onTouchStart={(event => this.moveStick(event))} onTouchMove={(event => this.moveStick(event))} onTouchEnd={() => this.resetStick()}>
        <div className={'directionStick__pointer'}>Pointer</div>
      </div>
    );
  }
}

export default DirectionStick;