import React, { useState } from "react";
import ResumeAnalysis from "./components/ResumeAnalysis";
import Header from "./components/Header";






function App() {
  return (
    <div className="bg-black min-h-screen w-full">
        <Header />    
        <ResumeAnalysis />
    </div>
    
  );
}

export default App;
