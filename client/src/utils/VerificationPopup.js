import React from "react";

const VerificationPopup = (props) => {
  const {
    popupMessage,
    leftButtonMessage,
    rightButtonMessage,
    leftButtonFunction,
    rightButtonFunction,
  } = props;

  return (
    <div className="overlay">
      <div className="verify_popup">
        <h2 className="verify_popup_txt">{popupMessage}</h2>
        <div className="verify_popup_btns">
          <button onClick={() => leftButtonFunction()}>
            {leftButtonMessage}
          </button>
          <button onClick={() => rightButtonFunction()}>
            {rightButtonMessage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPopup;
