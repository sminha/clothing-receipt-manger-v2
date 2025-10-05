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

app.post('/api/auth/signup', async (req, res) => {
  const { name, birth, gender, carrier, phone } = req.body;

  if (!name || !birth || !gender || !carrier || !phone) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT user_id FROM users WHERE phone = ?',
      [phone]
    );

    if ((existingUsers as any[]).length > 0) {
      return res.status(409).json({ message: '이미 가입된 사용자입니다.' });
    }

    await db.query(
      'INSERT INTO users (name, birth, gender, carrier, phone) VALUES (?, ?, ?, ?, ?)',
      [name, birth, gender, carrier, phone]
    )

    res.status(200).json({ message: '회원가입 완료' });
  } catch (error) {
    console.error('회원가입 오류', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { name, birth, phone } = req.body;

  if (!name || !birth || !phone) {
    return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
  }

  try {
    const [rows]: any = await db.query(
      'SELECT user_id, name, birth, gender, carrier, phone, company FROM users WHERE name = ? AND birth = ? AND phone = ?',
      [name, birth, phone]
    );

    if (rows.length === 0) {
      return res.status(409).json({ message: '존재하지 않는 사용자입니다.' });
    }

    const user = rows[0];
    res.status(200).json({
      message: '로그인 완료',
      user: {
        id: user.user_id,
        name: user.name,
        birth: user.birth,
        gender: user.gender,
        carrier: user.carrier,
        phone: user.phone,
        company: user.company,
      } });
  } catch (error) {
    console.error('로그인 오류', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ message: '상호명을 입력해주세요.' });
  }

  try {
    await db.query(
      'UPDATE users SET company = ? where user_id = ?',
      [company, id]
    );

    return res.status(200).json({
      message: '정보 수정 완료',
      user: {
        company: company,
      }
    })
  } catch (error) {
    console.error('정보 수정 오류', error);
    res.status(500).json({ message: '서버 오류' });
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