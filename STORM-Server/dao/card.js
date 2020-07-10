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
    }
}