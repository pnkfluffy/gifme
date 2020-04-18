import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import BorderRightIcon from "@material-ui/icons/BorderRight";

class PrintedSticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moveClicked: false,
      prevX: 0,
      prevY: 0,
      myX: 0,
      myY: 0,
      resizeClicked: false,
      myWidth: 150,
    };
    this.moveMouseDown = this.moveMouseDown.bind(this);
    this.removeSticker = this.removeSticker.bind(this);
    this.resizeMouseDown = this.resizeMouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.selectSticker = this.selectSticker.bind(this);
  }

  //  mouse handles to move the stickers
  moveMouseDown(e) {
    //  stop default browser answer:
    e.preventDefault();
    e.stopPropagation();
    this.selectSticker();
    //  get mouse start position
    this.setState({
      moveClicked: true,
    });
  }
  handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    //  get mouse position in page (means that counts the outside spaces)
    const x = e.pageX;
    const y = e.pageY;
    console.log('pageX-m', e.pageX);
    console.log('pageY-m', e.pageY);


    //  gets the x and y relative to the stickerCanvas div
    //  checks side that mouse is moving and moves in the WebcamContext

    const xMouseDiff = (this.state.prevX - x);
    const yMouseDiff = (this.state.prevY - y);

    const xDelta = x - this.state.prevX;
    const newXPos = this.state.myX + xDelta + xMouseDiff;
    const yDelta = this.state.prevY - y;
    const newYPos = this.state.myY + yDelta + yMouseDiff;
    //  ADD UPBORDER WITH HEIGHT
    const rightBorder = newXPos + this.state.myWidth;
    if (
      this.state.prevX !== 0 &&
      this.state.prevX !== x &&
      rightBorder < 500 &&
      newXPos > -100
    ) {
      this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
      this.setState({
        myX: newXPos,
        prevX: x,
      });
    }
    //  UP moves by yDelta
    if (
      this.state.prevY !== 0 &&
      this.state.prevY !== y &&
      newYPos > -100 &&
      newYPos < 400
    ) {
      this.context.moveStickerY(this.props.stickerObject.zPos, yDelta);
      this.setState({
        myY: newYPos,
        prevY: y,
      });
    }

    if (this.state.prevX === 0) this.setState({ prevX: x });
    if (this.state.prevY === 0) this.setState({ prevY: y });
  }
  removeSticker(e) {
    e.preventDefault();
    e.stopPropagation();
    this.context.removeSticker(this.props.stickerObject.zPos);
  }

  // -----------------------------------------------------------------------

  //  mouse handles to resize the stickers
  resizeMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      resizeClicked: true,
    });
  }
  resizeMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    //  get mouse position in page based off width and added canvas size
    const rightBorder = e.pageX;

    const prevResizeX = this.state.myX + this.state.myWidth;
    // const xMouseDiff = (this.state.prevX - newResizeX);

    const widthDelta = rightBorder - prevResizeX;

    // ADD UPBORDER WITH HEIGHT
    const resizedWidth = widthDelta + this.state.myWidth;
    //  makes sure size change is within bounds
    
    console.log(widthDelta, resizedWidth);
    console.log('limiters', prevResizeX, rightBorder);
    console.log('<500', rightBorder);
    console.log('>45', resizedWidth);

    if (
      prevResizeX !== rightBorder &&
      rightBorder < 500 &&
      // limits the smallest size possible
      resizedWidth > 45
      //ADD CHECKS FOR Y DIMENSION
    ) {
      this.context.resizeSticker(this.props.stickerObject.zPos, widthDelta);
      this.setState({
        myWidth: resizedWidth,
      });
    }
  }

  mouseMove(e) {
    if (this.state.moveClicked === true) {
      this.handleMouseMove(e);
    } else if (this.state.resizeClicked === true) {
      this.resizeMouseMove(e);
    }
  }

  selectSticker() {
    this.context.selectSticker(this.props.stickerObject.zPos);
  }

  mouseUp() {
    this.setState({ resizeClicked: false });
    this.setState({ moveClicked: false });
  }
  componentDidMount() {
    window.addEventListener("mouseup", this.mouseUp);
    window.addEventListener("mousemove", this.mouseMove);
  }

  render() {
    if (this.props.stickerObject) {
      return (
        <div
          className="printed_sticker_holder"
          style={{
            position: "absolute",
            bottom: this.props.stickerObject.yPos,
            left: this.props.stickerObject.xPos,
            height: this.props.stickerObject.height,
            width: this.props.stickerObject.width,
          }}
          onMouseDown={this.moveMouseDown}
        >
          {this.context.selectedIndex == this.props.stickerObject.zPos ? (
            <div className="sticker_interact_overlay">
              <HighlightOffIcon
                className="sticker_delete"
                onClick={this.removeSticker}
              />
              <BorderRightIcon
                className="sticker_resize"
                onMouseDown={this.resizeMouseDown}
              />
            </div>
          ) : null}
          <img src={this.props.stickerObject.imgUrl} alt="new" />
        </div>
      );
    } else {
      return null;
    }
  }
}

PrintedSticker.contextType = WebcamContext;
export default PrintedSticker;
