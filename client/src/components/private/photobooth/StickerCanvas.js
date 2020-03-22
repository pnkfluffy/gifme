import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";
import PrintedSticker from "./PrintedSticker";

//#The StickerCanvas
//this canvas is the fake one because it doesn't really carry a canvas object in It,
//It's a div that displays and moves arround the gifs, It`s a package-free (no package needed)
//way of displaying gif images on the "canvas" and moving them arround.

//  each individual sticker stores its own b64 data as well as its x, y, and z locations
export default class StickerCanvas extends Component {
  constructor(props) {
    super(props);
  }

  placeStickers() {
    if (this.context.totalImgsOnCanvas > 0) {
      return this.context.imgsOnCanvas.map(pic => {
        return <PrintedSticker stickerObject={pic} />;
      });
    } else {
      return null;
    }
  }
  render() {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          top: "50px",
          height: "400px",
          width: "400px"
        }}
      >
        <div className="sticker_canvas">{this.placeStickers()}</div>
      </div>
    );
  }
}

StickerCanvas.contextType = WebcamContext;
