const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const UserModel = require('../dao/user');

const user = {
    signup : async (req, res) => {
        //1. request body에서 값을 읽어온다.
        const {user_name, user_token_kakao, user_token_google, user_img} = req.body;
      
        //예외처리1 : parameter 체크 - 하나라도 null이나 undefined가 들어올 경우
        if(!user_name || (!user_token_kakao && !user_token_google)){
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE)); //400은 요청이 잘못됐다는 오류 메세지
          return;
        }
    
        /*
        //예외처리2 : 아이디 중복 체크
        if (await UserModel.checkUser(id)) {
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.ALREADY_ID));
          return;
        }
        */
      
        //2. 새로운 User를 등록한다.
        const userIdx = await UserModel.signup(user_name, user_token_kakao, user_token_google, user_img);
        if(userIdx === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
      
        //3. 가입성공
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_USER));
    }
}

module.exports = user;