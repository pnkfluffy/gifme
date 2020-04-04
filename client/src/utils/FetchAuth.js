import axios from "axios";

const fetchAuth = async () => {
  const auth_token = localStorage.getItem("myToken");
  const config = {
    headers: {
      "x-auth-token": auth_token
    }
  };
  try {
    const userID = await axios.get("api/auth", config);
    return userID.data;
  } catch (err) {
    console.log("error: ", err.response);
    return null;
  }
};

export default fetchAuth;
