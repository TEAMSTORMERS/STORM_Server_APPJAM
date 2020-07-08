var express = require('express');
var router = express.Router();
const projectController = require('../controller/projectController');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', projectController.createProject);
router.post('/enter', projectController.memberEnterProject);
router.get('/:project_idx', projectController.getProjectInfo);

module.exports = router;