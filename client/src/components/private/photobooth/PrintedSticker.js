import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import BorderRightIcon from "@material-ui/icons/BorderRight";

class PrintedSticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      prevX: 0,
      prevY: 0,
      myX: 0,
      myY: 0,
      resizeClicked: false,
      myWidth: 150,
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.removeSticker = this.removeSticker.bind(this);
    this.resizeMouseDown = this.resizeMouseDown.bind(this);
    this.resizeMouseMove = this.resizeMouseMove.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
  }

  //  mouse handles to move the stickers
  handleMouseDown(e) {
    //  stop default browser answer:
    e.preventDefault();
    e.stopPropagation();
    //  get mouse start position
    this.setState({
      clicked: true,
    });
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

      const xDelta = x - this.state.prevX;
      const newXPos = this.state.myX + xDelta;
      console.log("xDelta, xPos", xDelta, newXPos);
      const yDelta = this.state.prevY - y;
      const newYPos = this.state.myY + yDelta;
      console.log("yDelta, yPos", yDelta, newYPos);
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
    if (this.state.resizeClicked === true) {

      console.log('stickerobject', this.props.stickerObject);
      //  get mouse position in page based off width and added canvas size
      const newResizeX = e.pageX - 140;
      const prevResizeX = this.state.myX + this.state.myWidth;
      console.log("test new, prev", newResizeX, prevResizeX);
      const widthDelta = newResizeX - prevResizeX;
      console.log(
        "RESIZE: x, cornerX, prevResizeX",
        this.state.myX,
        newResizeX,
        this.state.prevResizeX
      );
      // ADD UPBORDER WITH HEIGHT
      const rightBorder = prevResizeX + widthDelta;
      const resizedWidth = widthDelta + this.state.myWidth;
      console.log("under500", rightBorder);
      console.log("above45", resizedWidth);
      //  makes sure size change is within bounds
      if (
        prevResizeX !== newResizeX &&
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
  }
  mouseUp() {
    console.log('up!');
    this.setState({ resizeClicked: false });
    this.setState({ clicked: false });
  }
  componentDidMount() {
    window.addEventListener("mouseup", this.mouseUp, false);
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
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
        >
          <div className="sticker_interact_overlay">
            <HighlightOffIcon
              className="sticker_delete"
              onClick={this.removeSticker}
            />
            <BorderRightIcon
              className="sticker_resize"
              onMouseDown={this.resizeMouseDown}
              onMouseMove={this.resizeMouseMove}
            />
          </div>
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
