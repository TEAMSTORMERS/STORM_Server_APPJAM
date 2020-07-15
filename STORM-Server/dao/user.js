const pool = require('../modules/pool');

module.exports = {

    //회원가입
    signup: async (user_name, user_token_kakao, user_token_google, user_img) => {
        const fields = 'user_name, user_token_kakao, user_token_google, user_img';
        const questions = `?, ?, ?, ?`;
        const values = [user_name, user_token_kakao, user_token_google, user_img];
        const query = `INSERT INTO user (${fields}) VALUES (${questions})`;
        try {
            const result = await pool.queryParamArr(query, values);
            const insertId = result.insertId;
            return insertId;
        } catch (err) {
            if (err.errno == 1062) {
                console.log('signup ERROR : ', err.errno, err.code);
                return -1;
            }
            console.log('signup ERROR : ', err);
            throw err;
        }
    }
}