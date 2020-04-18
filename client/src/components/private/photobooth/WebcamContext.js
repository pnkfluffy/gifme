import React, { Component } from "react";

const WebcamContext = React.createContext();

// Context Provider Component
//  will store, in its state, the data we need
class WebcamProvider extends Component {
  /* webcamPics manipulation*/
  mergeStickers(newPic) {
    const webcamImage = new Image();
    webcamImage.src = newPic;
    webcamImage.onload = () => {
      //  webcame image is set to background. When merged it's added
      //  as the first image at 0, 0
      this.state.canvas.drawImage(webcamImage, 0, 0);
    };
  }
  addStickerToCanvas = (newSticker, dimensions) => {
    // console.log('newid', this.state.totalImgsOnCanvas);
    const ratio = dimensions.height / dimensions.width;
    //  need to do new width ^ ratio
    const newHeight = Math.floor(150 * ratio);
    let newZPos;
    if (this.state.imgsOnCanvas.length) {
      newZPos = this.state.imgsOnCanvas.length;
    } else {
    newZPos = 0;
    }
    console.log(newZPos);
    this.setState({
      imgsOnCanvas: [
        ...this.state.imgsOnCanvas,
        {
          xPos: 0,
          yPos: 0,
          zPos: newZPos,
          imgUrl: newSticker.img,
          width: 150,
          height: newHeight,
          ratio: ratio,
        },
      ],
      totalImgsOnCanvas: this.state.totalImgsOnCanvas + 1,
    });
  };
  // removes sticker from canvas, sets image index to null
  // null indexes of the array are removed on gif compilation
  removeSticker = (index) => {
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    newImgsOnCanvas[index] = null;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas,
      totalImgsOnCanvas: this.state.totalImgsOnCanvas - 1,
    });
  };

  resizeSticker = (index, side) => {
    console.log('resizing!');
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const newWidth = newImgsOnCanvas[index].width + side;
    const newHeight = Math.floor(newWidth * newImgsOnCanvas[index].ratio)
    newImgsOnCanvas[index].width = newWidth;
    newImgsOnCanvas[index].height = newHeight;
    this.setState({ imgsOnCanvas: newImgsOnCanvas });
  };

  // move stickers in canvas
  moveStickerX = (index, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const oldPos = newImgsOnCanvas[index].xPos;
    //if move to SIDE right => +1, if move to SIDE left => -1
    newImgsOnCanvas[index].xPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas,
    });
  };
  moveStickerY = (index, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const oldPos = newImgsOnCanvas[index].yPos;
    //if move to SIDE up => +1, if move to SIDE down => -1
    newImgsOnCanvas[index].yPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas,
    });
  };

  selectSticker = (index) => {
    this.setState({
      selectedIndex: index,
    })
  }

  state = {
    //	sizes of photo editing area
    canvasWidth: 400,
    canvasHeight: 400,

    //	holds array of all sticker b64, delta x & delt y
    imgsOnCanvas: [],
    totalImgsOnCanvas: 0,
    selectedIndex: 0,
    selectSticker: this.selectSticker,
    addStickerToCanvas: this.addStickerToCanvas,
    removeSticker: this.removeSticker,
    moveStickerX: this.moveStickerX,
    moveStickerY: this.moveStickerY,
    resizeSticker: this.resizeSticker,
  };

  render() {
    return (
      <WebcamContext.Provider value={this.state}>
        {this.props.children}
      </WebcamContext.Provider>
    );
  }
}
const webcamConsumer = WebcamContext.Consumer;
export { WebcamProvider, webcamConsumer, WebcamContext };
