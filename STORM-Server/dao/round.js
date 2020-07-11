const pool = require('../modules/pool');

module.exports = {
    countInfo: async (project_idx) => {
        const values = project_idx;   //파라미터로 받은 데이터들을 그대로 배열로 만들어서 넘겨줌
        const query = `SELECT COUNT(*) FROM round WHERE project_idx = ${project_idx}`
        try {
            const result = await pool.queryParamArr(query, values);
            return result[0]["COUNT(*)"];
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },

    roundSetting: async (project_idx, round_purpose, round_time) => {
        
        const fields = 'round_number, round_purpose, round_time, project_idx';
        const questions = '?, ?, ?, ?'

        const query1 = `SELECT COUNT(*) FROM round WHERE project_idx = ${project_idx}`
        const query2 = `INSERT INTO round (${fields}) VALUES (${questions})`
        try {
            const round_count = await pool.queryParam(query1);
            const round_number = round_count[0]["COUNT(*)"]+1;

            console.log(round_number);
            
            const value = [round_number, round_purpose, round_time, project_idx];
            const result = await pool.queryParamArr(query2, value);
            return result;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    },

    roundInfo: async (project_idx) => {
        //여기까지.
        const query1 = `SELECT COUNT(*) FROM round WHERE project_idx = ${project_idx}`
        console.log(project_idx);
        try{
            const round_count = await pool.queryParam(query1);
            const round_number = round_count[0]["COUNT(*)"]+1;
            
            const fields = `round_idx, round_number, round_purpose, round_time`;
            const query2 = `SELECT ${fields} FROM round WHERE project_idx = ${project_idx} AND round_number = ${round_number}`
            const result = await pool.queryParam(query2)
            return result
        }catch(err){
            console.log('roundInfo ERROR : ', err);
            throw err;
        }
    },

    roundEnter: async(user_idx, round_idx) => {
        const fields = `user_idx, round_idx`;
        const questions = '?, ?'
        const values = [user_idx, round_idx];

        const query = `INSERT INTO round_participant (${fields}) VALUES (${questions})`;
        console.log('여기인가');
        try{
            const result = await pool.queryParamArr(query, values);
            console.log('여기일꽈');
            return result;
        }catch(err){
            console.log('여기서 에러가 난 걸꺼야.')
            console.log('roundEnter ERROR : ', err);
            throw err;
        }
    },
    roundLeave: async(user_idx, round_idx) => {
        const query = `DELETE * FROM round_participant WHERE user_idx = ${user_idx} AND round_idx = ${round_idx}`;
        try{
            const result = await pool.queryParam(query)
            return result
        }catch(err){
            console.log('에러났다 이놈아');
        }
    },
    roundMemberList: async(round_idx) => {
        const query1 = `SELECT round_participant.user_idx FROM round_participant, round WHERE round_participant.round_idx = round.round_idx`;

        try{
            const round_user = await pool.queryParam(query1);
            console.log(round_user[0]["user_idx"])
           
            const array = [];
            for(var i=0; i< round_user.length; i++){
                const query2 = `SELECT user_name, user_img FROM user WHERE user_idx = ${round_user[i]["user_idx"]}`;
                const result2 = await pool.queryParam(query2)
                var data = new Object();
                data.user_name = result2[0].user_name
                data.user_img = result2[0].user_img
                array.push(data)
            }
            return array
        }catch(err){
            console.log(err);
        }
    },
    roundCardList: async(project_idx, round_idx) => {
        const query1 = `SELECT round_number, round_purpose, round_time FROM round WHERE round_idx = ${round_idx}`;
        const query2 = `SELECT card_idx, card_img, card_txt FROM card WHERE round_idx = ${round_idx}`;
        const query3 = `SELECT project_name FROM project WHERE project_idx = ${project_idx}`;

        try{
            const round_result = await pool.queryParam(query1);
            const card_result = await pool.queryParam(query2)
            const project_result = await pool.queryParam(query3);

            var data = new Object();
            data.project_name = project_result[0]["project_name"];
            data.round_number = round_result[0]["round_number"];
            data.round_purpose = round_result[0]["round_purpose"];
            data.round_time = round_result[0]["round_time"];
            var array = [];
            for(var i=0; i< card_result.length;i++){
                var data2 = new Object();
                data2.card_idx =card_result[0]["card_idx"];
                data2.card_img = card_result[0]["card_img"];
                data2.card_txt = card_result[0]["card_txt"];
                array.push(data2);
                console.log(data2);
            };
            data.card_list = array
            console.log(data);
            return data

        }catch(err){
            console.log(err);
        }
    },
    roundFinalInfo: async(project_idx) => {
        try{
            const query1 = `SELECT round_purpose, round_time, round_number FROM round r JOIN project p ON r.project_idx = p.project_idx JOIN round_participant rp ON r.round_idx = rp.round_idx WHERE p.project_idx = ${project_idx}`
            const result = await pool.queryParam(query1);
            console.log('여기')
            console.log(result);
        }catch(err){

        }
    }
}