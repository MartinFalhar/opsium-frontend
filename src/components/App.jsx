import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { Routes, Route } from "react-router-dom";
import Hello from "./Hello";

function App() {
  const [notes, setNotes] = useState([
    {
      title: "Finovy ouška",
      content: "Nezapomeň je vyčistit",
    },
  ]);

  function addNote(noteContent) {
    setNotes((prevItems) => {
      return [...prevItems, noteContent];
    });
  }

  function deleteNote(id) {
    setNotes((prevItems) => {
      return prevItems.filter((item, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea clickAdd={addNote} />
      {notes.map((note, index) => (
        <Note
          clickDelete={deleteNote}
          key={index}
          id={index}
          title={note.title}
          content={note.content}
        />
      ))}
      <Routes>
        <Route path="/" element={<Hello />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </div>
  );
}

export default App;
