var express = require('express');
var router = express.Router();
const roundController = require('../controller/roundController');

router.get("/count/:project_idx", roundController.roundCount);
router.post("/setting", roundController.roundSetting);

module.exports = router;