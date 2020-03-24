import React, { useState, useEffect } from "react";
import axios from "axios";

import { fetchAllPosts } from "../../utils/FetchPosts";
import ImageCard from "./ImageCard";
import ImageOverlay from "./ImageOverlay";
import fetchAuth from "../../utils/FetchAuth";

const Home = () => {
  const [imageGallery, setImageGallery] = useState([]);
  const [overlayData, setOverlayData] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);

  const [numLoaded, setNumLoaded] = useState(0);
  const [postsMetaData, setPostsMetaData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getPostData = () => {
    const finalPosts = axios.get("api/posts/all");
    finalPosts
      .then(res => {
        console.log(res.data);
        setPostsMetaData(res.data);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const getPosts = numPosts => {
	const list = document.getElementById('main');
	if (!postsMetaData.length || !hasMore) {
      return;
    }
    setLoading(true);
    const newArray = postsMetaData.slice(numLoaded, numLoaded + numPosts);
    setNumLoaded(numLoaded + numPosts);
    if (numLoaded > postsMetaData.length) {
      setHasMore(false);
    }
    fetchAllPosts(newArray)
      .then(res => {
        console.log("getposts", res);
        const newImageGallery = [...imageGallery, ...res];
        console.log("newimgs", newImageGallery);
        setImageGallery(newImageGallery);
        setLoading(false);
        console.log("imggallry", imageGallery);
      })
      .catch(err => {
        console.error(err);
      });
  };

  // gets auth info and all posts and saves them to state
  useEffect(() => {
    setAuthInfo(fetchAuth());
    getPostData();
  }, []);

  // loads the first 10 posts once the post metadata is fetched
  useEffect(() => {
    getPosts(10);
  }, [postsMetaData]);


  // toggles overlay by updating the overlayData state
  var body = document.body;
  const toggleOverlay = props => {
    body.classList.toggle("noscroll");
    if (props) {
      setOverlayData(props.imageData);
    } else {
      setOverlayData(null);
    }
  };

  const loader = <div className="loader">Loading...</div>;

  const loadMore = (
    <div className="load_more_btn">
      <button onClick={() => getPosts(5)}>Load More!</button>
    </div>
  );

  let items = [];

  imageGallery.map(image => {
    items.push(
      <ImageCard
        authInfo={authInfo}
        imageData={image}
        addOverlay={imageData => toggleOverlay({ imageData })}
      />
    );
  });

  return (
    <div>
      <div id="main">
        <div className="home_imagegallery">{items}</div>
        {loading ? loader : loadMore}
      </div>
      <footer id="footer"></footer>
      &#169; Jack&Jon all rights reserved.
      {/* if state has imageData, then display overlay. toggleOverlay function 
			passed in to toggle the overlay off when user clicks out */}
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
