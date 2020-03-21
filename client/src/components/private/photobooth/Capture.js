import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import FormData from "form-data";
import thumbsUp from "../../../resources/thumbs_up_icon.png";
import dogImg from "../../../resources/superimposable_dog.png";
//import catImg from "../../../resources/superimposable_cat.png";
import hatImg from "../../../resources/superimposable_hat.png";
import fireImg from "../../../resources/superimposable_fire.png";
import bananaImg from "../../../resources/superimposable_banana.png";
import poopImg from "../../../resources/superimposable_poop.png";
//import mergeImages from "merge-images";

import VideoArea from "./VideoArea";
import { WebcamProvider } from "./WebcamContext";
import StickerSelector from "./StickerSelector";

const imageArray = [dogImg, poopImg, hatImg, fireImg, bananaImg];

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user"
};

const PhotoDisplay = () => {
  const [timer, setTimer] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);

  const authtoken = localStorage.getItem("myToken");

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    setImageSrc(webcamRef.current.getScreenshot());
  }, [webcamRef]);

  useEffect(() => {
    if (timer < 0) {
      capture();
      setTimer(null);
    }
    if (!timer) return;
    const interval = setInterval(() => {
      setTimer(timer => (timer - 0.01).toFixed(2));
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const delete_img = () => {
    setImageSrc(null);
  };
  const onSubmit = async e => {
    e.preventDefault();
    fetch(imageSrc)
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
          .then(res => res.json())
          .then(res => console.log(res))
          .catch(err => console.log(err.response));
      });
  };

  if (!imageSrc) {
    return (
      <div className="photobooth_box">
        <div className="webcam_box">
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={videoConstraints}
            id="webcam"
          />
        </div>
        <div className="photobooth_record_box">
          {/* CHANGE TIMER TO 3 SECONDS */}
          <div
            className="photobooth_record_btn"
            onClick={() => {
              setTimer(1);
            }}
          >
            {timer ? timer : null}
          </div>
        </div>
        <div className="photobooth_length_form">{"1 2 3 4 5"}</div>
      </div>
    );
  } else {
    return (
      <WebcamProvider>
        <div className="photo_box">
          <form
            className="photobooth_box"
            id="upload_img"
            method="POST"
            enctype="multipart/form-data"
            onSubmit={e => onSubmit(e)}
          >
            <VideoArea />
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
                onClick={delete_img}
                src={thumbsUp}
              />
            </div>
          </form>
        </div>
      </WebcamProvider>
    );
  }
};

const PhotoBooth = () => {
  return (
    <div>
      <div id="main">
        <div class="photobooth">
          <PhotoDisplay />
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
