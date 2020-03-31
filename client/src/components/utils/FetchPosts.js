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
	const arrayBuffer = await axios.get(`/api/posts/image/${imageID}`, { responseType: 'arraybuffer' });
	const metaData = await axios.get(`/api/posts/meta/${imageID}`);
	return Promise.all([arrayBuffer, metaData])
		.then(function ([arrayBuffer, metaData]) {
			return ({
				imageID: metaData.data.imageID,
				image: binaryToB64(arrayBuffer.data),
				user: metaData.data.user,
				userID: metaData.data.userID,
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

export { fetchAllPosts, fetchPost };