var express = require('express');
var router = express.Router();
const cardController = require('../controller/cardController');
const card = require('../dao/card');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', cardController.createCard);
router.post('/scrap', cardController.createscrap);
router.delete('/scrap/:user_idx/:card_idx', cardController.deletescrap);

module.exports = router;