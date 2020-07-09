var express = require('express');
var router = express.Router();
const projectController = require('../controller/projectController');
//const AuthMiddleware = require('../middlewares/auth');

router.post('/', projectController.createProject);
router.post('/enter', projectController.memberEnterProject);
router.get('/:user_idx', projectController.showAllProject);
router.get('/:project_idx', projectController.getProjectInfo);
router.get('/enter/:project_idx', projectController.getProjectparticipant);
router.delete('/:user_idx/:project_idx', projectController.deleteProjectparticipant);

module.exports = router;