import React, { Component } from "react";
import { WebcamContext } from "./WebcamContext";

export default class Sticker extends Component {
    constructor(props) {
        super(props);
    };

    addSticker = () => {
        const image = new Image();
        this.context.addStickerToCanvas(this.props);
        image.src = this.props.img;
    };

    render() {
        return (
            <div>
                <img src={ this.props.img }
                     alt={ this.props.title }
                     style={{
						 height: '70px',
						 width: '70px'
                     }}
                     onClick={ this.addSticker }
                />
                <hr />
            </div>
        );
    }
}

Sticker.contextType = WebcamContext;