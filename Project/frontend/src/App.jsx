import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:5000/upload", formData)
      .then((res) => {
        console.log("File uploaded successfully", res.data);
        setAnalysis(res.data.analysis);
      })
      .catch((err) => {
        console.error("Upload error:", err);
        setError("Error uploading file. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Resume AI Analysis</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysis && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3>Analysis Results</h3>
          <p><strong>Skills Relevancy:</strong> {analysis.skills_relevancy}</p>
          <p><strong>Education Relevancy:</strong> {analysis.education_relevancy}</p>
          <p><strong>Projects Quality:</strong> {analysis.projects_quality}</p>
          <p><strong>Industry Standards Alignment:</strong> {analysis.industry_standards_alignment}</p>
          <p><strong>Overall Feedback:</strong> {analysis.overall_feedback}</p>
        </div>
      )}
    </div>
  );
}

export default App;
