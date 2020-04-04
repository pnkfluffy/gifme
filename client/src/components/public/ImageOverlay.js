import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import newWindow from "../../resources/new_window_icon.png";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from "react-share";

import downloadIcon from "../../resources/download_icon.png";

const OverlayComment = ({ commentData, userID, imageID, setAllComments }) => {
  const authtoken = localStorage.getItem("myToken");

  // sees if comment is made by current logged in user
  // if so, sets myComment to true
  let myComment;
  if (userID) {
    myComment = userID === commentData.user;
  }

  // MAKE ARE YOU SURE POPUP FOR USER TO CONFIRM
  const deleteComment = () => {
    const config = {
      headers: {
        "x-auth-token": authtoken
      }
    };
    axios
      .delete(`/api/posts/comment/${imageID}/${commentData._id}`, config)
      .then(res => {
        console.log("comment deleted:", res.data);
        setAllComments(res.data);
      })
      .catch(err => {
        console.error("myerror: ", err.response);
      });
  };

  const myDate = new Date(commentData.date);
  const formattedDate = moment(myDate).format(`MMM DD [']YY`);

  return (
    <div className="overlay_comment_single">
      <div className="overlay_comment_topbar">
        {/* adds css to change color of username if comment left by logged in user */}
        <div
          className={
            "overlay_comment_name " +
            (myComment ? "overlay_comment_loggedin" : "")
          }
        >
          {commentData.name}
        </div>
        <div className="overlay_comment_date">{formattedDate}</div>
      </div>
      <div className="overlay_comment_content">{commentData.text}</div>
      {/* allows user to delete if comment left by logged in user */}
      {myComment ? (
        <div className="overlay_comment_mycomment">
          <div
            className="overlay_comment_delete"
            onClick={() => deleteComment()}
          >
            delete
          </div>
          {/* ADD ABILITY AND ROUTE TO EDIT COMMENTS */}
          {/* <div className="overlay_comment_edit">
              edit
              </div> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

// makes it so that only clicking on the background removes the overlay
const stopProp = e => {
  e.stopPropagation();
};

const OverlayCommentBox = ({ data, setAllComments }) => {
  const [comment, setComment] = useState("");

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
      .post(`api/posts/comment/${data.imageID}`, body, config)
      .then(res => {
        console.log("comment posted:", res.data);
        setComment("");
        setAllComments(res.data);
      })
      .catch(err => {
        console.error("myerror: ", err.response);
      });
  };
  return (
    <div className="overlay_comment_box">
      <form className="overlay_comment_form" onSubmit={e => onSubmit(e)}>
        <textarea
          name="comment"
          type="text"
          rows="3"
          cols="60"
          value={comment}
          onChange={e => onChange(e)}
          placeholder="leave a comment"
          required="required"
          className="overlay_comment_input"
        />
        <button type="submit" className="overlay_comment_submit">
          submit
        </button>
      </form>
    </div>
  );
};

// reroutes user to signup page if user not logged in
const OverlayLoginBox = () => (
  <Link to="/Signup">
    <div className="overlay_login_box">
      Please make an account to comment, tag, or like posts.
    </div>
  </Link>
);

const ImageOverlay = ({ data, removeOverlay, authInfo }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userID, setUserID] = useState();
  const [allComments, setAllComments] = useState([]);

  // sets user ID to change username colors in comments if left by user
  useEffect(() => {
    authInfo.then(res => {
      if (res) {
        setUserID(res._id);
        setLoggedIn(true);
      }
    });
    setAllComments(data.comments);
  }, []);

  const shareURL = `https://pnkfluffy.github.io/gifme/image/${data.imageID}`;
  const title = 'I made this image using gifme, check it out!'
  const hashtag = '#gifme'

  return (
    <div className="overlay" onClick={e => removeOverlay(e)}>
      {/* ^removes overlay if background is clicked^ */}
      <div className="overlay_card" onClick={e => stopProp(e)}>
        <div className="overlay_pic_frame">
          <Link className="image_card_view_img" to={`/image/${data.imageID}`}>
            <div className="overlay_img_top_right">
              <img src={newWindow} alt="view image" />
            </div>
          </Link>
          <img
            className="image_card_image"
            src={`${data.image}`}
            alt="database_image"
          />
        </div>
        <div className="overlay_export_box">
          <div className="overlay_export_btn">
            <a href={`${data.image}`} download="my_image.png">
              <img src={downloadIcon} alt="download"></img>
            </a>
          </div>
          {/* SOCIAL MEDIA BUTTONS DO NOT WORK YET. IMAGES CAN NOT BE EXPORTED AND
		  SHARED TO SOCIAL MEDIA. IN ORDER TO SHARE, EACH IMAGE/POST NEEDS ITS
		  OWN CUSTOM URL AND IT CAN BE SHARED AS A WEBPAGE */}
          <div className="overlay_export_btn">
            <FacebookShareButton url={shareURL} quote={title} hashtag={hashtag}>
              {/* <FacebookShareButton url='INSERT IMAGE LINK URL HERE'> */}
              <FacebookIcon size={50} round={true} />
            </FacebookShareButton>
          </div>
          <div className="overlay_export_btn">
            <TwitterShareButton url={shareURL} title={title} hashtags={hashtag}>
              <TwitterIcon size={50} round={true} />
            </TwitterShareButton>
          </div>
          <div className="overlay_export_btn">
            <WhatsappShareButton url={shareURL} title={title}>
              <WhatsappIcon size={50} round={true} />
            </WhatsappShareButton>
          </div>
        </div>
        {/* displays 'you must be logged in to comment' if not logged in */}
        {loggedIn ? (
          <OverlayCommentBox
            data={data}
            setAllComments={newComments => setAllComments(newComments)}
          />
        ) : (
          <OverlayLoginBox />
        )}

        <div className="overlay_all_comments">
          {allComments.map(commentData => (
            <OverlayComment
              commentData={commentData}
              userID={userID}
              imageID={data.imageID}
              setAllComments={newComments => setAllComments(newComments)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageOverlay;
