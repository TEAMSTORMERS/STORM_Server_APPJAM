const pool = require('../modules/pool');
const userTable = 'user';

module.exports = {
    signup: async (user_name, user_token_kakao, user_token_google, user_img) => {
        const fields = 'user_name, user_token_kakao, user_token_google, user_img';
        const questions = `?, ?, ?, ?`;  // 입력한 user_name, user_token_kakao, user_token_google, user_img 값들
        const values = [user_name, user_token_kakao, user_token_google, user_img];   //파라미터로 받은 데이터들을 그대로 배열로 만들어서 넘겨줌
        const query = `INSERT INTO ${userTable} (${fields}) VALUES (${questions})`;     // INSERT INTO user (user_name, user_token_kakao, user_token_google, user_img) VALUES (?, ?, ?, ?)
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