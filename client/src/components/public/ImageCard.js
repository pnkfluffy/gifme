import React, { useState } from "react";

const addUserComment = comments => {};

const CommentsBox = (comments, imageID) => {
  const [ isCommenting, setIsCommenting ] = useState(null);
  const [ comment, setComment ] = useState('');

  const seeCommentBox = e => {
    setIsCommenting(true);
  };

//use imageID

  const onChange = e => setComment( e.target.value );

  const onSubmit = async e => {
    e.preventDefault();
}

  if (isCommenting) {
    return (
      <div>
        <form onSubmit={e => onSubmit(e)} className="add_comment_form">
			<input name="comment" type="text" value={comment} onChange={e => onChange(e)} placeholder="comment" required="required" className="add_comment_box"/>
		</form>
      </div>
    );
  }

  return (
    <div className="image_card_comment_text" onClick={e => seeCommentBox(e)}>
      {comments[0] ? comments[0] : "comment"}
    </div>
  );
};

const ImageCard = image => {
  console.log(image);
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
      <div className="image_card_comments">
        <CommentsBox comments={image.comments} imageID={image.imageID}/>
        <p className="image_card_name_text">{image.comments[0]}</p>
      </div>
    </div>
  );
};

export default ImageCard;
