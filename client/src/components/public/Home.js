import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAllPosts } from '../../utils/FetchPosts';
import ImageCard from './ImageCard';

const Home = () => {
	const [imageGallery, setImageGallery] = useState([]);

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

	return (
		<body>
			<div id="main">
				<div className="structure">
					{imageGallery.map(image => ImageCard(image))}
				</div>
			</div>
			<footer id="footer">
				<wr />
				&copy Jack&Jon all rights reserved.
    </footer>
		</body>
	)
}

export default Home;