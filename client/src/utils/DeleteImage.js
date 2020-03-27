import axios from "axios"

const delImage = async (imageID) =>{
    try {
    // delete req cannot take body, only deletes by ID
    // to delete multiple files, make a post req and send ID's in the body
        await axios.delete(`/api/posts/${imageID}`)
        //.then(window.location.href = '/:userID')
    
    } catch (err) {console.log(err.response.data);}
}

export {delImage}