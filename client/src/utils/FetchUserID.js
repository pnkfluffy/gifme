import axios from 'axios';

const fetchUserID = async () => {
    const auth_token = localStorage.getItem('myToken');
    const config = {
        headers:{
            'x-auth-token': auth_token
    }}
    const userID = await axios.get('api/auth', config);
    return (userID);
}

export default fetchUserID;