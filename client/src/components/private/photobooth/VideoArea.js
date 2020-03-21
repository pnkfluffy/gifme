import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";
import StickerCanvas from "./StickerCanvas";

export default class VideoArea extends Component {
  constructor(props) {
    super(props);
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
          <StickerCanvas />
        </div>
    );
  }
}
VideoArea.contextType = WebcamContext;
