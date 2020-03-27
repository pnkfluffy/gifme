import React, { useState, useEffect } from "react";

import noLikeHeart from '../../resources/heart_purple.png';
import likeHeart from '../../resources/heart_red.png';

const Likes = ({likes, imageID, authInfo}) => {
  const [hasLiked, setHasLiked] = useState(null);
  const authToken = localStorage.getItem("myToken");

  // puts like from currently logged in user
  const likePost = async e => {
    fetch(`api/posts/like/${imageID}`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken
      }
    })
      .then(res => {
		//  ADD A POP UP THAT SAYS 'user must be logged in to like posts'
		//  'log in?' <--- link to log in page on click
        if (res.status === 401) {
          window.location.href = "/signup";
        }
        setHasLiked(true);
      })
      .catch(err => {
        console.error("stat", err.status);
      });
  };
  const unLikePost = e => {
    fetch(`api/posts/unlike/${imageID}`, {
      method: "PUT",
      headers: {
        "x-auth-token": authToken
      }
    })
      .then(res => {
        if (res.status === 401) {
          window.location.href = "/login";
        }
        setHasLiked(false);
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  //  checks if user has liked posts, and updates ui
  useEffect(() => {
    if (likes.length) {
      authInfo.then( res => {
        if (res) {
          const myLikes = likes.some(like => like.user.toString() === res._id);
          setHasLiked(myLikes);
        }
        // else, the user is not logged in
      })
    }
  }, []);

  if (hasLiked) {
    return (
      <div className="image_card_like" onClick={e => unLikePost(e)}>
        <img src={likeHeart} className="image_card_heart"/>
      </div>
    );
  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
        <img src={noLikeHeart} className="image_card_heart"/>
    </div>
  );
};


const ImageCard = ({ imageData, addOverlay, authInfo }) => {
  return (
    <div className="image_card">
      <div className="image_card_name">
        <div className="image_card_name_text">{imageData.user}</div>
      </div>
      <div className="pic_frame">
		  {/* calls function from home to open imageoverlay with imagedata */}
        <img
          className="image_card_image"
          src={`${imageData.image}`}
          alt="database_image"
          onClick={() => addOverlay(imageData)}
        />
      </div>
      <div className="image_card_bottom">
        <Likes likes={imageData.likes} imageID={imageData.imageID} authInfo={authInfo}/>
      </div>
    </div>
  );
};

export default ImageCard;
