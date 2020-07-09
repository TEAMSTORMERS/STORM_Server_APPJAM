var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/user', require('./user'));
router.use('/project', require('./project'));
router.use('/round', require('./round'));
router.use('/card', require('./card'));

module.exports = router;