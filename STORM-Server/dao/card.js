const pool = require('../modules/pool');

module.exports = {

    createCard : async (user_idx, project_idx, round_idx, card_img) => {
        const fields = 'user_idx, project_idx, round_idx, card_img';
        const questions = `?, ?, ?, ?`;
        const values = [user_idx, project_idx, round_idx, card_img];
        const query = `INSERT INTO card (${fields}) VALUES (${questions})`;

        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            console.log('checkProjectIdx ERROR : ', err);
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
             console.log('scrap ERROR : ', err);
             throw err;
        }
    },

    deletescrap : async(card_idx, user_idx) => {
        const fields = 'card_idx, user_idx';
        const questions = `?, ?`;
        const values = [card_idx, user_idx];
        const query = `INSERT INTO scrap (${fields}) VALUES (${questions})`;

        try{
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        }catch(err){
             console.log('scrap ERROR : ', err);
             throw err;
        }
    }
}