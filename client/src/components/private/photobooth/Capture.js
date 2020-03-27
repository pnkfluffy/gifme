import React, { useState, useEffect, useContext } from "react";
import Webcam from "react-webcam";
import { WebcamProvider } from "./WebcamContext";

import PhotoEditor from "./PhotoEditor";

const videoConstraints = {
  width: 400,
  height: 400,
  facingMode: "user"
};

const PhotoDisplay = () => {
  const [timer, setTimer] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

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
      //	Allows all of PhotoEditor to access a single state
      <WebcamProvider>
        <PhotoEditor imageSrc={imageSrc} setImg={img => setImageSrc(img)} />
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
