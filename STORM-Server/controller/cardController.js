const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const CardDao = require('../dao/card');

module.exports = {

    //카드 추가
    createCard: async (req, res) => {
        const { user_idx, project_idx, round_idx, card_txt } = req.body;
        var card_img;

        if (!card_txt) {
            card_img = req.file.location;
        }

        if (!user_idx || !project_idx || !round_idx || (!card_img && !card_txt)) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const createCard = await CardDao.createCard(user_idx, project_idx, round_idx, card_img, card_txt);
        if (createCard === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_CARD));
    },

    //카드 스크랩
    createscrap: async (req, res) => {

        const { card_idx, user_idx } = req.body;

        if (!card_idx || !user_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const scarp_idx = await CardDao.createscrap(card_idx, user_idx);
        if (scarp_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SCRAP_CARD_SUCCESS));
    },

    //카드 스크랩 취소
    deletescrap: async (req, res) => {
        const user_idx = req.params.user_idx;
        const card_idx = req.params.card_idx;

        if (!user_idx || !card_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        //scrap_idx 뽑기
        var scrap_idx = await CardDao.checkScrapIdx(user_idx, card_idx);
        if (scrap_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        //scrap 삭제하기
        var result = await CardDao.deletescrap(scrap_idx[0]["scrap_idx"]);

        //성공
        return res.status(statusCode.OK)
            .send(util.success(statusCode.OK, resMessage.DELETE_SCRAP_SUCCESS));
    },

    //카드에 메모 추가
    createMemo: async (req, res) => {
        const { user_idx, card_idx, memo_content } = req.body;

        if (!user_idx || !card_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const memo_idx = await CardDao.createMemo(user_idx, card_idx, memo_content);
        if (memo_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.CREATED_MEMO));
    },

    //카드에 메모 수정
    updateMemo: async (req, res) => {
        const { user_idx, card_idx, memo_content } = req.body;

        if (!user_idx || !card_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CardDao.updateMemo(user_idx, card_idx, memo_content);
        if (result === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATED_MEMO));
    },

    //카드 정보(카드 상세보기에 있는 정보 모두) 출력 - 클라와 이야기 필요(승환오빠가 이야기했던 부분)
    showCard: async (req, res) => {
        const user_idx = req.params.user_idx;
        const card_idx = req.params.card_idx;

        if (!user_idx || !card_idx) {
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const result = await CardDao.showCard(user_idx, card_idx);
        if (result === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_MEMO, result));
    }
}