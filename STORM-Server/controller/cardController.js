const util = require('../modules/util');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/responseMessage');
const CardDao = require('../dao/card');

module.exports = {

    createCard : async (req, res) => {
        const {user_idx, project_idx, round_idx, card_img} = req.body;

        if(!user_idx || !project_idx || !round_idx || !card_img){
            res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
            return;
        }

        const createCard = await CardDao.createCard(user_idx, project_idx, round_idx, card_img);
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

        const scarp_idx = await CardDao.scrap(card_idx, user_idx);
        if(scarp_idx === -1) {
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }

        res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SCRAP_CARD_SUCCESS));
    },

    deletescrap : async (req, res) => {
        const user_idx = req.params.user_idx;
        const card_idx = req.params.card_idx;

        
    }
}