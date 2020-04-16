import React from "react";

const ConfirmDelete = () => {
  return (
    <div className="overlay">
      <div className="confirm_delete_popup">
        <h2 className="confirm_delete_txt">Are you sure you want to delete this image?</h2>
        <div className="confirm_delete_btns">
          <button onClick={() => yesDelete()}>DELETE</button>
          <button onClick={() => plsNoDelete()}>nevermind</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
