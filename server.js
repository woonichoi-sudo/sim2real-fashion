require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error('GOOGLE_API_KEY가 .env에 설정되지 않았습니다.');
  process.exit(1);
}

// Gemini generateContent 프록시
app.post('/api/generate/:model', async (req, res) => {
  const { model } = req.params;
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: { message: err.message } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
