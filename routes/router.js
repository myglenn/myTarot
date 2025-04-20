const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/draw', mainController.drawCard);
router.get('/list', mainController.listCards);

module.exports = router;