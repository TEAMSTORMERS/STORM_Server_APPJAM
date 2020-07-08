const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const ProjectDao = require('../dao/project');

module.exports = {
    createProject : async (req, res) => {
        const {project_name, project_comment, user_idx} = req.body;
      
        //예외처리1 : project_name이나 user_idx가 null일 경우
        if(!project_name || !user_idx){
          res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
          return;
        }

        //랜덤 코드 생성
        const project_code = Math.random().toString(36).substr(2,11);

        //오늘 날짜 데이터 생성
        var date = new Date(); 
        var year = date.getFullYear();
        var month = new String(date.getMonth()+1);
        var day = new String(date.getDate());
        if(month.length == 1){ 
            month = "0" + month; 
        }
        if(day.length == 1){ 
            day = "0" + day; 
        }
        const project_date = year+"."+month+"."+day;

        //예외처리2 : project_idx가 제대로 생성되었는지 확인
        const projectIdx = await ProjectDao.createProject(project_name, project_comment, project_code, project_date);
        if(projectIdx === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
      
        //3. 가입성공
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_PROJECT_SUCCESS));
    }
}