import React, { Component } from "react";
import Sticker from "./Sticker";

export default class StickerSelector extends Component {
    constructor(props) {
        super(props);
    }
    printImages () {
        return this.props.photoStickers.map( oneSticker => {
            return <Sticker img={oneSticker}/>;
        })
    };
    render() {
        return (
			<div className="sticker_selector">
                { this.printImages() }
            </div>
        );
    }
}