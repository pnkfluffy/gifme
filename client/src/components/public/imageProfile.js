import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router';
import { fetchPost } from '../../utils/FetchPosts';


const ImageProfile = () => {
	const [imageGallery, setImageGallery] = useState([]);

	let params  = useParams("/image/:imageID");
	const {imageID} = params;
    console.log('imageID:', imageID)
    console.log('imageGallery:', imageGallery)
    
    const getPost = async => {
		const post = fetchPost(imageID);
		setImageGallery(post);
}

	useEffect(() => {
		getPost();
	}, []);
//  Here look for the return to work
	return (
		<div>
			<div>
				{imageGallery ?(image => (
                    <img
                    alt="database_image"
                    src={`${image.image}`}/>
        			)) : <div>loading</div>}
			</div>
		</div>
    )
}

export default ImageProfile;