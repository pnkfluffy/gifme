import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAllPosts } from '../../../utils/FetchPosts';


const Uploads = () => {
    const [imageGallery, setImageGallery] = useState([]);

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
		getPosts();
	}, [])
    
    return (
		<body>
			<div id="main">
				<div className="structure">
					<div className="pic-container">
						{imageGallery.map(singleImg => (
							<div className="pic-frame">
								<img src={`${singleImg.image}`} alt="database_image" />
							</div>
						))}
					</div>
				</div>
			</div>
			<footer id="footer">
				<wr />
				&copy Jack&Jon all rights reserved.
    </footer>
		</body>
	)

}

export default Uploads;