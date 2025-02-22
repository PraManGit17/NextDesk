import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);

  const upload = () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    const formData = new FormData(); // Fixed variable name
    formData.append("file", file);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((res) => console.log("File uploaded successfully", res))
      .catch((er) => console.log(er));
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload}>
        Upload
      </button>
    </div>
  );
}

export default App;
