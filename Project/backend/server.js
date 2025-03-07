const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises;
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
<<<<<<< HEAD
=======
require("dotenv").config();

>>>>>>> 6f9aebf (ai response push)

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

<<<<<<< HEAD
if (!GEMINI_API_KEY) {
  console.error(" ERROR: GEMINI_API_KEY is missing in .env file");
  process.exit(1); // Stop server if API key is missingT
}

=======
>>>>>>> 6f9aebf (ai response push)
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

<<<<<<< HEAD

// Ai Response

const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an AI specialized in Resume Analysis just like an HR in a Company. 
      You have to analyze the given resume text and return structured JSON UI Visualization:
      {
        "resume_score": "<Overall Percentage score out of 100%, based on industry benchmark>",
        "industry ranking": "<A percentile ranking of the candidate in industry>",
        "overall_feedback": "<One-line feedback on resume quality>"
      },
      "key_insights": {
          "Skills_Acquired": "<Percentage out of 100>",
          "Experience": "<Percentage out of 100>",
          "Education_relevance": "<Percentage out of 100>"
      },
      "Resume_Gap_Resume": {
          "missing_skills": ["Skill1", "Skill2"], 
          "recommended_courses": ["Course1", "Course2"], 
          "experience_required": "<Specific experience or project suggestions>"
      },
      "Recommendations": {
        "best_job_roles": [
          { "role": "Job Role 1", "match_percentage": "<%>" },
          { "role": "Job Role 2", "match_percentage": "<%>" }
        ]
      }
      Resume:
      """${resumeText}"""
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],  // ✅ Correct input format
      generationConfig: {
        temperature: 0,   
        top_p: 0.9,       
        max_output_tokens: 1000 
      }
    });

    // ✅ Extract AI Response Safely
    const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response) throw new Error("Invalid AI response format");

    // ✅ Remove unwanted formatting
    const cleanedAnalysis = response.replace(/```json|```/gi, "").trim();

    console.log("AI Analysis Response:", cleanedAnalysis); // Debugging

    return JSON.parse(cleanedAnalysis);
  } catch (error) {

    
    console.error("AI Analysis Error:", error);
    
    // Check if error is 503 (Service Unavailable) and retry
    if (error.status === 503 && retries > 0) {
        console.log(`Retrying in ${delay / 1000} seconds... Attempts left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
        return analyzeResume(resumeText, retries - 1, delay * 2); // Retry with exponential backoff
      }
=======
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
>>>>>>> 6f9aebf (ai response push)
    return null;
  }
};

<<<<<<< HEAD

=======
>>>>>>> 6f9aebf (ai response push)
// File upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(" Uploaded file:", req.file);

    if (req.file.mimetype === "application/pdf") {
<<<<<<< HEAD
      if (!(await fs.stat(req.file.path).catch(() => false))) {
        return res.status(500).json({ error: "File not found after upload" });
      }

      const dataBuffer = await fs.readFile(req.file.path);
      const resumeText = await pdfParse(dataBuffer);

=======
      const dataBuffer = await fs.readFile(req.file.path);
      const resumeText = await pdfParse(dataBuffer);
      
>>>>>>> 6f9aebf (ai response push)
      const textFilePath = path.join("./public/", `${req.file.filename}.txt`);
      await fs.writeFile(textFilePath, resumeText.text, "utf8");

      // Call AI analysis function
<<<<<<< HEAD
      const analysis = await analyzeResume(resumeText.text);

      if (!analysis) {
        return res.status(500).json({ error: "AI analysis failed" });
      }

      return res.json({
        message: " PDF uploaded, text extracted, and analyzed",
=======
      await analyzeResume(resumeText.text);

      return res.json({
        message: "PDF uploaded, text extracted, and analysis logged",
>>>>>>> 6f9aebf (ai response push)
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
