import React, { useState, useEffect, Link } from "react";
import axios from "axios";
import {delImage} from '../../utils/DeleteImage';

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
        &#9829;
      </div>
    );
  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
      &#9825;
    </div>
  );
};

// REMOVE IS COMMENTING AND SETISCOMMENTS
// REPLACE WITH TAGS --
// IGNORE THIS ENTIRE FUNCTION AND DON'T
// USE COPY IT TO THE USER POSTS PAGE
const CommentsBox = imageInfo => {
  const [isCommenting, setIsCommenting] = useState(null);
  const [comment, setComment] = useState('');

  const seeCommentBox = e => {
    setIsCommenting(true);
  };
  const closeCommentBox = () => {
    setIsCommenting(false);
  };
  const onChange = e => setComment(e.target.value);
  const onSubmit = async e => {
    e.preventDefault();
    const auth_token = localStorage.getItem("myToken");

    const commentInfo = {
      text: comment
    };
    const body = JSON.stringify(commentInfo);
    const config = {
      headers: {
        "x-auth-token": auth_token,
        "content-type": "application/json"
      }
    };
    axios
      .post(`api/posts/comment/${imageInfo.imageID}`, body, config)
      .then(res => {
        console.log("comment posted:", res.data);
        setIsCommenting(false);
        console.log(res.data);
      })
      .catch(err => {
        console.error("myerror: ", err.response);
      });
  };

  if (isCommenting) {
    return (
      <div className="image_card_leave_comment">
        <form onSubmit={e => onSubmit(e)} className="add_comment_form">
          <input
            name="comment"
            type="text"
            value={comment}
            onChange={e => onChange(e)}
            placeholder="comment"
            required="required"
            className="add_comment_box"
          />
          <button type="submit" className="add_comment_submit">
            &#x2713;
          </button>
        </form>
        <button className="add_comment_exit" onClick={() => closeCommentBox()}>
          &#x2717;
        </button>
      </div>
    );
  }

  return (
    <div className="image_card_comment_text" onClick={e => seeCommentBox(e)}>
      {imageInfo.comments[0] ? imageInfo.comments[0].text : "add comment"}
    </div>
  );
};
//  ^^CHANGE COMMENTS TO TAGS, MAKE EACH ONE LINK TO SEARCH WHEN CLICKED^^


const ImageCard = ({ imageData, addOverlay, authInfo, isAuth }) => {
  return (
    <div className="image_card">
      <div className="image_card_name">
        <div className="image_card_name_text"  onClick={() => window.location.href =`/${imageData.userID}`}>{imageData.user}</div>
        {isAuth ?
        <div className="feature_container">
        <div className="delete_button" onClick={() => delImage(imageData.imageID)}>x</div>
        </div>
        : null}
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
      <div className="image_card_comment_like">
		  {/* passes all info to likes */}
        <Likes likes={imageData.likes} imageID={imageData.imageID} authInfo={authInfo}/>
        <CommentsBox
          comments={imageData.comments}
          imageID={imageData.imageID}
        />
      </div>
    </div>
  );
};

export default ImageCard;
