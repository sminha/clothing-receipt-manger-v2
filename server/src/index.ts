import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import db from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const upload = multer();

const apiKey = process.env.API_KEY;

async function detectTextFromImage(imageBuffer: Buffer) {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const image = imageBuffer.toString("base64");

  const requestBody = {
    requests: [
      {
        image: { content: image },
        features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
      },
    ],
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Vision API raw response:", JSON.stringify(response.data, null, 2));

    const fullText = response.data.responses?.[0]?.fullTextAnnotation?.text;
    return fullText || "";
  } catch (error: any) {
    console.error("Error during OCR request:", error.response?.data || error.message);
    throw new Error("OCR 요청 중 오류가 발생했습니다.");
  }
}

app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    res.json({ message: "Server is running", time: rows });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "이미지가 업로드되지 않았습니다." });

  try {
    const detectedText = await detectTextFromImage(req.file.buffer);
    res.status(200).json({ detectedText });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
