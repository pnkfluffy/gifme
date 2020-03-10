import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from 'moment';

import downloadIcon from "../../resources/download_icon.png";
import facebookIcon from "../../resources/facebook_icon.png";
import twitterIcon from "../../resources/twitter_icon.png";
import discordIcon from "../../resources/discord_icon.png";

const OverlayComment = ({ commentData, postData, imageID, setAllComments }) => {
  let myComment;
  if (postData) {
    myComment = postData._id === commentData.user;
  }
  const authtoken = localStorage.getItem("myToken");

  const deleteComment = () => {
    // MAKE ARE YOU SURE POPUP

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
      {myComment ? (
        <div className="overlay_comment_mycomment">
          <div
            className="overlay_comment_delete"
            onClick={() => deleteComment()}
          >
            delete
          </div>
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

const OverlayLoginBox = () => (
  <Link to="/Signup">
    <div className="overlay_login_box">
      Please log in to comment, tag, or like posts.
    </div>
  </Link>
);

const ImageOverlay = ({ data, removeOverlay, authInfo }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [postData, setpostData] = useState();
  const [allComments, setAllComments] = useState([]);

  useEffect(() => {
    authInfo.then(res => {
      if (res) {
        setpostData(res);
        setLoggedIn(true);
      }
    });
    setAllComments(data.comments);
  }, []);

  return (
    <div className="overlay" onClick={e => removeOverlay(e)}>
      <div className="overlay_card" onClick={e => stopProp(e)}>
        <div className="overlay_pic_frame">
          <img
            className="image_card_image"
            src={`${data.image}`}
            alt="database_image"
          />
        </div>
        <div className="overlay_export_box">
          <div className="overlay_export_btn">
            <img src={downloadIcon} alt="download"></img>
          </div>
          <div className="overlay_export_btn">
            <img
              src={facebookIcon}
              alt="download"
              className="overlay_export_btn_fb"
            ></img>
          </div>
          <div className="overlay_export_btn">
            <img src={twitterIcon} alt="download"></img>
          </div>
          <div className="overlay_export_btn">
            <img src={discordIcon} alt="download"></img>
          </div>
        </div>
        {/* IF USER IS NOT LOGGED IN DISPLAY LOG IN BUTTON LIKE REDDIT! */}
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
              postData={postData}
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
