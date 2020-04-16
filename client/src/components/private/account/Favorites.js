import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router";
import axios from "axios";
import ImageCard from "../../public/ImageCard";
import ImageOverlay from "../../public/ImageOverlay";
import { fetchAllPosts } from "../../../utils/FetchPosts";
import fetchAuth from "../../../utils/FetchAuth";
import loader from "../../../utils/loader";

function galleryReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, ...action.payload];
  }
}

function numLoadedReducer(state, action) {
  return state + action;
}

//	FIX AUTHENTICATION ERRORS

const Profile = () => {
  const [imageGallery, setImageGallery] = useReducer(galleryReducer, []);
  const [overlayData, setOverlayData] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);
  const [usersProfile, setUsersProfile] = useState(null);

  const [numLoaded, addNumLoaded] = useReducer(numLoadedReducer, 0);
  const [postsMetaData, setPostsMetaData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("myToken");
  let params = useParams("/profile/:userID");
  const { userID } = params;

  const isUsersProfile = () => {
    const config = {
      headers: {
        "x-auth-token": authToken
        //logged user
      }
    };
    const isUsersProfile = axios.get(`/api/auth/${userID}`, config);
    isUsersProfile.then(res => {
      setUsersProfile(res.data);
    });
  };

  const getPostData = () => {
    const finalPosts = axios.get(`/api/posts/favorites/${userID}`);
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

  const handleScroll = () => {
    const totalPageHeight =
      window.innerHeight + document.documentElement.scrollTop;
    const docHeight = document.documentElement.offsetHeight;
    if (totalPageHeight !== docHeight || !hasMore) {
      return;
    }
    getPosts(1);
  };

  var body = document.body;
  const toggleOverlay = props => {
    if (document.documentElement.offsetHeight > window.innerHeight) {
      body.classList.toggle("noscroll");
    }
    if (props) {
      setOverlayData(props.imageData);
    } else {
      setOverlayData(null);
    }
  };

  // loads the first 10 posts once the post metadata is fetched
  useEffect(() => {
    if (numLoaded === 0) {
      getPosts(1);
    }

    // adds an event listener to check if user has scrolled to the bottom
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postsMetaData, loading, numLoaded]);

  // checks if the initial loading of posts fills up the page. If not, loads more
  useEffect(() => {
    if (document.documentElement.offsetHeight < window.innerHeight + 200) {
      getPosts(1);
    }
  }, [imageGallery]);

  useEffect(() => {
    setAuthInfo(fetchAuth());
    getPostData();
    isUsersProfile();
  }, []);

  let items = [];

  imageGallery.map(image => {
    items.push(
      <ImageCard
        authInfo={authInfo}
        imageData={image}
        addOverlay={imageData => toggleOverlay({ imageData })}
        isUsersProfile={usersProfile}
      />
    );
  });

  return (
    <div>
        <h1>Favorites</h1>
      <div id="main">
        <div className="home_imagegallery">{items}</div>
    {loading && loader}
      </div>
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

export default Profile;
