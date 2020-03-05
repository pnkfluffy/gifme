import React, { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { fetchAllPosts } from '../../utils/FetchPosts';
import ImageCard from './ImageCard';

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

	const toggleOverlay = (overlayData) => {
		console.log("toggle", overlayData);
	}

	const ImageOverlay = (image) => {
		return (<h1>hi</h1>)
	}

	return (
		<body>
			<div id="main">
				<ImageOverlay/>
				<div className="structure">
					{imageGallery.map(image =>
					<ImageCard
					imageData={image}
					onToggle={x => toggleOverlay({x})}/>)}
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
// export { OverlayContext };