import React, { useState } from 'react';
import Webcam from 'react-webcam';

const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "user"
  };
   
  const PhotoBooth = () => {
    const webcamRef = React.useRef(null);
   
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
      },
      [webcamRef]
    );
   
    return (
    <body>
      <div id="main">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          id="webcam"
        />
        <button onClick={capture}>Capture photo</button>
      </div>
      </body>
    );
  };

  export default PhotoBooth;