const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error(" ERROR: GEMINI_API_KEY is missing in .env file");
  process.exit(1); // Stop server if API key is missing
}

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an AI specialized in resume analysis. Analyze the given resume text and return structured JSON:
      {
        "skills_relevancy": "<Your assessment>", // work here manjrekar
        "education_relevancy": "<Your assessment>",
        "projects_quality": "<Your assessment>",
        "industry_standards_alignment": "<Your assessment>",
        "overall_feedback": "<General feedback>"
      }
      Resume:
      """${resumeText}"""
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // ✅ Extract text correctly from Gemini API
    const analysis = response.candidates[0].content.parts[0].text;

    // ✅ Remove unwanted formatting (triple backticks)
    const cleanedAnalysis = analysis.replace(/```json|```/gi, "").trim();

    console.log("AI Analysis Response:", cleanedAnalysis); // Debugging

    return JSON.parse(cleanedAnalysis); // Parse clean JSON
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};


// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(" Uploaded file:", req.file);

    if (req.file.mimetype === "application/pdf") {
      if (!(await fs.stat(req.file.path).catch(() => false))) {
        return res.status(500).json({ error: "File not found after upload" });
      }

      const dataBuffer = await fs.readFile(req.file.path);
      const resumeText = await pdfParse(dataBuffer);

      const textFilePath = path.join("./public/", `${req.file.filename}.txt`);
      await fs.writeFile(textFilePath, resumeText.text, "utf8");

      // Call AI analysis function
      const analysis = await analyzeResume(resumeText.text);

      if (!analysis) {
        return res.status(500).json({ error: "AI analysis failed" });
      }

      return res.json({
        message: " PDF uploaded, text extracted, and analyzed",
        pdfPath: req.file.path,
        textFilePath: textFilePath,
        analysis: analysis, // Send analysis to frontend
      });
    }

    res.json({ message: " File uploaded successfully", filePath: req.file.path });
  } catch (error) {
    console.error(" Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
