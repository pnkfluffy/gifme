import React, { useState, useEffect } from 'react';
import axios from 'axios';

const binaryToB64 = (binary) => {
	const newImage = btoa(
		new Uint8Array(binary)
		.reduce((data, byte) => data + String.fromCharCode(byte), '')
	);
	const finalImage = `data:image/jpeg;base64,${newImage}`;
	return (finalImage);
}

const fetchPost = async (imageID) => {
	console.log(`Fetching ${imageID}`);
	const arrayBuffer = await axios.get(`/api/posts/image/${imageID}`, { responseType: 'arraybuffer' });
	const metaData = await axios.get(`/api/posts/meta/${imageID}`);
	return Promise.all([arrayBuffer, metaData])
	.then(function([arrayBuffer, metaData]) {
		console.log("1: ", arrayBuffer);
		console.log("2: ", metaData);
		return ({
			image: binaryToB64(arrayBuffer.data),
			user: metaData.data.user,
			likes: metaData.data.likes,
			comments: metaData.data.comments
		})
	})
}

const fetchAllPosts = async (imageIDs) => {
	const posts = imageIDs.map(({ image }) => {
		return fetchPost(image)
	});
	const allPosts = Promise.all(posts)
	return allPosts;
}

const Home = () => {
	const [ s, setS ] = useState();
	const [ imageGallery, setImageGallery ] = useState([]);

	const getPosts = async => {
		const finalPosts = axios.get('api/posts/all')
		finalPosts.then(res => {
			console.log(res);
			return fetchAllPosts(res.data);
		})
		.then(res => {
			console.log("omghelp", res);
		})
	}

	getPosts();

	// axios.get('api/posts/all')
	// 	.then(res=>{
	// 		res.data
	// 		.map(({ image }) => {
	// 			// axios.get(`/api/posts/image/${image}`, { responseType: 'arraybuffer' })
	// 			// .then(res => {
	// 			// 	console.log("res", res);
	// 			// 	const b64 = binaryToB64(res.data);
	// 			// 	const newImageGallery = imageGallery;
	// 			// 	newImageGallery.push(b64);
	// 			// 	setImageGallery(newImageGallery);
	// 			// })
	// 		});
	// 	})
    // 	.catch(err=>{
    // 		console.error("myerror: ", err.response);
	// 	})

	return (
<body>
	<div id="main">
		<div className="structure">
		<div className="pic-container">
			{imageGallery.map(singleImg => (
				<div className="pic-frame">
					<img src={`${singleImg}`} alt="database_image"/>
				</div>
			))}
		</div>
		<button onClick={() => setS("hi")}>{s}</button>
		</div>
	</div>
	<footer id="footer">
        <wr/>
        &copy Jack&Jon all rights reserved.
    </footer>
</body>
	)
}

export default Home;