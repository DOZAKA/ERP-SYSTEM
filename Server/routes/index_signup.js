/**
 * Created by KIMDONGWON on 2015-11-15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index_signup', { title: '회원가입' });
});

router.post('/', function(req, res, next) {

    res.json(req.body);
    //res.send(req.body);

   // repo.hasUserID(req.body, res);
});

exports.join = function(req, res) {
    repo.hasUserID(req.body, res);
};

module.exports = router;
