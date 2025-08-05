import React, { useState } from "react";
import Login from "./Login/Login.jsx";
import Footer from "./footer/footer.jsx";
import Note from "./note/Note.jsx";
import CreateArea from "./CreateArea";
import { Routes, Route } from "react-router-dom";
import Hello from "./Hello";
import Layout from "../layout/LayoutMain";
import "../styles.css"; // global CSS file for styling

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
      <Layout>
        <Login />
        <CreateArea clickAdd={addNote} />
        {notes.map((note, index) => (
          <Note
            clickDelete={deleteNote}
            key={index}
            id={index}
            title={note.title}
            content={note.content}
          />
        ))}{" "}
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/footer" element={<Footer />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
