import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
	const [ s, setS ] = useState();


	const [ images, setImages ] = useState([]);
	const [ allPosts, setAllPosts ] = useState(() => {
		axios.get('api/posts/all')
		.then(res=>{
			if (!allPosts) {
				setAllPosts(res.data);
			}
			return (res.data);
		})
    	.catch(err=>{
    		console.error("myerror: ", err.response);
		})
	});


	useEffect(() => {
		if (allPosts) {
		allPosts.map(({ image }) => {
			axios.get(`/api/posts/${image}`, { responseType: 'arraybuffer' })
			.then(res=>{
				let newImage = btoa(
					new Uint8Array(res.data)
					.reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
				const finalImage = `data:image/jpeg;base64,${newImage}`;
				const oldImages = images;
				// const newImage = Buffer.from(res.data, 'binary').toString('base64');
				// console.log(newImage);
				console.log(finalImage);
				oldImages.push(finalImage);
				setImages(oldImages);
				console.log("we right here: ", images);
			})
			.catch(err=>{
				console.error("myerror: ", err.response);
			})
		})
	}});
	
	return (
<body>
	<div id="main">
		<div className="structure">
		<div className="pic-container">
			{images.map(image => (
				<div className="pic-frame">
					<img src={`${image}`} alt="database_image"/>
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