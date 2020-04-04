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
            await axios.get('/api/auth/confirm/', config)
            .catch(err=>{
                console.error(err.response);
            })
            setPopMessage('Your account has been confirmed');
        //    setTimeout(() => { window.location.href = '/login';}, 3500);
        } catch (err) {
            console.log(err.response.data);
            return;
        }
    }

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