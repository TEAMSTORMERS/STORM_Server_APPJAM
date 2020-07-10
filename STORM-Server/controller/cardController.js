const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const CardDao = require('../dao/card');

module.exports = {

    createCard : async (req, res) => {
        const {user_idx, project_idx, round_idx, card_img, card_txt} = req.body;

        if(!user_idx || !project_idx || !round_idx || (!card_img && !card_txt)){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const createCard = await CardDao.createCard(user_idx, project_idx, round_idx, card_img, card_txt);
        if(createCard === -1) {
          return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_CARD));
    },

    createscrap : async (req, res) => {

        const {card_idx, user_idx} = req.body;

        if(!card_idx || !user_idx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //이미 존재하는 스크랩이면 못 하게 막기

        const scarp_idx = await CardDao.createscrap(card_idx, user_idx);
        if(scarp_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SCRAP_CARD_SUCCESS));
    },

    deletescrap : async (req, res) => {
        const user_idx = req.params.user_idx;
        const card_idx = req.params.card_idx;

        if(!user_idx || !card_idx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //scrap_idx 뽑기
        var scrap_idx = await CardDao.checkScrapIdx(user_idx, card_idx);
        if(scrap_idx === -1){
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //scrap 삭제하기
        var result = await CardDao.deletescrap(scrap_idx[0].scrap_idx);

        //성공
        return res.status(statusCode.OK)
        .send(util.success(statusCode.OK, resMessage.DELETE_SCRAP_SUCCESS));
    },

    createMemo : async (req, res) => {
        const {user_idx, card_idx, memo_content} = req.body;

        if(!user_idx || !card_idx){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const memo_idx = await CardDao.createMemo(card_idx, user_idx, memo_content);
        if(memo_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_MEMO));
    },
}