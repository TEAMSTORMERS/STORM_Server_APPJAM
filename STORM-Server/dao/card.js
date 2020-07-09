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
    }
}