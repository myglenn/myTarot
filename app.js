const express = require('express');
const dotenv = require('dotenv');
const xss = require('xss-clean');

// env 설정
dotenv.config();


const app = express();
const path = require('path');
const sequelize = require('./config/db');
const cors = require('cors');
const corsOptions = require('./config/corsConfig');
const applyHelmet = require('./middlewares/helmet');
const rateLimiter = require('./middlewares/rateLimiter');
// 라우터
const router = require('./routes/router');


// 미들웨어
app.use(express.json());
app.use(cors(corsOptions));
app.use(applyHelmet());
app.use(rateLimiter);
app.use(express.json({ limit: '10kb' })); 
app.use(xss());



app.use('/', router);

app.use(express.static(path.join(__dirname, "public")));

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/api', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'api.html'));
});

sequelize.sync().then(() => {
  console.log('✅ MariaDB 연결 및 모델 동기화 완료');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🎴 Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ DB 연결 실패:', err);
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: '서버 내부 오류입니다.' });
});
