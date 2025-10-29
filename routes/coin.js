const express = require('express');
const router = express.Router();
const { getCoins, postHistory, getHistory, ping } = require('../controllers/coinController');

router.get('/coins', getCoins);
router.post('/history', postHistory);
router.get('/history/:coinId', getHistory);
router.get('/ping', ping);

module.exports = router;