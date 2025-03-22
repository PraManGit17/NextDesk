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
  throw new Error("ERROR: GEMINI_API_KEY is missing in .env file");
}


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
  destination: "./uploads/", // Secure private folder
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const upload = multer({ storage });

// AI Resume Analysis Function
const analyzeResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = ` 
      You are an AI specialized in Resume Analysis just like an HR in a Company. 
      Analyze the given resume text and return a structured JSON response:

      {
        "resume_score": "<Overall Percentage score out of 100%, based on industry benchmark>",
        "industry_ranking": "<A percentile ranking of the candidate in industry>",
        "overall_feedback": "<One-line feedback on resume quality>",
        "key_insights": {
          "Skills_Acquired": "<Percentage out of 100>",
          "Experience": "<Percentage out of 100>",
          "Education_relevance": "<Percentage out of 100>"
        },
        "resume_gap": {
          "missing_skills": ["Skill1", "Skill2"],
          "recommended_courses": ["Course1", "Course2"],
          "experience_required": "<Specific experience or project suggestions>"
        },
        "recommendations": {
          "best_job_roles": [
            { "role": "Job Role 1", "match_percentage": "<%>" },
            { "role": "Job Role 2", "match_percentage": "<%>" }
          ]
        }
      }

      Resume: """${resumeText}"""
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        top_p: 0.9,
        max_output_tokens: 1000,
      },
    });

    
    console.log("Raw AI Response:", result);

    
    const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!response) throw new Error("AI response is missing");

    
    console.log("Extracted AI Response:", response);

    
    const cleanedAnalysis = response.replace(/```json|```/gi, "").trim();

    return JSON.parse(cleanedAnalysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return null;
  }
};



app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("Uploaded file:", req.file);

    if (req.file.mimetype === "application/pdf") {
      if (!(await fs.stat(req.file.path).catch(() => false))) {
        return res.status(500).json({ error: "File not found after upload" });
      }

      const dataBuffer = await fs.readFile(req.file.path);
      const resumeText = await pdfParse(dataBuffer);

      const textFilePath = path.join("./uploads/", `${req.file.filename}.txt`);
      await fs.writeFile(textFilePath, resumeText.text, "utf8");

      
      const analysis = await analyzeResume(resumeText.text);
      if (!analysis) return res.status(500).json({ error: "AI analysis failed" });

      
      await fs.unlink(req.file.path);

      return res.json({
        message: "PDF uploaded, text extracted, and analyzed",
        textFilePath,
        analysis,
      });
    }

    res.json({ message: "File uploaded successfully", filePath: req.file.path });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
