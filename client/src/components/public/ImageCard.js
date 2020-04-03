import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import noLikeHeart from "../../resources/heart_purple.png";
import likeHeart from "../../resources/heart_red.png";
import { delImage } from "../../utils/DeleteImage";

const Likes = ({ imageID, hasLiked, setHasLiked }) => {
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

  // //  checks if user has liked posts, and updates ui
  // useEffect(() => {
  //   if (likes.length) {
  //     authInfo.then(res => {
  //       if (res) {
  //         const myLikes = likes.some(like => like.user.toString() === res._id);
  //         setHasLiked(myLikes);
  //       }
  //       // else, the user is not logged in
  //     });
  //   }
  // }, []);

  if (hasLiked) {
    return (
      <div className="image_card_like" onClick={e => unLikePost(e)}>
        <img alt="likeHeart" src={likeHeart} className="image_card_heart" />
      </div>
    );
  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
      <img src={noLikeHeart} className="image_card_heart" />
    </div>
  );
};

const ImageCard = ({ imageData, addOverlay, authInfo }) => {
  const [isUsersPost, setIsUsersPost] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  //  checks if user has liked posts, and updates ui
  useEffect(() => {
    authInfo.then(res => {
      if (res) {
        const myLikes = imageData.likes.some(
          like => like.user.toString() === res._id
        );
        setHasLiked(myLikes);
        if (imageData.userID === res._id) {
          setIsUsersPost(true);
        }
      }
      // else, the user is not logged in
    });
  }, []);

  return (
    <div className="image_card">
      <div className="image_card_name">
        <Link
          className="image_card_name_text"
          to={`/profile/${imageData.userID}`}
        >
          {imageData.user}
        </Link>
        {isUsersPost && (
          <div className="feature_container">
            <div
              className="image_card_delete"
              onClick={() => delImage(imageData.imageID, imageData.userID)}
            >
              x
            </div>
          </div>
        )}
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
        <Likes
          imageID={imageData.imageID}
          hasLiked={hasLiked}
          setHasLiked={e => setHasLiked(e)}
        />
      </div>
    </div>
  );
};

export default ImageCard;
