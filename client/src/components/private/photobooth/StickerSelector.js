import React, { Component } from "react";
import Sticker from "./Sticker";
import ScrollMenu from "react-horizontal-scrolling-menu";

import bigStar from "../../../resources/sticker_bigstar.gif";
import broke from "../../../resources/sticker_broke.gif";
import cattrombone from "../../../resources/sticker_cattrombone.gif";
import chameleon from "../../../resources/sticker_chameleon.gif";
import cooldog from "../../../resources/sticker_cooldog.gif";
import crybaby from "../../../resources/sticker_crybaby.gif";
import diamond from "../../../resources/sticker_diamond.gif";
import disco from "../../../resources/sticker_disco.gif";
import hahano from "../../../resources/sticker_hahano.gif";
import love from "../../../resources/sticker_love.gif";
import mario from "../../../resources/sticker_mario.gif";
import memedog from "../../../resources/sticker_memedog.gif";
import pbj from "../../../resources/sticker_pbj.gif";
import pizzamouse from "../../../resources/sticker_pizzamouse.gif";

const stickerArray = [
  bigStar,
  broke,
  cattrombone,
  chameleon,
  cooldog,
  crybaby,
  diamond,
  disco,
  hahano,
  love,
  mario,
  memedog,
  pbj,
  pizzamouse
];

const Arrow = ({ text, className }) => {
  return <div className={className}>{text}</div>;
};

const ArrowLeft = Arrow({ text: "<", className: "arrow-prev" });
const ArrowRight = Arrow({ text: ">", className: "arrow-next" });



export default class StickerSelector extends Component {
  printImages() {
    return stickerArray.map((sticker, index) => {
      return <Sticker img={sticker} key={index}/>;
    });
  }

  render() {
    return (
      <div className="sticker_selector">
        <ScrollMenu
          className="scrollmenu"
          data={this.printImages()}
          arrowLeft={ArrowLeft}
          arrowRight={ArrowRight}
          // onLastItemVisible=loadmore()
        />
      </div>
    );
  }
}
