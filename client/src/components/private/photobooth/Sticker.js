import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";

export default class Sticker extends Component {

  addSticker = () => {
    const image = new Image();
    this.context.addStickerToCanvas(this.props);
    image.src = this.props.img;
  };

  render() {
    return (
      <div className="scroll_sticker_holder">
        <img
          src={this.props.img}
          alt={this.props.title}
          key={this.props.key}
          style={{
            height: "auto",
            maxHeight: "80px",
            width: "70px"
          }}
          onClick={this.addSticker}
        />
        <hr />
      </div>
    );
  }
}

Sticker.contextType = WebcamContext;
