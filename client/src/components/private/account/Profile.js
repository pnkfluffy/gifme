import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router';
import axios from 'axios';
import ImageCard from "../../public/ImageCard";
import ImageOverlay from "../../public/ImageOverlay";
import { fetchAllPosts } from '../../utils/FetchPosts';
import fetchAuth from '../../utils/FetchAuth';


const Profile = () => {
	const [imageGallery, setImageGallery] = useState([]);
	const [overlayData, setOverlayData] = useState(null);
	const [authInfo, setAuthInfo] = useState(null);
	const [authorize, setAuthorize] = useState(null);

	const authToken = localStorage.getItem('myToken');
	let params  = useParams("/:userID");
	const {userID} = params;

	const isAuth = async =>{
		const config = {
            headers:{
				'x-auth-token': authToken
				//logged user
			}}
		const isAuth = axios.get(`/api/auth/${userID}`, config)
		isAuth.then(res => {setAuthorize(res.data)});
	}

	const getPosts = async => {
		const allPosts = axios.get(`/api/posts/${userID}`)
		allPosts.then(res => {
			return fetchAllPosts(res.data);
		}).then(res => {
			setImageGallery(res);
		}).catch(err => {
			console.error(err);
		});
	}

	useEffect(() => {
		setAuthInfo(fetchAuth());
		getPosts();
		isAuth();
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
		<div>
		<div id="main">
				<div className="home_imagegallery">
					{imageGallery.map(image => (
        				<ImageCard
						  authInfo={authInfo}
						  isAuth={authorize}
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