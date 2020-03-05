import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { fetchAllPosts } from '../../utils/FetchPosts';
import ImageCard from './ImageCard';

import downloadIcon from '../../resources/download_icon.png';
import facebookIcon from '../../resources/facebook_icon.png';
import twitterIcon from '../../resources/twitter_icon.png';
import discordIcon from '../../resources/discord_icon.png';


const OverlayComment = (commentData) => {
	console.log(commentData);
	return(
		<div className="overlay_comment_single">
			<div className="overlay_comment_topbar">
				<div className="overlay_comment_name">
					{commentData.name}
				</div>
				<div className="overlay_comment_date">
					{commentData.date}
				</div>
			</div>
			<div className="overlay_comment_content">
				{commentData.text}
			</div>
		</div>
	)
}

const Home = () => {
	const [imageGallery, setImageGallery] = useState([]);
	const [overlayData, setOverlayData] = useState(null);

	const getPosts = async => {
		const finalPosts = axios.get('api/posts/all')
		finalPosts.then(res => {
			return fetchAllPosts(res.data);
		}).then(res => {
			console.log(res);
			setImageGallery(res);
		}).catch(err => {
			console.error(err);
		})
	}

	useEffect(() => {
		getPosts();
	}, [])

	const displayOverlay = (props) => {
		setOverlayData(props.imageData);
	}

	const removeOverlay = e => {
		setOverlayData(null);
	}

	const stopProp = e => {
		e.stopPropagation();
	}

	const ImageOverlay = (props) => {
		const [ comment, setComment ] = useState("");
	
		const onChange = e => setComment(e.target.value);
		const onSubmit = async e => {
		  e.preventDefault();
		  const auth_token = localStorage.getItem("myToken");
		  
		  const commentInfo = {
			text: comment
		  }
		  const body = JSON.stringify(commentInfo);
		  const config = {
			headers:{
			  'x-auth-token': auth_token,
			  'content-type': 'application/json'
			}}
			axios.post(`api/posts/comment/${props.data.imageID}`, body, config)
			.then(res => {
			  console.log("comment posted:", res.data);
			  console.log(res.data);
		  })
		  .catch(err => {
			console.error("myerror: ", err.response);
		  })
		};		
		
		if (props.data) {
			const  allComments = props.data.comments;
			return (
				<div className="overlay" onClick={e => removeOverlay(e)}>
					<div className="overlay_card" onClick={e => stopProp(e)}>
						<div className="overlay_pic_frame">
        					<img
        					  className="image_card_image"
        					  src={`${props.data.image}`}
        					  alt="database_image"
        					/>
      					</div>
						<div className="overlay_export_box">
							<div className="overlay_export_btn">
								<img src={downloadIcon} alt="download"></img>
							</div>
							<div className="overlay_export_btn">
								<img src={facebookIcon} alt="download" className="overlay_export_btn_fb"></img>
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
									rows="5"
									cols="50"
          						  value={comment}
          						  onChange={e => onChange(e)}
          						  placeholder="leave a comment"
          						  required="required"
          						  className="overlay_comment_input"
          						/>
								<button type="submit" className="overlay_comment_submit">submit</button>
							</form>
						</div>
						<div className="overlay_all_comments">
							{allComments.map(commentData => 
								OverlayComment(commentData))}
						</div>
					</div>
				</div>
		)}
		return (
			<div></div>
		)
	}

	return (
		<body>
			<div id="main">
				<ImageOverlay data={overlayData}/>
				<div className="structure">
					{imageGallery.map(image =>
						<ImageCard
						imageData={image}
						onToggle={imageData => displayOverlay({imageData})}/>)}
				</div>
			</div>
			<footer id="footer">
				<wr />
				&#169; Jack&Jon all rights reserved.
    </footer>
		</body>
	)
}

export default Home;