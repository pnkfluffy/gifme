import React from 'react';
import {Link} from 'react-router-dom';

const PageError = () => {
    return (
        <div>
            <div className="errorBox">
                <div className="bigTitle">OOPS!
                <div className="smallTitle">500 - SERVER ERROR</div>
                <Link to="/" className="errorButton">
                GO TO HOMEPAGE</Link>
            </div>
        </div>
        </div>
    )
}

export default PageError;