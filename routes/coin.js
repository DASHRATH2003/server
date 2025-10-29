const express = require('express');
const router = express.Router();
const { getCoins, postHistory, getHistory } = require('../controllers/coinController');

router.get('/coins', getCoins);
router.post('/history', postHistory);
router.get('/history/:coinId', getHistory);

module.exports = router;