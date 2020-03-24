import React, { useState, useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";

import { fetchAllPosts } from "../../utils/FetchPosts";
import ImageCard from "./ImageCard";
import ImageOverlay from "./ImageOverlay";
import fetchAuth from "../../utils/FetchAuth";

const Home = () => {
  const [imageGallery, setImageGallery] = useState([]);
  const [overlayData, setOverlayData] = useState(null);
  const [authInfo, setAuthInfo] = useState(null);

  const [numLoaded, setNumLoaded] = useState(0);
  const [metaImages, setMetaImages] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const getPostData = () => {
    const finalPosts = axios.get("api/posts/all");
    finalPosts
      .then(res => {
        console.log(res.data);
        setMetaImages(res.data);
        // return fetchAllPosts(res.data);
      })
      //   .then(res => {
      //     console.log(res);
      //     setImageGallery(res);
      //   })
      .catch(err => {
        console.error(err);
      });
  };

  const getPosts = () => {
    if (metaImages.length) {
      const newArray = metaImages.slice(numLoaded, numLoaded + 5);
      setNumLoaded(numLoaded + 5);
      if (numLoaded > metaImages.length) {
        setHasMore(false);
      }
      fetchAllPosts(newArray)
        .then(res => {
		  console.log("getposts", res);
		  const newImageGallery = [...imageGallery, ...res];
		  console.log("newimgs", newImageGallery);
          setImageGallery(newImageGallery);
          console.log("imggallry", imageGallery);
        })
        .catch(err => {
          console.error(err);
        });
    }
  };

  // gets auth info and all posts and saves them to state
  useEffect(() => {
    setAuthInfo(fetchAuth());
    getPostData();
  }, []);

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

  let items = [];

  imageGallery.map(image => {
    console.log("THISISIMAGE", image);
    items.push(
      <ImageCard
        authInfo={authInfo}
        imageData={image}
        addOverlay={imageData => toggleOverlay({ imageData })}
      />
    );
  });

  //   useEffect(() => {
  // 	imageGallery.map(image => {
  // 	  setImageCards(imageCards.push(
  // 		<ImageCard
  // 		  authInfo={authInfo}
  // 		  imageData={image}
  // 		  addOverlay={imageData => toggleOverlay({ imageData })}
  // 		/>
  // 	  ))
  // 	});

  // }, [imageCards])

  return (
    <div>
      <div id="main">
        {/* {metaImages.length ? ( */}
          <InfiniteScroll
            loadMore={getPosts} //call loading API
            hasMore={hasMore}
            loader={loader}
          >
            <div className="home_imagegallery">{items}</div>
          </InfiniteScroll>
        {/* ) : null} */}
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
