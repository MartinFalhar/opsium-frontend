import React from "react";
import "./Note.css"; // Assuming you have a CSS file for styling

function Note(props) {
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>

      <button
        onClick={(event) => {
          props.clickDelete(props.id);
          event.preventDefault();
        }}
      >
        DELETE
      </button>
    </div>
  );
}

export default Note;
