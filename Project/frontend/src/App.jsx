import React, { useState } from "react";
import Header from "./components/Header";
import UploadResume from "./components/UploadResume";




function App() {
  return (
    <div className="bg-black w-full">
        <Header /> 
        <UploadResume />

    </div>
    
  );
}

export default App;
