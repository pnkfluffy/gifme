import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAllPosts } from '../../utils/FetchPosts';

const Home = () => {
	const [imageGallery, setImageGallery] = useState([]);

	const getPosts = async => {
		const finalPosts = axios.get('api/posts/all')
		finalPosts.then(res => {
			return fetchAllPosts(res.data);
		}).then(res => {
			setImageGallery(res);
		})
	}

	useEffect(() => {
		getPosts();
	}, imageGallery)

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
		</body>
	)
}

export default Home;