import React from 'react';
import '../../CSS/App.css';


const PopUpMessage = ({text}) =>{
    if (text){
	return (
		<div>
			<div className="popup_message">{text}</div>
        </div>
        )} else {return <div></div>}
    }

export default PopUpMessage;