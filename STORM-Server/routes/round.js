var express = require('express');
var router = express.Router();
const roundController = require('../controller/roundController');
const upload = require('../modules/multer');


router.get('/count/:project_idx', roundController.roundCount);


module.exports = router;