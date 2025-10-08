import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import axios from "axios";
import db from "./config/db";
import type { ResultSetHeader } from 'mysql2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const upload = multer();

const apiKey = process.env.API_KEY;

interface PurchaseItem {
  itemId: string;
  name: string;
  category: string;
  color: string;
  size: string;
  options: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  missingQuantity: number;
}

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

app.post('/api/purchases', async (req, res) => {
  const { id, date, vendor, receiptImage, items, userId } = req.body;
  
  let isAllItemsValid = true;
  for (const i of items) {
    if (
      typeof i.name !== "string" || i.name.trim() === "" ||
      typeof i.category !== "string" || i.category.trim() === "" ||
      typeof i.unitPrice !== "number" || i.unitPrice <= 0 ||
      typeof i.quantity !== "number" || i.quantity <= 0 ||
      typeof i.missingQuantity !== "number" || i.missingQuantity < 0
    ) {
      isAllItemsValid = false;
      break;
    }
  }

  if (!id || !date || !vendor || /* !receiptImage || */ !isAllItemsValid || !userId) {
    return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO purchases (purchase_no, user_id, purchase_date, vendor_name, receipt_image) VALUES (?, ?, ?, ?, ?)',
      [id, userId, date, vendor, receiptImage]
    );

    const insertResult = result as ResultSetHeader;

    for (const item of items) {
      await db.query(
        'INSERT INTO products (product_no, purchase_id, name, category, color, size, options, unit_price, quantity, unreceived_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.itemId, insertResult.insertId, item.name, item.category, item.color, item.size, item.options, item.unitPrice, item.quantity, item.missingQuantity]
      );
    }

    res.status(200).json({ message: '사입내역 추가 완료' });
  } catch (error) {
    console.error('사입내역 추가 오류', error);
    res.status(500).json({ message: '서버 오류' });
  }
})

app.get('/api/users/:id/purchases', async (req, res) => {
    const { id } = req.params;

    try {
      const [rows] = await db.query(
        `SELECT 
          p.purchase_id,
          p.purchase_no,
          p.purchase_date,
          p.vendor_name,
          p.receipt_image,
          p.created_at,
          pr.product_id,
          pr.product_no,
          pr.name AS product_name,
          pr.category,
          pr.color,
          pr.size,
          pr.options,
          pr.unit_price,
          pr.quantity,
          pr.total_price,
          pr.unreceived_quantity
        FROM purchases p
        JOIN products pr ON p.purchase_id = pr.purchase_id
        WHERE p.user_id = ?
        ORDER BY p.purchase_date DESC, p.purchase_id DESC;`,
        [id]
      )

      return res.status(200).json({
        message: '사입내역 조회 완료',
        purchases: rows,
      })
    } catch (error) {

    }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});