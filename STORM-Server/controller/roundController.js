const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const RoundDao = require('../dao/round');

module.exports = {
    roundCount : async (req, res) => {
        //1. request body에서 값을 읽어온다.

        const project_idx = req.params.project_idx;
      
        if(!project_idx){
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_COUNT_FAIL)); //400은 요청이 잘못됐다는 오류 메세지
          return;
        }
 
        const count = await RoundDao.countInfo(project_idx);
        if(count === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.ROUND_COUNT_FAIL));
        }
        
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_COUNT_SUCCESS, count));
    },

    roundSetting : async (req, res) => {
      const {project_idx, round_purpose, round_time} = req.body;
      
      if(!project_idx || !round_purpose || !round_time){
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_SETTING_FAIL));
      }
      const result = await RoundDao.roundSetting(project_idx, round_purpose, round_time);
      console.log(result);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_SETTING_SUCCESS, req.body));
    },

    roundInfo: async (req, res) => {
      const project_idx = req.params.project_idx;
      console.log(project_idx);
      
      if(!project_idx){
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_SETTING_FAIL));
      }
      
      const result = await RoundDao.roundInfo(project_idx);
      console.log(result);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER, result));
    },

    roundEnter: async(req, res) => {
      const {user_idx, round_idx} = req.body;
      console.log(req.body);

      if(!user_idx || !round_idx){
        console.log('여기3');
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_ENTER_SUCCESS));
      }

      const result = await RoundDao.roundEnter(user_idx, round_idx);
      console.log('여기2');
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_ENTER_FAIL));
    },

    // roundLeave: async(req, res) => {
    //   const {user_idx, round_idx} = req.body;
    //   console.log(req.body);
    //   if(!user_idx || !round_idx){
    //     console.log('여기3');
    //     res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_LEAVE_SUCCESS));
    //   }
    //     const result = await RoundDao.roundLeave(user_idx, round_idx);
    //   console.log('여기2');
    //   res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_LEAVE_FAIL));
    // },

    roundParticipant: async(req, res) => {
      const round_idx = req.params.round_idx;
      if(!round_idx){
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_MEMBERLIST_FAIL));
      }

      const result = await RoundDao.roundMemberList(round_idx);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_MEMBERLIST_SUCCESS, result));
    },

    roundCardList: async(req, res) => {
      const project_idx = req.params.project_idx;
      const round_idx = req.params.round_idx;

      if(!project_idx || !round_idx){
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_FINALINFO_FAIL));
      }
      const result = await RoundDao.roundCardList(project_idx, round_idx);
      res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_FINALINFO_SUCCESS, result));
    },


  // //라운드 정보 출력
  // roundInfo: async (req, res) => {
  //   const project_idx = req.params.project_idx;

  //   if (!project_idx) {
  //     res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_SETTING_FAIL));
  //   }

  //   const result = await RoundDao.roundInfo(project_idx);
  //   res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_ROUND_INFO_SUCCESS, {
  //     "round_idx": result[0]["round_idx"],
  //     "round_number": result[0]["round_number"],
  //     "round_purpose": result[0]["round_purpose"],
  //     "round_time": result[0]["round_time"]
  //   }));
  // },

  //라운드 나가기 - round_participant에서 user 정보 삭제
  roundLeave: async (req, res) => {
    const { user_idx, round_idx } = req.body;

    if (!user_idx || !round_idx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ROUND_SETTING_FAIL));
    }
    const result = await RoundDao.roundLeave(user_idx, round_idx);

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_LEAVE_SUCCESS));
  },

  //전체 라운드 정보 출력
  roundFinalInfo: async (req, res) => {
    const project_idx = req.params.project_idx;

    const result = await RoundDao.roundFinalInfo(project_idx);

    res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.ROUND_FINALINFO_SUCCESS, result));
  }
}