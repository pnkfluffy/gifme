import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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
		<article className="card">
			<img src="http://www.abbeyjfitzgerald.com/wp-content/uploads/2017/02/image-example-04.jpg"/>
			<div className="comments">
				<p>user: comment 1</p>
				<p>user: comment 2</p>
			</div>
		</article>
	</div>
	<footer id="footer">
        <wr/>
        &copy Jack&Jon all rights reserved.
    </footer>
	<script src="test.js">
		crossorigin
		src="https://unpkg.com/react@16/umd/react.development.js"
		crossorigin
  		src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
	</script>
</body>
	)};

export default Home;