const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const sequelize = require('./config/db');

// env 설정
dotenv.config();

// 미들웨어
app.use(express.json());

// 라우터
const router = require('./routes/router');
app.use('/api/tarot', router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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