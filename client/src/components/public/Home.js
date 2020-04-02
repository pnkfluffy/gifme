import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

import { fetchAllPosts } from "../../utils/FetchPosts";
import ImageCard from "./ImageCard";
import ImageOverlay from "./ImageOverlay";
import fetchAuth from "../../utils/FetchAuth";
import loader from '../../utils/loader';

function galleryReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, ...action.payload];
  }
}

function numLoadedReducer(state, action) {
  return state + action;
}

const Home = () => {
  const [imageGallery, setImageGallery] = useReducer(galleryReducer, []);
  const [overlayData, setOverlayData] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);

  const [numLoaded, addNumLoaded] = useReducer(numLoadedReducer, 0);
  const [postsMetaData, setPostsMetaData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const getPostData = () => {
    const finalPosts = axios.get("api/posts/all");
    finalPosts
      .then(res => {
        setPostsMetaData(res.data);
        return res.data;
      })
      .catch(err => {
        console.error(err);
      });
    return finalPosts;
  };

  const getPosts = numPosts => {
    if (!postsMetaData.length || !hasMore) {
      return;
    }
    setLoading(true);
    console.log("loaded", numLoaded);
    const newArray = postsMetaData.slice(numLoaded, numLoaded + numPosts);
    addNumLoaded(numPosts);
    if (numLoaded > postsMetaData.length) {
      setHasMore(false);
    }
    fetchAllPosts(newArray)
      .then(res => {
        setImageGallery({ type: "add", payload: res });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  };

  //  loads more posts if user has reached the bottom of the page
  const handleScroll = () => {
    const totalPageHeight =
      window.innerHeight + document.documentElement.scrollTop;
    const docHeight = document.documentElement.offsetHeight;
    if (totalPageHeight !== docHeight || !hasMore) {
      return;
    }
    getPosts(5);
  };

  // gets auth info and all posts and saves them to state
  useEffect(() => {
    setAuthInfo(fetchAuth());
    getPostData();
  }, []);

  // loads the first 10 posts once the post metadata is fetched
  useEffect(() => {
    if (numLoaded === 0) {
      getPosts(5);
    }

    // adds an event listener to check if user has scrolled to the bottom
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postsMetaData, loading, numLoaded]);

  // checks if the initial loading of posts fills up the page. If not, loads more
  useEffect(() => {
    if (document.documentElement.offsetHeight < window.innerHeight + 200) {
      getPosts(5);
    }
  }, [imageGallery]);

  // useEffect(() => {}, [imageGallery]);

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

  let items = [];

  imageGallery.map(image => {
    items.push(
      <ImageCard
        authInfo={authInfo}
        imageData={image}
        isAuth={null}
        addOverlay={imageData => toggleOverlay({ imageData })}
      />
    );
  });

  return (
    <div>
      <div id="main">
        <div className="home_imagegallery">{items}</div>
        {loading && loader}
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