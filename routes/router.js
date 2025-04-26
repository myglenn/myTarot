const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');
const path = require('path');


// 메인 페이지 카드셔플 act
router.post('/main/act', mainController.mainAct);
// api 시연 페이지 호출 act
router.post('/api/act', mainController.apiAct);
// 실제 restful api
router.post('/api/reading', mainController.reading);

module.exports = router;