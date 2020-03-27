import React, { useContext } from "react";
import FormData from "form-data";
import StickerCanvas from "./StickerCanvas";
import StickerSelector from "./StickerSelector";
import { WebcamContext } from "./WebcamContext";
import mergeImages from "merge-images";

import thumbsUp from "../../../resources/thumbs_up_icon.png";
import dogImg from "../../../resources/superimposable_dog.png";
//import catImg from "../../../resources/superimposable_cat.png";
import hatImg from "../../../resources/superimposable_hat.png";
import fireImg from "../../../resources/superimposable_fire.png";
import bananaImg from "../../../resources/superimposable_banana.png";
import poopImg from "../../../resources/superimposable_poop.png";

const PhotoEditor = ({ imageSrc, setImg }) => {
  const authtoken = localStorage.getItem("myToken");
  const imageArray = [dogImg, poopImg, hatImg, fireImg, bananaImg];
  const webContext = useContext(WebcamContext);

  const returnWebcam = () => {
    setImg(null);
  };

  // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
  function resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async function(resolve, reject) {
      // We create an image to receive the Data URI
      var img = document.createElement("img");
      // When the event "onload" is triggered we can resize the image.
      img.onload = function() {
        // We create a canvas and get its context.
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;
        // We resize the image with the canvas method drawImage();
        ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);
        var dataURI = canvas.toDataURL();
        // This is the return of the Promise
        resolve(dataURI);
      };
      // We put the Data URI in the image's src attribute
      img.src = datas;
    });
  } // Use it like : var newDataURI = await resizedataURL('yourDataURIHere', 50, 50);

  //  Resizes the stickers (to 70px x 70px for now) and returns the inversed y coordinate
  //  due sticker y being fipped
  const resize = async ({ xPos, yPos, imgUrl }) => {
    const resizedImage = await resizedataURL(imgUrl, 70, 70);
    return {
      src: resizedImage,
      x: xPos,
      y: 330 - yPos
    };
  };

  //  Posts the merged image to the database
  const onSubmit = async e => {
	//	MAKE GIFS
	//  BRING UP LOADING SCREEN
    e.preventDefault();
    //  Background is the webcamscreenshot
    const background = [{ src: imageSrc, x: 0, y: 0 }];

    let stickerArray = [];
    //  If there are any stickers
    if (webContext.imgsOnCanvas.length) {
      const stickerPromises = webContext.imgsOnCanvas.map(
        ({ xPos, yPos, imgUrl }) => {
          return resize({ xPos, yPos, imgUrl });
        }
      );
      stickerArray = Promise.all(stickerPromises);
      stickerArray.then(res => {
        //  Adds the webcamscreenshot as the first image in the array
        const finalArray = background.concat(res);

        mergeImages(finalArray)
          .then(b64 => {
            //  Posts the merged image to the website
            fetch(b64)
              .then(res => res.blob())
              .then(blob => {
                const formData = new FormData();
                const file = new File([blob], "testfile.jpeg");
                formData.append("photo", file);
                fetch("/api/posts", {
                  method: "POST",
                  headers: {
                    "x-auth-token": authtoken
                  },
                  body: formData
                })
                  .then(res => {
                    res.json();
                    window.location.href = "/";
                  })
                  //  REDIRECT TO CUSTOM URL PAGE FOR IMAGE POST
                  .then(res => console.log(res))
                  .catch(err => console.log(err.response));
              });
          })
          .then(b64 => console.log("DONE!: ", b64))
          .catch(err => console.error(err));
      });
    }
  };

  return (
    <div className="photo_box">
      <form
        className="photobooth_box"
        id="upload_img"
        method="POST"
        enctype="multipart/form-data"
        onSubmit={e => onSubmit(e)}
      >
        <StickerCanvas />
        <input
          className="photobooth_screenshot"
          type="image"
          name="image"
          value={imageSrc}
          src={imageSrc}
          alt="upload_image"
          required
        />
        <StickerSelector photoStickers={imageArray} />

        <div className="photobooth_action_btns">
          <input
            type="image"
            className="photobooth_accept_btn"
            value="Upload"
            src={thumbsUp}
          />
          <img
            className="photobooth_reject_btn"
            onClick={returnWebcam}
            src={thumbsUp}
          />
        </div>
      </form>
    </div>
  );
};

export default PhotoEditor;
