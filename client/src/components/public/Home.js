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
		if (props.data) {
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
// export { OverlayContext };