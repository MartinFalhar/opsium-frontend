import React, { useState } from "react";

function CreateArea(props) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputContent, setInputContent] = useState("");

  function handleTitleChange(event) {
    const newValue = event.target.value;
    setInputTitle(newValue);
  }

  function handleContentChange(event) {
    const newValue = event.target.value;
    setInputContent(newValue);
  }

  function submitNote(event) {
    event.preventDefault();
    props.clickAdd({ title: inputTitle, content: inputContent });
    setInputTitle("");
    setInputContent("");
  }

  return (
    <div>
      <form onSubmit={submitNote}>
        <input
          style={{ fontWeight: "600" }}
          onChange={handleTitleChange}
          placeholder="Titulek"
          value={inputTitle}
        />
        <textarea
          onChange={handleContentChange}
          name="content"
          placeholder="Napiš poznámku..."
          rows="3"
          value={inputContent}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CreateArea;
