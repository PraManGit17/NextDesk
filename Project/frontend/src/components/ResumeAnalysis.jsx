import React from 'react'
import axios from "axios";
import { useState } from 'react';

const ResumeAnalysis = () => {

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
      <div className=" text-white">

      <h2>Resume AI Analysis</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="button" onClick={upload} disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {analysis && (
        <div >
          <h3>Analysis Results</h3>

          <p><strong>Resume Score:</strong> {analysis["resume score"]}%</p>
          <p><strong>Industry Ranking:</strong> {analysis["industry ranking"]}</p>
          <p><strong>Overall Feedback:</strong> {analysis.overall_feedback}</p>

          <h4>Key Insights</h4>
          <p><strong>Skills Acquired:</strong> {analysis.key_insights.Skills_Accquired}%</p>
          <p><strong>Experience:</strong> {analysis.key_insights.Experience}%</p>
          <p><strong>Education Relevance:</strong> {analysis.key_insights.Education_relevance}%</p>

          <h4>Resume Gaps</h4>
          <p><strong>Missing Skills:</strong> {analysis.Resume_Gap_Resume.missing_skills.join(", ") || "None"}</p>
          <p><strong>Recommended Courses:</strong> {analysis.Resume_Gap_Resume.recommended_courses.join(", ") || "None"}</p>
          <p><strong>Experience Required:</strong> {analysis.Resume_Gap_Resume.experience_required}</p>

          <h4>Recommended Job Roles</h4>
          <ul>
            {analysis.Recommendations.best_job_roles.map((job, index) => (
              <li key={index}>
                {job.role} - {job.match_percentage}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ResumeAnalysis
