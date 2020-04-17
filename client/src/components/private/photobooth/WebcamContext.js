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
  addStickerToCanvas = newSticker => {
    console.log('newid', this.state.totalImgsOnCanvas);
    this.setState({
      imgsOnCanvas: [
        ...this.state.imgsOnCanvas,
        {
          xPos: 0,
          yPos: 0,
          zPos: this.state.totalImgsOnCanvas,
          imgUrl: newSticker.img,
          id: this.state.totalImgsOnCanvas
        }
      ],
      totalImgsOnCanvas: this.state.totalImgsOnCanvas + 1
    });
  };
  removeSticker = (id) => {
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const index = newImgsOnCanvas.findIndex(sticker => sticker.id === id);
    console.log('removeid', id);
    console.log('spliceInded', index);
    newImgsOnCanvas.splice(index, 1);
    this.setState({
      imgsOnCanvas: newImgsOnCanvas,
      totalImgsOnCanvas: this.state.totalImgsOnCanvas - 1
    })
  }
  // move stickers in canvas
  moveStickerX = (id, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const index = newImgsOnCanvas.findIndex(sticker => sticker.id === id);
    const oldPos = newImgsOnCanvas[index].xPos;
    //if move to SIDE right => +1, if move to SIDE left => -1
    newImgsOnCanvas[index].xPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas
    });
  };
  moveStickerY = (id, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const index = newImgsOnCanvas.findIndex(sticker => sticker.id === id);
    const oldPos = newImgsOnCanvas[index].yPos;
    //if move to SIDE up => +1, if move to SIDE down => -1
    newImgsOnCanvas[index].yPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas
    });
  };

  state = {
    //	sizes of photo editing area
    canvasWidth: 400,
    canvasHeight: 400,

    //	holds array of all sticker b64, delta x & delt y
    imgsOnCanvas: [],
    totalImgsOnCanvas: 0,
    addStickerToCanvas: this.addStickerToCanvas,
    removeSticker: this.removeSticker,
    moveStickerX: this.moveStickerX,
    moveStickerY: this.moveStickerY
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
