const pool = require('../modules/pool');
const roundTable = 'round';

module.exports = {
    countInfo: async (project_idx) => {
        const values = project_idx;   //파라미터로 받은 데이터들을 그대로 배열로 만들어서 넘겨줌
        const query = `SELECT COUNT(*) FROM ${roundTable} WHERE project_idx = ${project_idx}`
        try {
            const result = await pool.queryParamArr(query, values);
            return result;
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

