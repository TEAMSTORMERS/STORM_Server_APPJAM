var express = require('express');
var router = express.Router();
const userController = require('../controller/userController');
const upload = require('../modules/multer');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', upload.single('user_img'), userController.signup);

module.exports = router;