import React, { useState, useEffect } from 'react';

const addUserComment = (comments) => {



}

const CommentsBox = (comments) => {
	const [ isCommenting, setIsCommenting ] = useState(null);
	return (
			<p className="image_card_comment_text">{comments[0] ? comments[0] : 'comment'}</p>
		)
	}

const ImageCard = (image) => {
	console.log(image);
	return (
	<div className="image_card">
		<div className="image_card_name">
			<p className="image_card_name_text">{image.user}</p>
		</div>
		<div className="pic_frame">
			<img className="image_card_image" src={`${image.image}`} alt="database_image"/>
		</div>
		<div className="image_card_comments">
			<CommentsBox comments={image.comments}/>
		<p className="image_card_name_text">{image.comments[0]}</p>
		</div>
	</div>
	)
}

export default ImageCard;