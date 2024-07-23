import React, { useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const toggleBold = () => {
    setBold(!bold);
  };

  const toggleItalic = () => {
    setItalic(!italic);
  };

  const toggleUnderline = () => {
    setUnderline(!underline);
  };

  const textStyle = {
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
  };

  return (
    <div className="App">
      <div className="toolbar">
        <button onClick={toggleBold} className={bold ? "active" : ""}>
          Bold
        </button>
        <button onClick={toggleItalic} className={italic ? "active" : ""}>
          Italic
        </button>
        <button onClick={toggleUnderline} className={underline ? "active" : ""}>
          Underline
        </button>
      </div>
      <textarea value={text} onChange={handleTextChange} style={textStyle} />
    </div>
  );
}

export default App;
