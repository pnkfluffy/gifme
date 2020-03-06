import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { fetchAllPosts } from "../../utils/FetchPosts";
import ImageCard from "./ImageCard";
import ImageOverlay from "./ImageOverlay";

const Home = () => {
  const [imageGallery, setImageGallery] = useState([]);
  const [overlayData, setOverlayData] = useState(null);

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
    <body>
      <div id="main">
        {overlayData ? (
          <ImageOverlay
            data={overlayData}
            removeOverlay={() => toggleOverlay(null)}
          />
        ) : null}
        <div className="structure">
          {imageGallery.map(image => (
            <ImageCard
              imageData={image}
              addOverlay={imageData => toggleOverlay({ imageData })}
            />
          ))}
        </div>
      </div>
      <footer id="footer">
        <wr />
        &#169; Jack&Jon all rights reserved.
      </footer>
    </body>
  );
};

export default Home;
