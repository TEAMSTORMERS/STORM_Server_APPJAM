const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const roundModel = require('../dao/round');

const round = {
    roundCount : async (req, res) => {
        //1. request body에서 값을 읽어온다.
        const project_idx = req.body;
      
        if(!project_idx){
          console.log("여기?");
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE)); //400은 요청이 잘못됐다는 오류 메세지
          return;
        }

 
        const count = await roundModel.countInfo(project_idx);
        console.log("여기??");
        if(count === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
      
        //3. 가입성공
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER));
    }
}

module.exports = round;