import React, { useState } from 'react';
import axios from 'axios';
import ResumeAnalysis from './ResumeAnalysis';
import Filer from "./Filer";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = () => {
    if (!file) {
      console.log("No file selected");
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
  <section className='flex mt-12 gap-60'>
    <div className="text-white ml-20 flex flex-col items-start w-120">
      <div className="w-120 h-150 flex flex-col items-center p-5 rounded-2xl border border-white">
        <h2 className="text-xl font-bold mb-6">Resume AI Analysis</h2>

        {/* Hidden File Input */}
        <input
          type="file"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {/* Visible File Input (Clickable) */}
        <div
          className="border bg-blue-300 border-white w-90 h-50 rounded-2xl mb-4 flex items-center justify-center cursor-pointer "
          onClick={() => document.getElementById("fileUpload").click()}
        >
          {file ? file.name : "Upload_Your_Resume_Here"}
        </div>

        <div className="flex gap-5">
          {/* Browse Files Button */}
          <label
            htmlFor="fileUpload"
            className="cursor-pointer w-50 px-3 py-2 rounded-2xl border border-white bg-black text-white hover:bg-gray-700 transition mb-4 flex items-center justify-center"
          >
            Browse Files
          </label>

          {/* Upload Button */}
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

      {/* Display AI Analysis if available */}
     {/* {analysis && <ResumeAnalysis analysis={analysis} />} */}
    </div>
    
    <div>
         <Filer/>
    </div>
  </section>
  );
};

export default UploadResume;
