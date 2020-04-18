import axios from "axios";

const UpdateUser = async(V_Token, newpassword, name, email) => {
    try {
        const config = {
          headers: {
            "x-auth-token": V_Token,
            "Content-Type": "application/json"
          }
        };
        //data to be updated
        const newUser = { name, email, newpassword };
        const body = JSON.stringify(newUser);
        await axios.put("/api/users", body, config);
        return(await axios.get("/api/users", config));
      } catch (err) {
        return(err.response.data.toString());
      }
    }

export {UpdateUser};