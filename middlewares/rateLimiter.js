
const rateLimit = require('express-rate-limit');

// 요청 수 제한 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분 동안
  max: 100, // IP당 최대 100번 요청 허용
  message: '요청이 너무 많습니다. 나중에 다시 시도해주세요.',
  standardHeaders: true, // (선택) RateLimit-* 헤더를 표준화
  legacyHeaders: false,  // (선택) X-RateLimit-* 헤더 비활성화
});

module.exports = limiter;