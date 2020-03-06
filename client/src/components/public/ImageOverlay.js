import React, { useState, useEffect } from "react";
import axios from "axios";

import downloadIcon from "../../resources/download_icon.png";
import facebookIcon from "../../resources/facebook_icon.png";
import twitterIcon from "../../resources/twitter_icon.png";
import discordIcon from "../../resources/discord_icon.png";

const OverlayComment = commentData => {
  return (
    <div className="overlay_comment_single">
      <div className="overlay_comment_topbar">
        <div className="overlay_comment_name">{commentData.name}</div>
        <div className="overlay_comment_date">{commentData.date}</div>
      </div>
      <div className="overlay_comment_content">{commentData.text}</div>
    </div>
  );
};

const stopProp = e => {
  e.stopPropagation();
};

const ImageOverlay = ({ data, removeOverlay }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

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
        console.log(res.data);
        setComment("");
        setAllComments(res.data);
      })
      .catch(err => {
        console.error("myerror: ", err.response);
      });
  };

  useEffect(() => {
    setAllComments(data.comments);
  }, [])

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
          <div className="overlay_all_comments">
            {allComments.map(commentData => OverlayComment(commentData))}
          </div>
        </div>
      </div>
    );
};

export default ImageOverlay;
