import React, { useState, useEffect } from 'react';
import axios from 'axios';

// const newImageCards = ({images}) => (
// 	<div>
// 		{images.map(image => (
// 			<img className='image' src={image.data}/>
// 		))}
// 	</div>
// )


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
			axios.get(`/api/posts/${image}`)
			.then(res=>{
				const oldImages = images;
				oldImages.push(res.data);
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
		<article className="card">
            <img src="http://www.abbeyjfitzgerald.com/wp-content/uploads/2017/02/image-example-01.jpg"/>
            <div className="comments">
				<p>user: comment 1</p>
				<p>user: comment 2</p>
            </div>
		</article>
		<article className="card">
			<img src="https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"/>
			<div className="comments">
				<p>user: comment 1</p>
				<p>user: comment 2</p>
			</div>
		</article>
		<div>
			{images.map(image => (
				<img src={image}/>
			))}
		</div>
		<button onClick={() => setS("hi")}>butt</button>
		{/* <newImageCards images={images}/> */}
	</div>
	<footer id="footer">
        <wr/>
        &copy Jack&Jon all rights reserved.
    </footer>
</body>
	)
}

export default Home;