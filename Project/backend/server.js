const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Function to analyze resume with Gemini AI
const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an AI specialized in resume analysis. Analyze the given resume text based on:
      - **Relevancy of Skills and Education**: Are the listed skills and education relevant to industry trends?
      - **Projects Quality**: Are the projects innovative, detailed, and impactful?
      - **Industry Standards**: How well does the resume align with current hiring standards?

      Provide the response in a structured JSON format:
      {
        "skills_relevancy": "<Your assessment>",
        "education_relevancy": "<Your assessment>",
        "projects_quality": "<Your assessment>",
        "industry_standards_alignment": "<Your assessment>",
        "overall_feedback": "<General feedback>"
      }

      Here is the extracted resume text:
      """${resumeText}"""
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text(); // AI-generated analysis

    console.log("AI Resume Analysis:", analysis); // Log analysis for testing

    return analysis;
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return null;
  }
};

// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = await fs.readFile(req.file.path);
      const resumeText = await pdfParse(dataBuffer);
      
      const textFilePath = path.join("./public/", `${req.file.filename}.txt`);
      await fs.writeFile(textFilePath, resumeText.text, "utf8");

      // Call AI analysis function
      await analyzeResume(resumeText.text);

      return res.json({
        message: "PDF uploaded, text extracted, and analysis logged",
        pdfPath: req.file.path,
        textFilePath: textFilePath,
      });
    }

    res.json({ message: "File uploaded successfully", filePath: req.file.path });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
