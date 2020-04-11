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
import love from "../../../resources/sticker_love.gif";
import mario from "../../../resources/sticker_mario.gif";
import memedog from "../../../resources/sticker_memedog.gif";
import pbj from "../../../resources/sticker_pbj.gif";
import pizzamouse from "../../../resources/sticker_pizzamouse.gif";
import underpaid from "../../../resources/sticker_underpaid.gif";
import whocares from "../../../resources/sticker_whocares.gif";
import whatsup from "../../../resources/sticker_whatsup.gif";
import tooretro from "../../../resources/sticker_tooretro.gif";
import gameboy from "../../../resources/sticker_gameboy.gif";
import game from "../../../resources/sticker_game.gif";
import thirdeye from "../../../resources/sticker_thirdeye.gif";
import planet from "../../../resources/sticker_planet.gif";
import savage from "../../../resources/sticker_savage.gif";
import toy from "../../../resources/sticker_toy.gif";
import dolphins from "../../../resources/sticker_dolphins.gif";
import patrick from "../../../resources/sticker_patrick.gif";
import eye from "../../../resources/sticker_eye.gif";
import car from "../../../resources/sticker_car.gif";
import spiderman from "../../../resources/sticker_spiderman.gif";
import racoon from "../../../resources/sticker_racoon.gif";
import pretty from "../../../resources/sticker_pretty.gif";
import notok from "../../../resources/sticker_notok.gif";
import pig from "../../../resources/sticker_pig.gif";
import flash from "../../../resources/sticker_flash.gif";
import snow from "../../../resources/sticker_snow.gif";
import shine from "../../../resources/sticker_shine.gif";
import fallingstars from "../../../resources/sticker_fallingstars.gif";
import lights from "../../../resources/sticker_lights.gif";
import gold from "../../../resources/sticker_gold.gif";

const stickerArray = [
  bigStar,
  broke,
  cattrombone,
  chameleon,
  cooldog,
  crybaby,
  diamond,
  disco,
  love,
  mario,
  memedog,
  pbj,
  pizzamouse,
  underpaid,
  whocares,
  whatsup,
  tooretro,
  gameboy,
  game,
  thirdeye,
  planet,
  savage,
  toy,
  dolphins,
  patrick,
  eye,
  car,
  spiderman,
  racoon,
  pretty,
  notok,
  pig,
  flash,
  snow,
  shine,
  fallingstars,
  lights,
  gold
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
