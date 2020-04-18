import React, { useState, useContext } from "react";
import FormData from "form-data";
import mergeImages from "merge-images";
import gifFrames from "gif-frames";
import { Buffer } from "buffer";
import gifshot from "gifshot";

import StickerCanvas from "./StickerCanvas";
import GiphySearchForm from "./GiphySearchForm";
import { WebcamContext } from "./WebcamContext";
import thumbsUp from "../../../resources/thumbs_up_icon.png";

const gifDimensions = 200;
const canvasHeight = 400;

const PhotoEditor = ({ imageSrc, setImg, loggedIn }) => {
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("myToken");

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

  //  Resizes the stickers (to 100px x 100px for now) and returns the inversed y coordinate
  //  due sticker y being fipped
  const resize = async ({ xPos, yPos, xLen, yLen, imgUrl }) => {
    const resizedImage = await resizedataURL(imgUrl, xLen, yLen);
    return {
      src: resizedImage,
      x: xPos,
      y: canvasHeight - yLen - yPos,
    };
  };

  //  OH LAWD ITS THE BIG BOI
  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();

    const contextStickerArray = webContext.imgsOnCanvas.filter(function (el) {
      return el != null;
    });
    const hasStickers = contextStickerArray.length;
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
    const stickersGifsArrayPromise = contextStickerArray.map(
      ({ xPos, yPos, width, height, imgUrl }) => {
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
            return { imgUrl: imageArrayPromise, xPos, yPos, width, height };
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
        // })
        const stickeredImagesPromise = backgroundImageArray.map(
          (image, backgroundIndex) => {
            // Background is the webcamscreenshot
            const background = [{ src: image, x: 0, y: 0 }];

            //  If there are any stickers
            if (hasStickers) {
              const stickerPromises = stickersGifsArray.map((gifdata) => {
                const stickerIndex = backgroundIndex % gifdata.imgUrl.length;
                const b64sticker = gifdata.imgUrl[stickerIndex];
                return resize({
                  xPos: gifdata.xPos,
                  yPos: gifdata.yPos,
                  xLen: gifdata.width,
                  yLen: gifdata.height,
                  imgUrl: b64sticker,
                });
              });
              return Promise.all(stickerPromises).then((stickers) => {
                //  Adds the webcamscreenshot as the first image in the array
                const finalArray = background.concat(stickers);
                const stickeredImage = mergeImages(finalArray);
                return stickeredImage;
              });
            } else {
              return image;
            }
          }
        );
        const stickeredImageArray = Promise.all(stickeredImagesPromise);
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

              // FOR TESTING
              // document.body.appendChild(finalAnimatedImage);
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

      <form
        className="photobooth_form"
        id="upload_img"
        method="POST"
        enctype="multipart/form-data"
        onSubmit={(e) => onSubmit(e)}
      >
        {loggedIn ? (
          <input
            type="image"
            className="photobooth_accept_btn"
            value="Upload"
            src={thumbsUp}
            alt="thumbsUp"
          />
        ) : (
          <img
            className="photobooth_accept_btn"
            onClick={() => {
              window.location.href = "/Signup";
            }}
            src={thumbsUp}
            alt="thumbsUp"
          />
        )}
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
