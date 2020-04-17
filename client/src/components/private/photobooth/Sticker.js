import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";

export default class Sticker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      width: null,
    };
    this.addDimensions = this.addDimensions.bind(this);
  }
  addSticker = () => {
    const image = new Image();
    this.context.addStickerToCanvas( this.props, this.state );
    image.src = this.props.img;
  };

  imgEl = React.createRef();

  addDimensions = () => {
    console.log('stateupdate', this.imgEl.current.naturalHeight);
    this.state.height = this.imgEl.current.naturalHeight;
    this.state.width = this.imgEl.current.naturalWidth;
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
            width: "70px",
          }}
          onClick={this.addSticker}
          ref={this.imgEl}
          onLoad={this.addDimensions}
        />
        <hr />
      </div>
    );
  }
}

Sticker.contextType = WebcamContext;
