var express = require('express');
var router = express.Router();
const roundController = require('../controller/roundController');

router.get("/count/:project_idx", roundController.roundCount);
router.post("/setting", roundController.roundSetting);
router.get("/info/:project_idx", roundController.roundInfo);
router.post("/enter", roundController.roundEnter);
router.delete("/leave/:user_idx/:round_idx", roundController.roundLeave);
router.get("/memberList/:round_idx", roundController.roundParticipant);
router.get("/cardList/:project_idx/:round_idx", roundController.roundCardList);
router.get("/roundFinalInfo/:project_idx", roundController.roundFinalInfo);

module.exports = router;