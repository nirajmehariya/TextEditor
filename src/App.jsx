import React, { useRef, useState, useEffect } from "react";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  const editorRef = useRef(null);
  const [currentColor, setCurrentColor] = useState("#000000"); // Default text color
  const [currentBackgroundColor, setCurrentBackgroundColor] =
    useState("#ffffff"); // Default background color
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    // Fetch fonts from Font Library API
    fetch(
      "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCBSrUQ2xa9Aii7xE1h1DTWIx2kO0KEhCU"
    )
      .then((response) => response.json())
      .then((data) => setFonts(data.items || []))
      .catch((error) => console.error("Error fetching fonts:", error));
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        const parentNode = range.commonAncestorContainer.parentNode;
        const textColor = parentNode.style.color;
        const backgroundColor = parentNode.style.backgroundColor;
        setCurrentColor(textColor || "#000000");
        setCurrentBackgroundColor(backgroundColor || "#ffffff");
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      return sel.getRangeAt(0);
    }
    return null;
  };

  const restoreSelection = (range) => {
    if (range) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const execCommand = (command, value = null) => {
    const savedSelection = saveSelection();
    if (savedSelection) {
      restoreSelection(savedSelection);
      document.execCommand(command, false, value);
    }
    editorRef.current.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = `<img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%;">`;
      execCommand("insertHTML", img);
    };
    reader.readAsDataURL(file);
  };

  const downloadContent = () => {
    const content = editorRef.current.innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <div className="toolbar">
        <select onChange={(e) => execCommand("formatBlock", e.target.value)}>
          <option value="div">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>
        <select onChange={(e) => execCommand("fontName", e.target.value)}>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', Times, serif">
            Times New Roman
          </option>
          <option value="Verdana, Geneva, sans-serif">Verdana</option>
          <option value="'Courier New', Courier, monospace">Courier New</option>
          <option value="'Comic Sans MS', cursive, sans-serif">
            Comic Sans MS
          </option>
          {fonts.map((font, index) => (
            <option
              key={index}
              value={font.family}
              style={{ fontFamily: font.family }}
            >
              {font.family}
            </option>
          ))}
        </select>
        <button onClick={() => execCommand("bold")}>
          <i className="fas fa-bold"></i>
        </button>
        <button onClick={() => execCommand("italic")}>
          <i className="fas fa-italic"></i>
        </button>
        <button onClick={() => execCommand("underline")}>
          <i className="fas fa-underline"></i>
        </button>
        <button onClick={() => execCommand("strikeThrough")}>
          <i className="fas fa-strikethrough"></i>
        </button>
        <button onClick={() => execCommand("insertOrderedList")}>
          <i className="fas fa-list-ol"></i>
        </button>
        <button onClick={() => execCommand("insertUnorderedList")}>
          <i className="fas fa-list-ul"></i>
        </button>
        <button onClick={() => execCommand("justifyLeft")}>
          <i className="fas fa-align-left"></i>
        </button>
        <button onClick={() => execCommand("justifyCenter")}>
          <i className="fas fa-align-center"></i>
        </button>
        <button onClick={() => execCommand("justifyRight")}>
          <i className="fas fa-align-right"></i>
        </button>
        <button onClick={() => execCommand("justifyFull")}>
          <i className="fas fa-align-justify"></i>
        </button>
        <button onClick={() => execCommand("indent")}>
          <i className="fas fa-indent"></i>
        </button>
        <button onClick={() => execCommand("outdent")}>
          <i className="fas fa-outdent"></i>
        </button>
        <select onChange={(e) => execCommand("fontSize", e.target.value)}>
          {[...Array(50)].map((_, index) => (
            <option key={index + 2} value={index + 2}>
              {index + 1}
            </option>
          ))}
        </select>

        <input
          type="color"
          onChange={(e) => {
            setCurrentColor(e.target.value);
            execCommand("foreColor", e.target.value);
          }}
          value={currentColor}
        />
        <input
          type="color"
          onChange={(e) => {
            setCurrentBackgroundColor(e.target.value);
            execCommand("hiliteColor", e.target.value);
          }}
          value={currentBackgroundColor}
        />
        <button onClick={insertLink}>
          <i className="fas fa-link"></i>
        </button>
        <button>
          <label>
            <i className="fas fa-image"></i>
            <input
              type="file"
              style={{ display: "none" }}
              onChange={insertImage}
            />
          </label>
        </button>
        <button onClick={downloadContent}>
          <i className="fas fa-download"></i>
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor"
        contentEditable
        suppressContentEditableWarning
      ></div>
    </div>
  );
};

export default App;
