import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ResumeAnalysis from './ResumeAnalysis';
import Filer from "./Filer";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const analysisRef = useRef(null);

  useEffect(() => {
    if (analysis && analysisRef.current) {
      analysisRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [analysis]);

  const upload = () => {
    if (!file) {
      setError("Please select a file before uploading.");
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
    <section className="flex flex-col items-center mt-8 gap-10">
      {/* Side-by-side Layout */}
      <div className="flex gap-10 w-full justify-center">
        {/* Upload Section */}
        <div className="text-white flex flex-col items-start w-1/2">
          <div className="w-full h-[550px] flex flex-col items-center p-5 rounded-2xl border border-white">
            <h2 className="text-xl font-bold mb-6">Resume AI Analysis</h2>

            {/* Hidden File Input */}
            <input
              type="file"
              id="fileUpload"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              accept=".pdf"
            />

            {/* Visible File Input */}
            <div
              className="border bg-blue-300 border-white w-90 h-40 rounded-2xl mb-4 flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              {file ? file.name : "Upload Your Resume Here"}
            </div>

            <div className="flex gap-5">
              <label
                htmlFor="fileUpload"
                className="cursor-pointer w-50 px-3 py-2 rounded-2xl border border-white bg-black text-white hover:bg-gray-700 transition mb-4 flex items-center justify-center"
              >
                Browse Files
              </label>

              <button
                type="button"
                onClick={upload}
                disabled={loading}
                className="w-50 px-3 py-2 rounded-2xl border border-white bg-blue-700 text-white hover:bg-gray-700 transition mb-4"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>

        {/* File Preview Section */}
        <Filer file={file} />
      </div>

      {/* Resume Analysis (At Bottom) */}
      {analysis && (
        <div ref={analysisRef}>
          <ResumeAnalysis analysis={analysis} />
        </div>
      )}
    </section>
  );
};

export default UploadResume;
