const pool = require('../modules/pool');

module.exports = {

    createCard : async (user_idx, project_idx, round_idx, card_img, card_txt) => {
        const fields = 'user_idx, project_idx, round_idx, card_img, card_txt';
        const questions = `?, ?, ?, ?, ?`;
        const values = [user_idx, project_idx, round_idx, card_img, card_txt];
        const query = `INSERT INTO card (${fields}) VALUES (${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('createCard ERROR : ', err);
            throw err;
        }
    },

    createscrap : async(card_idx, user_idx) => {
        const fields = 'card_idx, user_idx';
        const questions = `?, ?`;
        const values = [card_idx, user_idx];
        const query = `INSERT INTO scrap (${fields}) VALUES (${questions})`;

        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        }catch(err){
             console.log('createscrap ERROR : ', err);
             throw err;
        }
    },

    checkScrapIdx : async(user_idx, card_idx) => {
        const query = `SELECT scrap_idx FROM scrap WHERE user_idx = ${user_idx} AND card_idx = ${card_idx}`;

        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
            console.log('checkScrapIdx ERROR : ', err);
             throw err;
        }
        
    },

    deletescrap : async(scrap_idx) => {
        const query = `DELETE FROM scrap WHERE scrap_idx = ${scrap_idx}`;

        try{
            const result = await pool.queryParamArr(query);
            return result;
        }catch(err){
             console.log('deletescrap ERROR : ', err);
             throw err;
        }
    },

    createMemo : async(user_idx, card_idx, memo_content) => {
        const fields = 'user_idx, card_idx, memo_content';
        const questions = `?, ?, ?`;
        const values = [user_idx, card_idx, memo_content];
        const query = `INSERT INTO memo (${fields}) VALUES (${questions})`;

        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        }catch(err){
             console.log('createMemo ERROR : ', err);
             throw err;
        }
    },

    updateMemo : async(user_idx, card_idx, memo_content) => {
        const query = `UPDATE memo SET memo_content = "${memo_content}" WHERE user_idx = ${user_idx} AND card_idx = ${card_idx}`;

        try{
            const result = await pool.queryParam(query);
            return result;
        }catch(err){
             console.log('createMemo ERROR : ', err);
             throw err;
        }
    },

    showCard : async(user_idx, card_idx) => {
        //card_idx의 user_idx와 scrap_idx의 user_idx는 다르다. 이 점을 유의해서 다시 작성할 것
        const query1 = `SELECT c.card_idx, c.card_img, c.card_txt, u.user_img 
        FROM card c JOIN user u ON c.user_idx = u.user_idx 
        WHERE c.card_idx = ${card_idx}`;
        
        const query2 = `SELECT m.memo_content FROM memo m JOIN card c ON m.user_idx = ${user_idx} AND c.card_idx = ${card_idx}`;

        const query3 = `SELECT count(s.scrap_idx) AS scrap_flag FROM scrap s JOIN card c ON s.card_idx = c.card_idx WHERE s.user_idx = ${user_idx} AND s.card_idx = ${card_idx}`;

        try{
            const result1 = await pool.queryParam(query1);
            const result2 = await pool.queryParam(query2);
            const result3 = await pool.queryParam(query3)
            var data = new Object();
            data.card_idx = result1[0]["card_idx"]
            data.card_img = result1[0]["card_img"]
            data.card_txt = result1[0]["card_txt"]
            if(result2[0]){
                data.memo_content = result2[0]["memo_content"]
            }
            else{
                data.memo_content = null
            }
            data.user_img = result1[0]["user_img"]
            data.scrap_flag = result3[0]["scrap_flag"]
            return data;
        }catch(err){
            console.log('createMemo ERROR : ', err);
            throw err;
        }
    }
}