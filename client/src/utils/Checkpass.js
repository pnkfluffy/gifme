import axios from "axios";

const CheckPass = async(V_Token, password) => {
    try {
        const config = {
          headers: {
            "x-auth-token": V_Token,
            "Content-Type": "application/json"
          }}
        const oldPassword = { password };
        const body = JSON.stringify(oldPassword);
        //checks if the user is valid
        await axios.post("/api/users/check", body, config);
        return('ok');
      } catch (error) {
          return(error.response.data.toString());
        }
    }

export {CheckPass};
