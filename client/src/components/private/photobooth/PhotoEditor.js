import React, { useState, useContext } from "react";
import FormData from "form-data";
import mergeImages from "merge-images";
import gifFrames from "gif-frames";
import { Buffer } from "buffer";
import gifshot from "gifshot";

import StickerCanvas from "./StickerCanvas";
import StickerSelector from "./StickerSelector";
import GiphySearchForm from "./GiphySearchForm";
import { WebcamContext } from "./WebcamContext";
import { gifDimensions } from "./Capture";
import thumbsUp from "../../../resources/thumbs_up_icon.png";

const authToken = localStorage.getItem("myToken");

const PhotoEditor = ({ imageSrc, setImg }) => {
  const [loading, setLoading] = useState(false);

  const webContext = useContext(WebcamContext);

  const returnWebcam = () => {
    setImg(null);
  };

  // Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
  function resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise(async function (resolve, reject) {
      // We create an image to receive the Data URI
      var img = document.createElement("img");
      // When the event "onload" is triggered we can resize the image.
      img.onload = function () {
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
    const resizedImage = await resizedataURL(imgUrl, 100, 100);
    return {
      src: resizedImage,
      x: xPos,
      y: 300 - yPos,
    };
  };

  //  OH LAWD ITS THE BIG BOI
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    const hasStickers = webContext.imgsOnCanvas.length;
    const buff = Buffer.from(imageSrc);

    //  creates an array of background images from the webcam
    const backgroundImageArray = gifFrames({
      url: buff,
      frames: "all",
      outputType: "canvas",
      cumulative: false,
    }).then((frameData) => {
      const imageArrayPromise = frameData.map((frame) => {
        const canvasImage = frame.getImage();
        const b64 = canvasImage.toDataURL();
        return b64;
      });
      return Promise.all(imageArrayPromise);
    });

    // creates an array of b64 images out of all the stickers
    const stickersGifsArrayPromise = webContext.imgsOnCanvas.map(
      ({ xPos, yPos, imgUrl }) => {
        const stickerBuff = Buffer.from(imgUrl);
        const stickerImageArray = gifFrames({
          url: stickerBuff,
          frames: "all",
          outputType: "canvas",
          cumulative: false,
        }).then((frameData) => {
          const imageArrayPromise = frameData.map((frame) => {
            const canvasImage = frame.getImage();
            const b64 = canvasImage.toDataURL();
            return b64;
          });
          return Promise.all(imageArrayPromise).then((imageArrayPromise) => {
            console.log("1gifs", imageArrayPromise);
            return { imgUrl: imageArrayPromise, xPos, yPos };
          });
        });
        return stickerImageArray;
      }
    );

    const stickersGifsArray = Promise.all(stickersGifsArrayPromise);

    //  waits for background and sticker gifs to be deconstructed
    //  into image arrays
    const allImageArrays = Promise.all([
      backgroundImageArray,
      stickersGifsArray,
    ]);

    allImageArrays
      .then(([backgroundImageArray, stickersGifsArray]) => {
        console.log("back", backgroundImageArray);
        console.log("stick", stickersGifsArray);
        // })
        // .then((b64ImageArray) => {
        const stickeredImagesPromise = backgroundImageArray.map(
          (image, backgroundIndex) => {
            // Background is the webcamscreenshot
            const background = [{ src: image, x: 0, y: 0 }];

            //  If there are any stickers
            if (hasStickers) {
              const stickerPromises = stickersGifsArray.map((gifdata) => {
                const stickerIndex = backgroundIndex % gifdata.imgUrl.length;
                const b64sticker = gifdata.imgUrl[stickerIndex];
                console.log("frames", backgroundIndex, stickerIndex);
                return resize({
                  xPos: gifdata.xPos,
                  yPos: gifdata.yPos,
                  imgUrl: b64sticker,
                });
              });
              return Promise.all(stickerPromises).then((stickers) => {
                console.log("1.5", stickers);
                //  Adds the webcamscreenshot as the first image in the array
                const finalArray = background.concat(stickers);
                const stickeredImage = mergeImages(finalArray);
                console.log("2: sticker", stickeredImage);
                return stickeredImage;
              });
            } else {
              console.log("2: nosticker", image);
              return image;
            }
          }
        );
        const stickeredImageArray = Promise.all(stickeredImagesPromise);
        console.log("3", stickeredImageArray);
        return stickeredImageArray;
      })
      .then((stickeredImageArray) => {
        // create final gif and upload to database
        return gifshot.createGIF(
          {
            gifWidth: gifDimensions,
            gifHeight: gifDimensions,
            images: stickeredImageArray,
          },
          function (obj) {
            if (!obj.error) {
              let finalGIF = obj.image,
                finalAnimatedImage = document.createElement("img");
              finalAnimatedImage.src = finalGIF;
              console.log("final", finalGIF);
              fetch(finalGIF)
                .then((res) => res.blob())
                .then((blob) => {
                  const formData = new FormData();
                  const file = new File([blob], "testfile.gif");
                  formData.append("photo", file);
                  fetch("/api/posts", {
                    method: "POST",
                    headers: {
                      "x-auth-token": authToken,
                    },
                    body: formData,
                  })
                    .then(() => {
                      console.log("image uploaded successfully");
                      window.location.href = "/";
                    })
                    .catch((err) => console.error(err.response));
                });
            }
          }
        );
      })
      .catch((err) => console.error(err.response));
  };

  if (loading) {
    return (
      <div className="loading_upload">
        Uploading your GIF, please do not leave the page
      </div>
    );
  }

  return (
    <div className="photo_editor">
      <StickerCanvas />
      <input
        className="photobooth_screenshot"
        type="image"
        name="gif"
        value={imageSrc}
        src={imageSrc}
        alt="upload_image"
        required
      />

      <GiphySearchForm />

      {/* <StickerSelector /> */}

      <form
        className="photobooth_form"
        id="upload_img"
        method="POST"
        enctype="multipart/form-data"
        onSubmit={(e) => onSubmit(e)}
      >
        <input
          type="image"
          className="photobooth_accept_btn"
          value="Upload"
          src={thumbsUp}
          alt="thumbsUp"
        />
        <img
          className="photobooth_reject_btn"
          onClick={returnWebcam}
          src={thumbsUp}
          alt="thumbsUp"
        />
      </form>
    </div>
  );
};

export default PhotoEditor;
