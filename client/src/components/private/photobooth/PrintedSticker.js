import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";

class PrintedSticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      prevX: 0,
      prevY: 0,
      myX: 0,
      myY: 0
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  //  mouse handles to move the stickers
  handleMouseDown(e) {
    //  stop default browser answer:
    e.preventDefault();
    e.stopPropagation();
    //  get mouse start position
    this.setState({
      clicked: true
    });
  }
  handleMouseUp() {
    this.setState({ clicked: false });
  }
  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    //  get mouse movement IF clicked is on
    if (this.state.clicked === true) {
      //  get mouse position in page (means that counts the outside spaces)
      const x = e.pageX;
      const y = e.pageY;
      //  gets the x and y relative to the stickerCanvas div
      //  checks side that mouse is moving and moves in the WebcamContext
      //  RIGHT moves +1 * how much moved. Does not move if out of canvas
      if (
        this.state.prevX !== 0 &&
        this.state.prevX !== x &&
        this.state.prevX < x &&
        this.state.myX + (x - this.state.prevX) < 335
      ) {
        this.context.moveStickerX(
          this.props.stickerObject.zPos,
          x - this.state.prevX
        );
        //  need to change myX and myY to keep the x and ys from the PARENT DIV (the canvas) so the images
        //  cant move to outside of the canvas!!!
        this.setState({
          myX: this.state.myX + (x - this.state.prevX),
          prevX: x
        });
      }
      //  LEFT moves -1 * how much moved
      else if (
        this.state.prevX !== 0 &&
        this.state.prevX !== x &&
        this.state.prevX > x &&
        this.state.myX - (this.state.prevX - x) > 0
      ) {
        this.context.moveStickerX(
          this.props.stickerObject.zPos,
          -1 * (this.state.prevX - x)
        );
        this.setState({
          myX: this.state.myX - (this.state.prevX - x),
          prevX: x
        });
      }
      //  UP moves +1 * how much moved
      if (
        this.state.prevY !== 0 &&
        this.state.prevY !== y &&
        this.state.prevY > y &&
        this.state.myY + (this.state.prevY - y) < 335
      ) {
        this.context.moveStickerY(
          this.props.stickerObject.zPos,
          this.state.prevY - y
        );
        this.setState({
          myY: this.state.myY + (this.state.prevY - y),
          prevY: y
        });
      }

      //  DOWN moves -1 * how much moved
      else if (
        this.state.prevY !== 0 &&
        this.state.prevY !== y &&
        this.state.prevY < y &&
        this.state.myY - (y - this.state.prevY) > 0
      ) {
        this.context.moveStickerY(
          this.props.stickerObject.zPos,
          -1 * (y - this.state.prevY)
        );
        this.setState({
          myY: this.state.myY - (y - this.state.prevY),
          prevY: y
        });
      }

      if (this.state.prevX === 0) this.setState({ prevX: x });
      else if (this.state.prevY === 0) this.setState({ prevY: y });
    }
  }
  handleMouseOut() {
    this.setState({ clicked: false });
  }

  render() {
    return (
      <img
        src={this.props.stickerObject.imgUrl}
        alt="new"
        style={{
          position: "absolute",
          bottom: this.props.stickerObject.yPos,
          left: this.props.stickerObject.xPos,
          height: "100px",
          width: "100px"
        }}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
        onMouseOut={this.handleMouseOut}
      />
    );
  }
}

PrintedSticker.contextType = WebcamContext;
export default PrintedSticker;
