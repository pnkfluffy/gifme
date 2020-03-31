import React from 'react';

const LinkRegistration = ({name}) => {
    if (name) {
    return (
    <div>Event links to {name}</div>
    )} else {return <div></div>}
}

export default LinkRegistration;