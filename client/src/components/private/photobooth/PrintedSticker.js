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
      prevResizeX: 0,
      myWidth: 150,
      // prevWidth: 150,
      // myWidth: 150,
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
      //  RIGHT moves +1 * how much moved. Does not move if out of canvas

      const xDelta = x - this.state.prevX;
      const newXPos = this.state.myX + xDelta;
      console.log("xDelta, xPos", xDelta, newXPos);
      const yDelta = this.state.prevY - y;
      const newYPos = this.state.myY + yDelta;
      console.log("yDelta, yPos", yDelta, newYPos);
      if (
        this.state.prevX !== 0 &&
        this.state.prevX !== x &&
        newXPos < 400 &&
        newXPos > -100
      ) {
        this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
        //  need to change myX and myY to keep the x and ys from the PARENT DIV (the canvas) so the images
        //  cant move to outside of the canvas!!!
        this.setState({
          myX: newXPos,
          prevX: x
        });
      }
      //  UP moves +1 * how much moved
      else if (
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

      else if (this.state.prevX === 0) this.setState({ prevX: x });
      else if (this.state.prevY === 0) this.setState({ prevY: y });
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
    console.log("resizemouseDown");
    this.setState({
      resizeClicked: true,
    });
  }
  resizeMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();
    //  get mouse movement IF clicked is on
    if (this.state.resizeClicked === true) {
      //  get mouse position in page (means that counts the outside spaces)
      const newResizeX = e.pageX;
      const widthDelta = newResizeX - this.state.prevResizeX;
      const stickerXPos = this.state.myX;
      console.log(
        "RESIZE: x, cornerX, prevResizeX",
        this.state.myX,
        newResizeX,
        this.state.prevResizeX
      );
      const rightBorder = stickerXPos + widthDelta + this.state.myWidth;
      const resizedWidth = widthDelta + this.state.myWidth;
      console.log("under500", rightBorder);
      console.log("above45", resizedWidth);
      //  gets the x and y relative to the stickerCanvas div
      //  checks side that mouse is moving and moves in the WebcamContext
      //  RIGHT moves +1 * how much moved. Does not move if out of canvas
      if (
        this.state.prevResizeX !== 0 &&
        this.state.prevResizeX !== newResizeX &&
        // should allow to grow up to 100 outside border
        rightBorder < 500 &&
        // limits the smallest size possible
        resizedWidth > 45
        //ADD CHECKS FOR Y DIMENSION
      ) {
        this.context.resizeSticker(this.props.stickerObject.zPos, widthDelta);
        this.setState({
          prevResizeX: newResizeX,
          myWidth: resizedWidth,
        });
      }

      if (this.state.prevResizeX === 0)
        this.setState({ prevResizeX: newResizeX });
    }
  }
  mouseUp() {
    this.setState({ resizeClicked: false });
    this.setState({clicked: false});
  }
  componentDidMount() {
    window.addEventListener('mouseup', this.mouseUp, false);
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
