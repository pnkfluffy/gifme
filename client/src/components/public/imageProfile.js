import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router';
import axios from 'axios';
import { fetchAllPosts } from '../../utils/FetchPosts';


const ImageProfile = () => {
	const [imageGallery, setImageGallery] = useState([]);

	let params  = useParams("/image/:imageID");
	const {imageID} = params;
    console.log('imageID:', imageID)
    console.log('imageGallery:', imageGallery)
    
    const getPosts = async => {
	const allPosts = axios.get(`/api/posts/image/${imageID}`)
	allPosts.then(res => {
		return fetchAllPosts(res.data);
	}).then(res => {
		setImageGallery(res);
	}).catch(err => {
		console.error(err);
    });
}

	useEffect(() => {
		getPosts();
	}, []);

	return (
		<div>
			<div >
				{imageGallery.map(image => (
                    <img 
                    alt="database_image"
                    src={`${image.image}`}/>
        			))}
			</div>
		</div>
    )
}

export default ImageProfile;