const delImage = async (imageID, userID) =>{
    try {
        const auth_token = localStorage.getItem("myToken");
    // delete req cannot take body, only deletes by ID
    // to delete multiple files, make a post req and send ID's in the body
    // await axios.delete(`/api/posts/${imageID}`, config)
        fetch(`/api/posts/${imageID}`, {
            method: "DELETE",
            headers: {
              "x-auth-token": auth_token
            }
          })
        .then(window.location.href = '/')
        .catch(err => {
            console.error(err.response);
        })

    } catch (err) {console.error(err.response.data);}
}

export {delImage} 