import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchAllPosts } from "../../utils/FetchPosts";
import ImageCard from "./ImageCard";
import ImageOverlay from "./ImageOverlay";
import fetchAuth from '../../utils/FetchAuth';

const Home = () => {
  const [imageGallery, setImageGallery] = useState([]);
  const [overlayData, setOverlayData] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);

  const getPosts = async => {
    const finalPosts = axios.get("api/posts/all");
    finalPosts
      .then(res => {
        return fetchAllPosts(res.data);
      })
      .then(res => {
        console.log(res);
        setImageGallery(res);
      })
      .catch(err => {
        console.error(err);
      });
  };

  useEffect(() => {
    setAuthInfo(fetchAuth());
    getPosts();
  }, []);

  var body = document.body;
  const toggleOverlay = props => {
    body.classList.toggle('noscroll');
    if (props) {
      setOverlayData(props.imageData);
    } else {
      setOverlayData(null);
    }
  };

  return (
    <div>
      <div id="main">
        <div className="home_imagegallery">
          {imageGallery.map(image => (
            <ImageCard
              authInfo={authInfo}
              imageData={image}
              addOverlay={imageData => toggleOverlay({ imageData })}
            />
            ))}
        </div>
      </div>
      <footer id="footer">
        &#169; Jack&Jon all rights reserved.
      </footer>
              {overlayData ? (
                <ImageOverlay
                  authInfo={authInfo}
                  data={overlayData}
                  removeOverlay={() => toggleOverlay(null)}
                />
              ) : null}
    </div>
  );
};

export default Home;
