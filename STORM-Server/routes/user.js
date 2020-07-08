var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');
//const AuthMiddleware = require('../middlewares/auth');
const upload = require('../modules/multer');

router.post('/', upload.single('user_img'), userController.signup);

module.exports = router;