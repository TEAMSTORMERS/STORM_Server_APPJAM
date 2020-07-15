const pool = require('../modules/pool');

module.exports = {

    //host가 새로운 프로젝트 생성
    createProject: async (project_name, project_comment, project_code, project_date) => {
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
    checkProjectIdx: async (project_code) => {
        const query = `SELECT project_idx FROM project WHERE project_code = "${project_code}"`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('checkProjectIdx ERROR : ', err);
            throw err;
        }
    },

    //project_idx를 받았을 때 project_status를 반환
    checkProjectStatus: async (project_idx) => {
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
    memberEnterProject: async (project_idx, user_idx) => {
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
    hostEnterProject: async (project_participant_idx, user_idx) => {
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

    //project_idx를 받았을 때 project_name, project_comment, promect_code를 반환
    getProjectInfo: async (project_idx) => {
        const query = `SELECT project_name, project_comment, project_code FROM project WHERE project_idx = "${project_idx}"`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('getProjectInfo ERROR : ', err);
            throw err;
        }
    },

    //project_idx를 받았을 때 user_idx, user_name, user_img를 반환
    getProjectparticipant: async (project_idx) => {
        const query1 = `SELECT user_idx FROM project_participant WHERE project_idx = ${project_idx}`;
        const query2 = `SELECT user_name, user_img FROM user WHERE user_idx in (${query1})`;

        try {
            const result = await pool.queryParamArr(query2);
            return result;
        } catch (err) {
            console.log('getProjectparticipant ERROR : ', err);
            throw err;
        }
    },

    //user_idx, project_idx를 받았을 때 project_participant_idx를 반환
    checkProjectParticipantIdx: async (user_idx, project_idx) => {
        const query = `SELECT project_participant_idx FROM project_participant WHERE user_idx = ${user_idx} and project_idx = ${project_idx};`;

        try {
            const result = await pool.queryParamArr(query);
            console.log(result);
            return result;
        } catch (err) {
            console.log('checkProjectParticipantIdx ERROR : ', err);
            throw err;
        }
    },

    //project_participant_idx를 받았을 때 해당하는 project_participant_idx를 삭제
    deleteProjectparticipant: async (project_participant_idx) => {
        const query = `DELETE FROM project_participant WHERE project_participant_idx = ${project_participant_idx}`;

        try {
            const result = pool.queryParamArr(query);
            return result;

        } catch (err) {
            console.log('deleteProjectparticipant ERROR : ', err);
            throw err;
        }

    },

    //project_participant_idx를 받았을 때 해당 idx가 project_participant_host 테이블에 있는지 확인
    checkHost: async (project_participant_idx) => {
        const query = `SELECT COUNT(*) FROM project_participant_host WHERE project_participant_idx = ${project_participant_idx}`;

        try {
            const result = pool.queryParamArr(query);
            const ifHost = result[0]["COUNT(*)"];
            return ifHost;

        } catch (err) {
            console.log('checkHost ERROR : ', err);
            throw err;
        }

    },

    //user_idx를 받았을 때 project_idx, project_name을 반환
    getProjectIdxName: async (user_idx) => {
        const query = `SELECT p.project_idx, p.project_name
                       FROM project_participant pp JOIN project p ON pp.project_idx = p.project_idx
                       WHERE pp.user_idx = ${user_idx}`;
        try {
            const result = await pool.queryParam(query);
            return result;
        } catch (err) {
            console.log('getProjectIdx ERROR : ', err);
            throw err;
        }
    },

    //project_idx를 받았을 때 card_img, card_txt를 반환
    getProjectCard: async (project_idx) => {
        const query = `SELECT card_img, card_txt FROM card WHERE project_idx = ${project_idx}`;
        try {
            const result = await pool.queryParamArr(query);
            return result;
        } catch (err) {
            console.log('getProjectCard ERROR : ', err);
            throw err;
        }
    },

    //project_idx를 받았을 때 round수, project_name, project_date, user_idx 반환
    finalInfo: async (project_idx) => {
        const query1 = `SELECT COUNT(*) FROM round WHERE project_idx = ${project_idx}`;
        const query2 = `SELECT project_name, project_date FROM project WHERE project_idx = ${project_idx}`;
        const query3 = `SELECT user_idx FROM project_participant WHERE project_idx = ${project_idx}`;

        try {
            const round_count = await pool.queryParam(query1);
            const round_number = round_count[0]["COUNT(*)"];
            const project_result = await pool.queryParam(query2);
            const user_idx_list = await pool.queryParam(query3);

            const array = [];
            for (var i = 0; i < user_idx_list.length; i++) {
                const query4 = `SELECT user_img FROM project_participant AS p, user AS u WHERE u.user_idx = ${user_idx_list[i]["user_idx"]}`;
                const user_img_list = await pool.queryParam(query4);
                array.push(user_img_list[0]["user_img"]);
            }

            var data = new Object();
            data.project_name = project_result[0]["project_name"];
            data.project_date = project_result[0]["project_date"];
            data.round_count = round_number;
            data.project_participants_list = array;
            return data;
        } catch (err) {
            console.log('finalInfo ERROR : ', err);
            throw err;
        }
    },

    //user_idx, project_idx를 받았을 때 project_name, card_idx, card_img, card_txt를 반환
    finalScarpList: async (user_idx, project_idx) => {
        const query1 = `SELECT project_name, COUNT(scrap_idx) AS scrap_count
                        FROM project JOIN card ON project.project_idx = card.project_idx JOIN scrap ON scrap.card_idx = card.card_idx
                        WHERE project.project_idx = ${project_idx} AND scrap.user_idx = ${user_idx};`;
        
        const query2 = `SELECT card.card_idx, card.card_img, card.card_txt
                        FROM project JOIN card ON project.project_idx = card.project_idx JOIN scrap ON scrap.card_idx = card.card_idx
                        WHERE project.project_idx = ${project_idx} AND scrap.user_idx = ${user_idx};`
        
        try {
            const query1_result = await pool.queryParam(query1);
            const query2_result = await pool.queryParam(query2);

            const array = [];
            
            for (var i = 0; i < query1_result[0]["scrap_count"]; i++) {
                const data = new Object();
                data.card_idx = query2_result[i]["card_idx"];
                data.card_img = query2_result[i]["card_img"];
                data.card_txt = query2_result[i]["card_txt"];
                array.push(data);
            }
            
            const data2 = new Object();
            data2.project_name = query1_result[0]["project_name"];
            data2.scrap_count = query1_result[0]["scrap_count"];
            data2.scrap_count = query2_result.length;
            data2.card_item = array;
            return data2;

        } catch (err) {
            console.log('finalScarpList ERROR : ', err);
            throw err;
        }
    }
}