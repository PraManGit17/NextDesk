const express = require("express");
const cors = require("cors");
require("dotenv").config();
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// // Sample route
// app.get("/", (req, res) => {
//     res.json({ message: "Hello, World!" });
// });


const storage = multer.diskStorage({
  destination : function(req, file, cb) {
    return cb(null, "./public/")
  },
  filename: function(req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const uplaod = multer({storage})

app.post('/upload', uplaod.single('file'), (req,res) =>{
    console.log(req.body)
    console.log(req.file)
})


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
