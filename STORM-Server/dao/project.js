const pool = require('../modules/pool');

module.exports = {
    //host가 새로운 프로젝트 생성
    createProject : async (project_name, project_comment, project_code, project_date) => {
        const fields = 'project_name, project_comment, project_code, project_status, project_date';
        const questions = `?, ?, ?, ?, ?`;
        const values = [project_name, project_comment, project_code, 0, project_date];
        const query = `INSERT INTO project (${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            return result;
        } catch (err) {
            console.log('createProject ERROR : ', err);
            throw err;
        }
    },

    //project_code를 받았을 때 project_idx를 반환
    checkProjectIdx : async (project_code) => {
        const query = `SELECT project_idx FROM project WHERE project_code = "${project_code}"`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('checkProjectIdx ERROR : ', err);
            throw err;
        }
    },

    checkProjectStatus : async (project_idx) => {
        const query = `SELECT project_status FROM project WHERE project_idx = "${project_idx}"`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('checkProjectStatus ERROR : ', err);
            throw err;
        }
    },
    
    //member가 project에 참여했을 때 project_participant에 새로운 row 추가
    memberEnterProject : async (project_idx, user_idx) => {
        const fields = 'project_idx, user_idx';
        const questions = `?, ?`;
        const values = [project_idx, user_idx];
        const query = `INSERT INTO project_participant (${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('memberEnterProject ERROR : ', err);
            throw err;
        }
    },

    //host가 project에 참여했을 때 project_participant에 새로운 row 추가
    hostEnterProject : async (project_participant_idx, user_idx) => {
        const fields = 'project_participant_idx, user_idx';
        const questions = `?, ?`;
        const values = [project_participant_idx, user_idx];
        const query = `INSERT INTO project_participant_host (${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('hostEnterProject ERROR : ', err);
            throw err;
        }
    },

    getProjectInfo : async (project_idx) => {
        const query = `SELECT project_idx, project_name, project_comment, project_code FROM project WHERE project_idx = "${project_idx}"`;
        try{
            const result = await pool.queryParamArr(query);
            return result;
        } catch(err) {
            console.log('getProjectInfo ERROR : ', err);
            throw err;
        }
    },

    getProjectparticipant : async (project_idx) => {
        const query1 = `SELECT user_idx FROM project_participant WHERE project_idx = ${project_idx}`;
        const query2 = `SELECT user_name, user_img FROM user WHERE user_idx in (${query1})`;

        try{
            const result = await pool.queryParamArr(query2);
            return result;
        } catch(err) {
            console.log('getProjectparticipant ERROR : ', err);
            throw err;
        }
    },

    checkProjectParticipantIdx : async (user_idx, project_idx) => {
        const query = `SELECT project_participant_idx FROM project_participant WHERE user_idx = ${user_idx} and project_idx = ${project_idx}`;

        try{
            const result = await pool.queryParamArr(query);
            return result;
        } catch(err) {
            console.log('checkProjectParticipantIdx ERROR : ', err);
            throw err;
        }
    },

    deleteProjectparticipant : async (project_participant_idx) => {
        const query = `DELETE FROM project_participant WHERE project_participant_idx = ${project_participant_idx}`;

        try{
            const result = pool.queryParamArr(query);
            return result;

        }catch(err){
            console.log('deleteProjectparticipant ERROR : ', err);
            throw err;
        }

    },

    checkHost : async (project_participant_idx) => {
        const query = `SELECT COUNT(*) FROM project_participant_host WHERE project_participant_idx = ${project_participant_idx}`;

        try{
            const result = pool.queryParamArr(query);
            const ifHost = result[0]["COUNT(*)"];
            return isHost;

        }catch(err){
            console.log('checkHost ERROR : ', err);
            throw err;
        }

    },

    getProjectIdx : async(user_idx) => {
        const query = `SELECT project_idx FROM project_participant WHERE user_idx = ${user_idx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err){
            console.log('getProjectIdx ERROR : ', err);
            throw err;
        }
    },

    getProjectName : async(project_idx) => {
        const query = `SELECT project_name FROM project WHERE project_idx = ${project_idx}`;
        try{
            const result = await pool.queryParam(query);
            return result;
        }catch (err){
            console.log('getProjectName ERROR : ', err);
            throw err;
        }
    },

    getProjectCard : async (project_idx) => {
        const query = `SELECT card_img, card_txt FROM card WHERE project_idx = ${project_idx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('getProjectCard ERROR : ', err);
            throw err;
        }
    },

    showAllProject : async (project_idx) => {
        const query = `SELECT card_img, card_txt FROM card WHERE project_idx = ${project_idx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('getProjectList ERROR : ', err);
            throw err;
        }
    }
}