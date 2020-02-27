import React, { useState } from 'react';
import Webcam from 'react-webcam';
import FormData from 'form-data';

const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: "user"
  };

const PhotoDisplay = () => {
  const [ imageSrc, setImageSrc ] = useState(null);

  const authtoken = localStorage.getItem('myToken');
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      setImageSrc(webcamRef.current.getScreenshot());

    },
    [webcamRef]
  );
  const delete_img = () => {
    setImageSrc(null);
  }
  const onSubmit = async e => {
    e.preventDefault();
    fetch(imageSrc)
    .then(res => res.blob())
    .then(blob => {
      const formData = new FormData();
      const file = new File([blob], "testfile.jpeg");
      formData.append('photo', file)
      fetch('/api/posts', {
        method: 'POST',
        headers: {
          'x-auth-token': authtoken
        },
        body: formData
      })
      .then( res => res.json() )
      .then( res => console.log(res) )
    })
  }

  if (!imageSrc) {
    return (
      <div className="webcam_box">
          <Webcam
            audio={false}
            height={500}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
            id="webcam"
          />
          <button className="btn_capture" onClick={capture}>Capture photo</button>
        </div>
    )
  } else {
    return (
      <div className="photo_box">
        <form
          id="upload_img"
          method="POST"
          enctype="multipart/form-data"
          onSubmit={e => onSubmit(e)}>
          <input
            type="image"
            name="image"
            value={imageSrc}
            src={imageSrc}
            alt="upload_image"
            required/>
          <button className="btn_badimg" onClick={delete_img}>X</button>
          <input type="submit" className="btn_upload" value="Upload"/>
        </form>
      </div>
    )
  }
}

const PhotoBooth = () => {
  return (
  <body>
    <div id="main">
      <div class="photobooth">
        <PhotoDisplay/>
      </div>
    </div>
  </body>
  );
};

export default PhotoBooth;