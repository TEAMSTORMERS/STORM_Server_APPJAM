var express = require('express');
var router = express.Router();
const projectController = require('../controller/projectController');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', projectController.createProject);
router.post('/enter', projectController.memberEnterProject);

module.exports = router;