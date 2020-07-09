var express = require('express');
var router = express.Router();
const cardController = require('../controller/cardController');
const card = require('../dao/card');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', cardController.createCard);

module.exports = router;