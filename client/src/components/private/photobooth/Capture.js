import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import gifshot from "gifshot";

import { WebcamProvider } from "./WebcamContext";
import fetchAuth from "../../../utils/FetchAuth";
import PhotoEditor from "./PhotoEditor";
import VerificationPopup from "../../../utils/VerificationPopup";
import PageError from "../../error/NotValidUser(400)";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user",
};

const gifDimensions = 400;
//  each frame is 1/10 seconds
const timerCountDown = 5;

const PhotoDisplay = () => {
  const [gifLength, setGifLength] = useState(2);
  const [loading, setLoading] = useState(false);
  const [upTimer, setUpTimer] = useState(null);
  const [downTimer, setDownTimer] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [login, setLogin] = useState(true);
  const [authOverlay, setAuthOverlay] = useState(false);
  const [webcamPermissions, setWebcamPermissions] = useState(false);

  const webcamRef = React.useRef(null);

  const recordGif = () => {
    gifshot.createGIF(
      {
        gifWidth: gifDimensions,
        gifHeight: gifDimensions,
        frameDuration: 1,
        interval: 0.1,
        numFrames: gifLength * 10,
      },
      function (obj) {
        if (!obj.error) {
          let image = obj.image,
            animatedImage = document.createElement("img");
          animatedImage.src = image;
          setImageSrc(image);
          setLoading(false);
        }
      }
    );
  };

  useEffect(() => {
    const auth = fetchAuth();
    auth.then((res) => {
      if (!res) {
        setLogin(false);
        setAuthOverlay(true);
      }
    });
  }, []);

  useEffect(() => {
    if (downTimer < 0 || downTimer === 0) {
      recordGif();
      setDownTimer(null);
      setUpTimer(0.01);
    }
    if (!downTimer) return;
    const interval = setInterval(() => {
      setDownTimer((downTimer) => downTimer - 1);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [downTimer]);

  const countUp = () => {
    setUpTimer((upTimer) => parseFloat(upTimer + 0.01));
  };

  useEffect(() => {
    if (upTimer > gifLength) {
      setLoading(true);
      setUpTimer(null);
    }
    if (!upTimer) return;
    const upInterval = setInterval(countUp, 10);
    return () => {
      clearInterval(upInterval);
    };
  }, [upTimer]);

  const changeSlider = (e) => setGifLength(e.target.value);

  const LoadingBox = () => <div className="loading_box">loading...</div>;

  const RecordButton = () => (
    <div
      className="photobooth_record_btn"
      onClick={() => {
        setDownTimer(timerCountDown);
      }}
    >
      {downTimer ? downTimer : null}
      {upTimer ? upTimer.toFixed(2) : null}
      {loading ? gifLength : null}
    </div>
  );

  const forwardToRegister = () => {
    window.location.href = "/Signup";
  };

  const popupText =
    "Without an account, you can only test features. Please register to save or upload a GIF.";
  const leftText = "Thats OK";
  const rightText = "Sign me up!";

  const NoCameraAccess = () => (
    <div className="cam_access">please enable camera access</div>
  );

  if (!imageSrc) {
    return (
      <div className="photobooth_box">
        {authOverlay && (
          <VerificationPopup
            popupMessage={popupText}
            leftButtonMessage={leftText}
            leftButtonFunction={() => setAuthOverlay(false)}
            rightButtonMessage={rightText}
            rightButtonFunction={() => forwardToRegister()}
          />
        )}
        <div className="webcam_box">
          <Webcam
            audio={false}
            height={400}
            ref={webcamRef}
            width={400}
            videoConstraints={videoConstraints}
            id="webcam"
            onUserMediaError={() => setWebcamPermissions(false)}
            onUserMedia={() => setWebcamPermissions(true)}
          />
          {loading ? <LoadingBox /> : null}
        </div>
        <div className="photobooth_record_box">
          {webcamPermissions ? <RecordButton /> : <NoCameraAccess />}
        </div>
        <div className="gif_length_text">
          <div className="photobooth_length_time">gif length (seconds)</div>
          <div className="gif_length_numbers">1 2 3 4 5</div>
        </div>
        <input
          type="range"
          className="gif_length_form"
          min="1"
          max="5"
          value={gifLength}
          onChange={(e) => changeSlider(e)}
        />
      </div>
    );
  } else {
    return (
      //	Allows all of PhotoEditor to access a single state
      <WebcamProvider>
        <PhotoEditor
          imageSrc={imageSrc}
          setImg={(img) => setImageSrc(img)}
          loggedIn={login}
        />
      </WebcamProvider>
    );
  }
};

const PhotoBooth = () => {
  return (
    <div>
      <div id="main">
        <div className="photobooth">
          <PhotoDisplay />
        </div>
      </div>
    </div>
  );
};

export default PhotoBooth;
