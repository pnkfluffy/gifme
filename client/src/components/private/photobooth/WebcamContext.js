import React, { Component } from "react";

/*setup the context provider*/
const WebcamContext = React.createContext();

// Context Provider Component
//  will store, in its state, the data we need
class WebcamProvider extends Component {
  /* webcamPics manipulation*/
  mergeStickers(newPic) {
    const webcamImage = new Image();
    webcamImage.src = newPic;
    webcamImage.onload = () => {
      /* this image is the webcam one, I'll position in it in the (0, maxY)
                because the way I did the FakeCanvas was inverted =(
                void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
             */
      this.state.canvas.drawImage(webcamImage, 0, 0);
    };
  }

  addPic = newPic => {
    this.mergeStickers(newPic);
    this.setState({
      allPics: [
        ...this.state.allPics,
        {
          imageData: newPic,
          index: this.totalPics
        }
      ],
      totalPics: this.state.totalPics + 1
    });
  };
  /* add sticker to canvas line */
  addStickerToCanvas = newSticker => {
    this.setState({
      imgsOnCanvas: [
        ...this.state.imgsOnCanvas,
        {
          xPos: 0,
          yPos: 0,
          zPos: this.state.totalImgsOnCanvas,
          imgUrl: newSticker.img,
          id: newSticker.key,
          title: newSticker.title
        }
      ],
      totalImgsOnCanvas: this.state.totalImgsOnCanvas + 1
    });
  };
  /*move sticker in canvas */
  moveStickerX = (id, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const oldPos = newImgsOnCanvas[id].xPos;
    //if move to SIDE right => +1, if move to SIDE left => -1
    newImgsOnCanvas[id].xPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas
    });
  };
  moveStickerY = (id, side) => {
    //copy the array:
    const newImgsOnCanvas = this.state.imgsOnCanvas.slice();
    const oldPos = newImgsOnCanvas[id].yPos;
    //if move to SIDE up => +1, if move to SIDE down => -1
    newImgsOnCanvas[id].yPos = oldPos + side;
    this.setState({
      imgsOnCanvas: newImgsOnCanvas
    });
  };

  /* Set RealCanvas */
  setRealCanvas = realCanvas => {
    this.setState({ canvas: realCanvas });
  };

  state = {
    /* general sizes */
    canvasWidth: 400,
    canvasHeight: 400,

    /* manage showJustTakenPics */
    totalPics: 0,
    allPics: [],
    addPic: this.addPic,

    /* realCanvas */
    canvas: null,
    setRealCanvas: this.setRealCanvas,

    /* sticker on FakeCanvas related: */
    imgsOnCanvas: [],
    totalImgsOnCanvas: 0,
    addStickerToCanvas: this.addStickerToCanvas,
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
