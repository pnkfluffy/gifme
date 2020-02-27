import React from 'react';
import {Link} from 'react-router-dom';

const PageError = () => {
    return (
        <div>
            <div className="errorBox">
                <div className="bigTitle">OOPS!
                <div className="smallTitle">400 - NOT VALID USER</div>
                <Link to="/" className="errorButton">
                GO TO HOMEPAGE</Link>
            </div>
        </div>
        </div>
    )
}

export default PageError;