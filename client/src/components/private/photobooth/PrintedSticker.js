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

    //  sets the mouse location each time mouse is pressed
    //  down in a new location
    const newPrevX = e.pageX;
    const newPrevY = e.pageY;
    this.setState({
      prevX: newPrevX,
      prevY: newPrevY,
    });

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
    // y id inverted
    const newYPos = this.props.stickerObject.yPos - yDelta;
    //  ADD UPBORDER WITH HEIGHT
    const xBorder = newXPos + this.props.stickerObject.width;
    const yBorder = newYPos + this.props.stickerObject.width;

    let newPrevResizeX;
    if (!this.state.prevResizeX) {
      newPrevResizeX = 0;
    } else {
      newPrevResizeX = this.state.prevResizeX + xDelta;
    }

    //  Movex X by xDelta. One for left one for right,
    //  so user can always add back into screen
    if (x > this.state.prevX && xBorder < 500) {
      this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
      this.setState({
        prevX: x,
        prevResizeX: newPrevResizeX,
      });
    } else if (x < this.state.prevX && newXPos > -100) {
      this.context.moveStickerX(this.props.stickerObject.zPos, xDelta);
      this.setState({
        prevX: x,
      });
    }

    //  UP moves by yDelta
    if (y < this.state.prevY && yBorder < 500) {
      this.context.moveStickerY(this.props.stickerObject.zPos, yDelta);
      this.setState({
        prevY: y,
      });
    } else if (y > this.state.prevY && newYPos > -100) {
      this.context.moveStickerY(this.props.stickerObject.zPos, yDelta);
      this.setState({
        prevY: y,
      });
    }
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

    const newPrevX = e.pageX;

    this.setState({
      resizeClicked: true,
      prevResizeX: newPrevX,
    });
  }

  resizeMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    //  get mouse position in page based off width and added canvas size
    const newResizeX = e.pageX;
    const widthDelta = newResizeX - this.state.prevResizeX;
    // ADD UPBORDER WITH HEIGHT
    const xBorder =
      this.props.stickerObject.xPos +
      this.props.stickerObject.width +
      widthDelta;
    const resizedWidth = widthDelta + this.props.stickerObject.width;
    const resizedHeight = resizedWidth * this.props.stickerObject.ratio;
    //  makes sure size change is within bounds

    if (resizedWidth >= 400 || resizedHeight >= 400) {
      return;
    }

    //  ADD CHECKS FOR Y DIMENSIONS
    if (
      newResizeX > this.state.prevResizeX &&
      //  checks for out of border
      xBorder < 500
    ) {
      this.context.resizeSticker(this.props.stickerObject.zPos, widthDelta);
      this.setState({ prevResizeX: newResizeX });
    } else if (
      newResizeX < this.state.prevResizeX &&
      // limits the smallest size possible
      resizedWidth > 45
    ) {
      this.context.resizeSticker(this.props.stickerObject.zPos, widthDelta);
      this.setState({ prevResizeX: newResizeX });
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
    const stickerCanvas = document.querySelector(".sticker_canvas_box");

    //  checks window for mouseup, for fluidity
    window.addEventListener("mouseup", this.mouseUp);

    //  checks only canvas for mouse move, so no movement outside of canvas
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
