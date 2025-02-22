const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs").promises; // Use promises for async/await
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

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

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    // If the uploaded file is a PDF, extract text and save as .txt file
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = await fs.readFile(req.file.path); // Read PDF file
      const resumeText = await pdfParse(dataBuffer); // Extract text

      const textFilePath = path.join("./public/", `${req.file.filename}.txt`);
      await fs.writeFile(textFilePath, resumeText.text, "utf8"); // Save text to .txt file

      return res.json({
        message: "PDF uploaded and text extracted",
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
