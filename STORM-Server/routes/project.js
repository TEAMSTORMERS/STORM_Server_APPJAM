var express = require('express');
var router = express.Router();
const projectController = require('../controller/projectController');

router.post('/', projectController.createProject); 
router.post('/enter', projectController.memberEnterProject);
router.get('/user/:user_idx', projectController.showAllProject);
router.get('/:project_idx', projectController.getProjectInfo);
router.get('/enter/:project_idx', projectController.getProjectparticipant);
router.delete('/:user_idx/:project_idx', projectController.deleteProjectparticipant);
router.get('/finalInfo/:project_idx', projectController.finalInfo);
router.get('/finalScarpList/:user_idx/:project_idx', projectController.finalScrapList);
router.put('/status/:project_idx', projectController.statusProject);

module.exports = router;