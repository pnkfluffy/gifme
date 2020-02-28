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

const Home = () => {
	const [ s, setS ] = useState();

	const [ imageGallery, setImageGallery ] = useState([]);
	const [ allPosts, setAllPosts ] = useState()
	
	axios.get('api/posts/all')
		.then(res=>{
			res.data
			.map(({ image }) => {
				axios.get(`/api/posts/${image}`, { responseType: 'arraybuffer' })
				.then(res => {
					const b64 = binaryToB64(res.data);
					const newImageGallery = imageGallery;
					newImageGallery.push(b64);
					setImageGallery(newImageGallery);
				})
			});
		})
    	.catch(err=>{
    		console.error("myerror: ", err.response);
		})

	// useEffect(() => {
	// 	if (allPosts) {
	// 	allPosts.map(({ image }) => {
	// 		axios.get(`/api/posts/${image}`, { responseType: 'arraybuffer' })
	// 		.then(res=>{
	// 			const finalImage = binaryToB64(res.data);
	// 			const oldImages = imageGallery;
	// 			console.log(finalImage);
	// 			oldImages.push(finalImage);
	// 			setImageGallery(oldImages);
	// 			console.log("we right here: ", imageGallery);
	// 		})
	// 		.catch(err=>{
	// 			console.error("myerror: ", err.response);
	// 		})
	// 	})
	// }});
	
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