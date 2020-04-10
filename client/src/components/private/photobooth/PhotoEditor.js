import React, { useContext } from "react";
import FormData from "form-data";
import mergeImages from "merge-images";
import gifFrames from "gif-frames";
import { Buffer } from "buffer";
import gifshot from "gifshot";

import StickerCanvas from "./StickerCanvas";
import StickerSelector from "./StickerSelector";
import { WebcamContext } from "./WebcamContext";
import { gifDimensions } from "./Capture";
import thumbsUp from "../../../resources/thumbs_up_icon.png";

const PhotoEditor = ({ imageSrc, setImg }) => {
  const authtoken = localStorage.getItem("myToken");
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

  //  Posts the merged image to the database
  const onSubmit = async (e) => {
    e.preventDefault();

    const hasStickers = webContext.imgsOnCanvas.length;
    const buff = Buffer.from(imageSrc);

    // its the big boy
    const backgroundImageArray = gifFrames({
      url: buff,
      frames: "all",
      outputType: "canvas",
      cumulative: true,
    }).then((frameData) => {
      const imageArrayPromise = frameData.map((frame) => {
        const canvasImage = frame.getImage();
        const b64 = canvasImage.toDataURL();
        return b64;
      });
      return Promise.all(imageArrayPromise);

    });

    const stickersGifsArrayPromise = webContext.imgsOnCanvas.map(
      ({ xPos, yPos, imgUrl }) => {
        const stickerBuff = Buffer.from(imgUrl);
        const stickerImageArray = gifFrames({
          url: stickerBuff,
          frames: "all",
          outputType: "canvas",
          cumulative: true,
        }).then((frameData) => {
          const imageArrayPromise = frameData.map((frame) => {
            const canvasImage = frame.getImage();
            const b64 = canvasImage.toDataURL();
            return b64;
          });
          return Promise.all(imageArrayPromise)
          .then((imageArrayPromise) => {
            console.log("1gifs", imageArrayPromise);
            return ({ imgUrl: imageArrayPromise, xPos, yPos });
          });
        });
        return (stickerImageArray);
      }
    );
  
    const stickersGifsArray = Promise.all(stickersGifsArrayPromise);

    const allImageArrays = Promise.all([
      backgroundImageArray,
      stickersGifsArray,
    ]);
    
    allImageArrays.then(([backgroundImageArray, stickersGifsArray]) => {
      console.log("back", backgroundImageArray);
      console.log('stick', stickersGifsArray);
    });

    // .then((b64ImageArray) => {
    //   const stickeredImagesPromise = b64ImageArray.map((image, index) => {
    //     // Background is the webcamscreenshot
    //     console.log('thisindex', index);
    //     const background = [{ src: image, x: 0, y: 0 }];

    //     //  If there are any stickers
    //     if (hasStickers) {
    //       const stickerPromises = webContext.imgsOnCanvas.map(
    //         ({ xPos, yPos, imgUrl }) => {
    //           return resize({ xPos, yPos, imgUrl });
    //         }
    //       );
    //       return Promise.all(stickerPromises).then(stickers => {
    //         // console.log("1.5", stickers);
    //         //  Adds the webcamscreenshot as the first image in the array
    //         const finalArray = background.concat(stickers);
    //         const stickeredImage = mergeImages(finalArray);
    //         // console.log("2: sticker", stickeredImage);
    //         return stickeredImage;
    //       });
    //     } else {
    //       console.log("2: nosticker", image);
    //       return image;
    //     }
    //   });
    //   const stickeredImageArray = Promise.all(stickeredImagesPromise);
    //   // console.log("3", stickeredImageArray);
    //   return stickeredImageArray;
    // })
    // .then((stickeredImageArray) => {
    //   return gifshot.createGIF(
    //     {
    //       gifWidth: gifDimensions,
    //       gifHeight: gifDimensions,
    //       images: stickeredImageArray,
    //     },
    //     function (obj) {
    //       if (!obj.error) {
    //         let finalGIF = obj.image,
    //           finalAnimatedImage = document.createElement("img");
    //         finalAnimatedImage.src = finalGIF;
    //         console.log("final", finalGIF);
    //         fetch(finalGIF)
    //           .then((res) => res.blob())
    //           .then((blob) => {
    //             const formData = new FormData();
    //             const file = new File([blob], "testfile.gif");
    //             formData.append("photo", file);
    //             fetch("/api/posts", {
    //               method: "POST",
    //               headers: {
    //                 "x-auth-token": authtoken,
    //               },
    //               body: formData,
    //             })
    //               .then(() => {
    //                 console.log("image uploaded successfully");
    //                 window.location.href = "/";
    //               })
    //               .catch((err) => console.error(err.response));
    //           });
    //       }
    //     }
    //   );
    // })
    // .catch((err) => console.error(err.response));
  };

  return (
    <div className="photo_box">
      <form
        className="photobooth_box"
        id="upload_img"
        method="POST"
        enctype="multipart/form-data"
        onSubmit={(e) => onSubmit(e)}
      >
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

        <StickerSelector />

        <div className="photobooth_action_btns">
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
        </div>
      </form>
    </div>
  );
};

export default PhotoEditor;
