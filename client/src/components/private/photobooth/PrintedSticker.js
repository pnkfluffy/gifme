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
      resizeClicked: false,
      prevResizeX: 0,
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
    //  gets the x and y relative to the stickerCanvas div
    //  checks side that mouse is moving and moves in the WebcamContext

    const xDelta = x - this.state.prevX;
    const newXPos = this.props.stickerObject.xPos + xDelta;
    const yDelta = this.state.prevY - y;
    const newYPos = this.props.stickerObject.yPos + yDelta;
    //  ADD UPBORDER WITH HEIGHT
    const rightBorder = newXPos + this.props.stickerObject.width;

    let newPrevResizeX;
    if (!this.state.prevResizeX) {
      newPrevResizeX = 0;
    } else {
      newPrevResizeX = this.state.prevResizeX + xDelta;
    }

    //  Movex X by xDelta. One for left one for right,
    //  so user can always add back into screen
    if (this.state.prevX !== 0 && x > this.state.prevX && rightBorder < 500) {
      this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
      this.setState({
        prevX: x,
        prevResizeX: newPrevResizeX,
      });
    } else if (
      this.state.prevX !== 0 &&
      x < this.state.prevX &&
      newXPos > -100
    ) {
      this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
      this.setState({
        prevX: x,
        prevResizeX: newPrevResizeX,
      });
    }

    //  UP moves by yDelta
    if (
      this.state.prevY !== 0 &&
      y > this.state.prevY &&
      newYPos < 400
    ) {
      this.context.moveStickerY(this.props.stickerObject.zPos, yDelta);
      this.setState({
        prevY: y,
      });
    } else if (
      this.state.prevY !== 0 &&
      y < this.state.prevY &&
      newYPos > -100
    ) {
      this.context.moveStickerY(this.props.stickerObject.zPos, yDelta);
      this.setState({
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

  // SEPERATE FUNCTIONS  -  ONE FOR UP ONE FOR DOWN

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
    const newResizeX = e.pageX;
    console.log("diff", newResizeX, this.state.prevResizeX);
    const widthDelta =
      (newResizeX - this.state.prevResizeX) / this.props.stickerObject.ratio;
    // ADD UPBORDER WITH HEIGHT
    const rightBorder =
      this.props.stickerObject.xPos +
      this.props.stickerObject.width +
      widthDelta;
    const resizedWidth = widthDelta + this.props.stickerObject.width;
    //  makes sure size change is within bounds
    if (
      this.state.prevResizeX !== 0 &&
      this.state.prevResizeX !== newResizeX &&
      rightBorder < 500 &&
      // limits the smallest size possible
      resizedWidth > 45
      //ADD CHECKS FOR Y DIMENSION
    ) {
      this.context.resizeSticker(this.props.stickerObject.zPos, widthDelta);
    }
    if (this.state.prevResizeX === 0)
      this.setState({ prevResizeX: newResizeX });
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
    const stickerCanvas = document.querySelector(".sticker_canvas_box");

    stickerCanvas.addEventListener("mouseup", this.mouseUp);
    stickerCanvas.addEventListener("mousemove", this.mouseMove);
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
