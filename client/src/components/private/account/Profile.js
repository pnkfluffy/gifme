import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageCard from "../../public/ImageCard";
import ImageOverlay from "../../public/ImageOverlay";
import { fetchAllPosts } from '../../../utils/FetchPosts';
import fetchAuth from '../../../utils/FetchAuthclear';


const Profile = () => {
    const [imageGallery, setImageGallery] = useState([]);
	const [overlayData, setOverlayData] = useState(null);
	const [authInfo, setAuthInfo] = useState(null);

    const authToken = localStorage.getItem('myToken');
	const getPosts = async => {
        const config = {
            headers:{
                'x-auth-token': authToken
            }}
		const finalPosts = axios.get('api/posts/mine', config)
		finalPosts.then(res => {
			return fetchAllPosts(res.data);
		}).then(res => {
			setImageGallery(res);
		}).catch(err => {
			console.error(err);
		})
	}

	useEffect(() => {
		setAuthInfo(fetchAuth());
		getPosts();
	}, []);

	var body = document.body;
	const toggleOverlay = props => {
	  body.classList.toggle('noscroll');
	  if (props) {
	    setOverlayData(props.imageData);
	  } else {
	    setOverlayData(null);
	  }
	};
    
    return (
		<div id="main">
			<div className="structure">
				<div className="pic-container">
					{imageGallery.map(image => (
        				<ImageCard
        				  authInfo={authInfo}
        				  imageData={image}
        				  addOverlay={imageData => toggleOverlay({ imageData })}
        				/>
        				))}
				</div>
			</div>
			{overlayData ? (
                <ImageOverlay
                  authInfo={authInfo}
                  data={overlayData}
                  removeOverlay={() => toggleOverlay(null)}
                />
              ) : null}
		</div>
	)
}

export default Profile;