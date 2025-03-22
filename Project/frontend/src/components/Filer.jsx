import React from "react";
import './Filer.css'

const Filer = ({ file }) => {
  return (
    <div >
      {file ? (
        <div className="flex flex-col justify-center items-center w-[850px]" id="file">
        
            <span className="text-white text-2xl font-semibold mb-5 ">Uploaded Resume</span>
          <iframe
            src={URL.createObjectURL(file)}
            title="Resume Preview"
            className=" w-[80%] h-[450px] border-2 border-white rounded-lg"
          />

        </div>
      ) : (
        <div className="text-white flex flex-col mt-17" id="filer">
          <span className="text-9xl">Unlock</span>
          <div className="flex items-center">
            <span className="text-6xl ml-5">Your Career Potential</span>
            <img
              src="/assets/rocket.gif"
              alt="Rocket Launch"
              className="w-20 h-20 ml-3"
            />
          </div>
          <span className="text-3xl ml-8">
            with AI-Powered Resume Insights!
          </span>
        </div>
      )}
    </div>
  );
};

export default Filer;
