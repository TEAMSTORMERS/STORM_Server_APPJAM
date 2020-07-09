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

        //랜덤 코드가 현재 사용중인 코드와 겹치지는 않는지 확인하는 과정 필요함
        //프로젝트 종료 후 랜덤 코드 삭제하는 방법은 어때?

        //예외처리2 : project_idx가 제대로 생성되었는지 확인
        const result = await ProjectDao.createProject(project_name, project_comment, project_code, project_date);
        const projectIdx = result.insertId;
        if(projectIdx === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //프로젝트가 잘 생성 되었을 경우 아래에 host 정보 등록
        
        //project_participant table에 user 정보 추가
        const project_participant_idx = await ProjectDao.memberEnterProject(projectIdx, user_idx);
        if(project_participant_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        
        //프로젝트 생성자이기 때문에 project_participant_host table에 user 정보 추가
        const project_participant_host_idx = await ProjectDao.hostEnterProject(project_participant_idx, user_idx);
        if(project_participant_host_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //프로젝트 생성 성공 - project_code, project_idx 출력
        res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.CREATED_PROJECT_SUCCESS, {
            "project_code" : project_code,
            "project_idx" : projectIdx
        }));
    },

    memberEnterProject : async (req, res) => {
        const {user_idx, project_code} = req.body;

        //예외처리1 : user_idx나 project_code가 null일 경우
        if(!user_idx || !project_code){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //예외처리2 : project_idx를 제대로 받아왔는지 확인
        const result = await ProjectDao.checkProjectIdx(project_code);
        const project_idx = result[0].project_idx;
        if(project_idx === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //예외처리3 : project가 진행중일 경우 참여할 수 없음
        const projectStatus = await ProjectDao.checkProjectStatus(project_idx);
        const project_status = projectStatus[0].project_status;
        if(project_status == 1){
            return res.status(statusCode.CANNOT_JOIN).send(util.fail(statusCode.CANNOT_JOIN, resMessage.JOIN_PROJECT_FAIL));
        }

        //예외처리4 : projectParticipantIdx가 제대로 존재하는지 확인
        const projectParticipantIdx = await ProjectDao.memberEnterProject(project_idx, user_idx);
        if(projectParticipantIdx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //프로젝트 참여 성공
        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.JOIN_PROJECT_SUCCESS, {
            "project_idx" : project_idx
        }));
    },

    getProjectparticipant : async (req, res) => {
        const project_idx = req.params.project_idx;

        if(!project_idx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }
    
        var result = await ProjectDao.getProjectparticipant(project_idx);
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.SHOW_PROJECT_PARTICIPANT_LIST_SUCCESS, result));
    },

    getProjectInfo : async (req, res) => {
        const project_idx = req.params.project_idx;

        var result = await ProjectDao.getProjectInfo(project_idx);
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.READ_POST_SUCCESS, result));
    },

    deleteProjectparticipant : async(req, res) => {
        const user_idx = req.params.user_idx
        const project_idx = req.params.project_idx;

        //값이 제대로 들어오지 않았을 경우
        if(!user_idx || !project_idx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        // project_participant_idx 뽑아내기
        const result = await ProjectDao.checkProjectParticipantIdx(user_idx, project_idx);
        const project_participant_idx = result[0].project_participant_idx;

        if(project_participant_idx === -1){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NO_PROJECT_PARTICIPANT));  
            return;
        }

        //삭제하기
        const fin = await ProjectDao.deleteProjectparticipant(project_participant_idx);


        //만약 호스트일 경우 체크
        

        //성공
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.DELETE_PROJECT_PARTICIPANT_SUCCESS));
    },

    showAllProject : async (req, res) => {
        const user_idx = req.params.user_idx;

        var result = await ProjectDao.showAllProject(user_idx);
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.READ_POST_SUCCESS, {
            "project_idx": project_idx,
            "project_name": project_name,
            "project_card" : result
        }));
    }
}