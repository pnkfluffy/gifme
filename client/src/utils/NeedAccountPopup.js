import React from "react";

const ConfirmDelete = ({ removePopup }) => {
  const forwardToRegister = () => {
    window.location.href = "/Signup";
  }

  return (
    <div className="overlay">
      <div className="confirm_delete_popup">
        <h2 className="confirm_delete_txt">Without an account, you can only test features. Please register to save or upload a GIF.</h2>
        <div className="confirm_delete_btns">
          <button onClick={() => removePopup()}>Thats OK</button>
          <button onClick={() => forwardToRegister()}>Sign me up!</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
