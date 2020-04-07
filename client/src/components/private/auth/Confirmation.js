import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router";
import PopUpMessage from '../../../utils/popUpMessage';


const Confirmation = () => {
    const [popMessage, setPopMessage] = useState('');

    let params = useParams("/confirm/:token");
    const {token} = params;
    
    const confirmAcc = async () =>{
        try {
            const config = {
                headers:{
                    'x-auth-token': token,
                }
            }
            axios.get('/api/auth/confirm', config)
            .then(res => {setPopMessage(res.response.data)})
            .catch(err=>{
                console.error(err.response);
            });
        //    setTimeout(() => { window.location.href = '/login';}, 3500);
        } catch (err) {
            console.log(err.response.data);
            return;
        }
      };

    return (
        <div>
            <PopUpMessage text={popMessage}/>
            <div className="confirm_box">
                <Link
                className="confirm_button"
                onClick={confirmAcc}>Confirm your account</Link>
            </div>
        </div>
        )
}

export default Confirmation;
