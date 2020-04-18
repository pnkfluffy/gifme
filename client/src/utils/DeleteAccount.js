import axios from "axios";

const DeleteAccount = async(V_Token,password) => {
    try {
        const config = {
          headers: {
            "x-auth-token": V_Token,
            "Content-Type": "application/json"
          }
        };
        const deleteAccount = { password };
        const body = JSON.stringify(deleteAccount);
        //checks if the user is valid
        axios.post("/api/users/check", body, config)
        //finds and deletes all posts
        .then((res) => {axios.get("/api/auth", config)
          .then(user => {axios.get(`/api/posts/${user.data._id}`)
            .then(allPosts => {
              const allPostsPromise = allPosts.data.map(
              (post) => {axios.delete(`/api/posts/${post.image}`, config)})
              Promise.all(allPostsPromise)
            })
            .then(() => {return (user)})
        })
        return(res)
      })
        //deletes user model
        .then((user) => {axios.delete(`/api/users/${user.data._id}`, config);
      })
      return('ok');
      } catch (err) {
        return(err.response);
      }
    }

export {DeleteAccount};