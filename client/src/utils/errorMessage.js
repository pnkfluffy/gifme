import React from 'react';

const ErrorMessage = ({text}) =>{
    if (text){
	return (
		<div>
			<div className="error_message">Error: {text}, please try again!</div>
        </div>
        )} else {return <div></div>}
    }

export default ErrorMessage;