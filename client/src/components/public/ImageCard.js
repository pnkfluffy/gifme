import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import noLikeHeart from "../../resources/heart_purple.png";
import likeHeart from "../../resources/heart_red.png";
import { delImage } from "../../utils/DeleteImage";
import VerificationPopup from "../../utils/VerificationPopup";

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
        console.error(err.response);
      });
  };

  if (hasLiked) {
    return (
      <div className="image_card_like" onClick={e => unLikePost(e)}>
        <img alt="likeHeart" src={likeHeart} className="image_card_heart" />
      </div>
    );
  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
      <img src={noLikeHeart} alt="noLikeHeart" className="image_card_heart" />
    </div>
  );
};

const ImageCard = ({ imageData, addOverlay, authInfo, whosProfile }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isUsersPost, setIsUsersPost] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);
  const [onUsersProfile, setOnUsersProfile] = useState(false);

  //  checks if user has liked posts, and updates ui
  useEffect(() => {
    authInfo.then(res => {
      if (res) {
        setLoggedIn(true);
        const myLikes = imageData.likes.some(
          like => like.user.toString() === res._id
        );
        setHasLiked(myLikes);
        if (imageData.userID === res._id) {
          setIsUsersPost(true);
        }
        if (whosProfile === res._id) {
          setOnUsersProfile(true);
        }
      }
      // else, the user is not logged in
    });
  }, []);

  const maxNameLength = 18;
  const popupMessage="Are you sure you want to delete this image?";
  const yesMessage="DELETE";
  const noMessage="nevermind";

  return (
    <div className="image_card">
      {confirmDeletion && (
        <VerificationPopup
          popupMessage={popupMessage}
          leftButtonMessage={yesMessage}
          leftButtonFunction={() => delImage(imageData.imageID, imageData.userID)}
          rightButtonMessage={noMessage}
          rightButtonFunction={() => setConfirmDeletion(false)}
        />
      )}
      <div className="image_card_name">
        <Link
          className={`image_card_name_text${isUsersPost ? '_user' : ''}`}
          to={`/profile/${imageData.userID}`}
        >
          {/* limits the length of usernames so they don't overflow */}
          {imageData.user.length > maxNameLength ? `${imageData.user.substring(0, maxNameLength)}...` : imageData.user }
        </Link>
        {onUsersProfile && (
          <div className="feature_container">
            <div
              className="image_card_delete"
              onClick={() => setConfirmDeletion(true)}
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
        {loggedIn ? <Likes
          imageID={imageData.imageID}
          hasLiked={hasLiked}
          setHasLiked={e => setHasLiked(e)}
        /> : null}
      </div>
    </div>
  );
};

export default ImageCard;
