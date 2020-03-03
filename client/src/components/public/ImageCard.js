import React, { useState } from "react";
import axios from "axios";

const Likes = (likeInfo) => {
  const likePost = e => {

  }
  return (
    <div className="image_card_like" onClick={e => likePost(e)}>
      {likeInfo.liked ? '\u2665' : '\u2661'}
    </div>
  )
}

const CommentsBox = (imageInfo) => {
  const [isCommenting, setIsCommenting] = useState(null);
  const [comment, setComment] = useState("");

  console.log("imageinfo", imageInfo);
  const seeCommentBox = e => {
    setIsCommenting(true);
  };
  const closeCommentBox = () => {
    setIsCommenting(false);
  }
  const onChange = e => setComment(e.target.value);
  const onSubmit = async e => {
    e.preventDefault();
    const auth_token = localStorage.getItem("myToken");
    
    const commentInfo = {
      text: comment
    }
    // console.log(commentInfo);
    const body = JSON.stringify(commentInfo);
    const config = {
      headers:{
        'x-auth-token': auth_token,
        'content-type': 'application/json'
      }}
      axios.post(`api/posts/comment/${imageInfo.imageID}`, body, config)
      .then(res => {
        console.log("comment posted:", res.data);
        setIsCommenting(false);
        console.log(res.data);
      //setComment(res.data[0]);
    })
    .catch(err => {
      console.error("myerror: ", err.response);
    })
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
          <button type="submit" className="add_comment_submit">&#x2713;</button>
        </form>
        <button className="add_comment_exit" onClick={() => closeCommentBox()}>&#x2717;</button>
      </div>
    );
  }

  return (
    <div className="image_card_comment_text" onClick={e => seeCommentBox(e)}>
      {imageInfo.comments[0] ? imageInfo.comments[0].text : "add comment"}
    </div>
  );
};

const ImageCard = image => {
  return (
    <div className="image_card">
      <div className="image_card_name">
        <div className="image_card_name_text">{image.user}</div>
      </div>
      <div className="pic_frame">
        <img
          className="image_card_image"
          src={`${image.image}`}
          alt="database_image"
        />
      </div>
      <div className="image_card_comment_like">
        <Likes liked={image.liked} imageID={image.imageID}/>
        <CommentsBox comments={image.comments} imageID={image.imageID}/>
      </div>
    </div>
  );
};

export default ImageCard;
