/**
 * Created by KIMDONGWON on 2016-01-08.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
//var con = DB_handler.connectDB();
var router = express.Router();
var util = require('./util');

router.get('/', util.ensureAuthenticated, function(req, res, next) {
    res.render('vote', {title: '설문조사', grade: util.getUserGrade(req)});
});

router.get('/vManage', util.ensureAuthenticated, function(req, res, next) {

    var connection = DB_handler.connectDB();
    var query = 'select * from t_user WHERE u_state <= 101';

    connection.query(query,function(err,rows){
        if (err) {
            console.error(err);
        }
        var cnt = rows.length;
        res.render('vote_manage', {title: '설문조사 관리', grade: util.getUserGrade(req), joinUserCnt:cnt});
    });

});

/**
 * createNewVote
 * 투표 생성 메소드
 * @param vTitle
 * @param vContent
 * @param vType
 * @param vJoinCnt
 * @param vItems
 */

router.post('/createNewVote', util.ensureAuthenticated, function(req, res, next) {
    var title = req.body.vTitle;
    var content = req.body.vContent;
    var state = 1;                      //0: 삭제, 1: 투표중 2: 투표완료
    var type = req.body.vType;
    var joinCnt = req.body.vJoinCnt;
    var votedCnt = 0;
    var writter = util.getUserId(req);
    var itemsArr = req.body.vItems;
    var itemCnt = itemsArr.length;

    var vote = {
        'v_id':0,
        'v_title':title,
        'v_content':content,
        'v_state':state,
        'v_type':type,
        'v_join_cnt':joinCnt,
        'v_voted_cnt':votedCnt,
        'v_writer':writter
    };

    var connection = DB_handler.connectDB();

    connection.query('insert into t_vote set ?',vote,function(err,row){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }
        var pid = row.insertId;
        var voteItems = new Array(itemCnt);

        for(var i=0; i<itemCnt; i++){
            var vi_title = itemsArr[i];
            var vi_cnt = 0;
            voteItems[i] = [0, pid, vi_title, vi_cnt];
        }

        connection.query('insert into t_vote_item(vi_id, vi_pid, vi_title, vi_cnt) values ?', [voteItems], function(err,row){
            if (err) {
                console.error(err);
                DB_handler.disconnectDB(connection);
                return res.json({status:'101'});
            }

            DB_handler.disconnectDB(connection);
            return res.json({status:'0'});
        });
    });
});

/**
 * getVoteList
 * 투표 리스트 가져오기 메소드
 * @param type  (투표완료:0, 투표중:1 투표삭제:2)
 * @return vList
 */

router.post('/getVoteList', util.ensureAuthenticated, function(req, res, next) {

    var type = req.body.Type;

    var connection = DB_handler.connectDB();

    var query = 'select a.*, b.u_name from t_vote a INNER JOIN t_user b ON a.v_writer = b.u_id';

    if(type == 1){
        query += ' where v_state = 1';
    }else if(type == 0){
        query += ' where v_state = 0';
    }

    query += ' ORDER BY v_write_date';
    connection.query(query, function(err,row){
        if (err) {
            console.error(err);
            return res.json({status:'101'});
        }
        else{
            var rows = JSON.stringify(row);
            return res.json(JSON.parse(rows));
        }
        DB_handler.disconnectDB(connection);
    });
});


/**
 * getVoteInfo
 * 투표정보 가져오기 메소드
 * @param id
 * @return vInfos
 */

router.post('/getVoteInfo', util.ensureAuthenticated, function(req, res, next) {
    var id = req.body.id;

    var connection = DB_handler.connectDB();

    var query = 'select * from t_vote_item where vi_pid = '+id+' ORDER BY vi_id DESC';

    connection.query(query, function(err,data){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }
        else{
            var rows = JSON.stringify(data);
            return res.json(JSON.parse(rows));
        }
    });
});


/**
 * deleteVote
 * 투표정보 삭제 메소드
 * @param id
 * @return result
 */

router.post('/deleteVote', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.id;
    console.log(id);
    var connection = DB_handler.connectDB();
    var query = 'update t_vote set v_state = 2 where v_id = "'+id+'"';

    connection.query(query, function(err,data){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        return res.json({status:'0'});
    });
});


/**
 * selectVote
 * 투표 메소드
 * @param voteId
 * @param itemIds
 * @return result
 */

router.post('/selectVote', util.ensureAuthenticated, function(req, res, next) {

    var vId = req.body.voteId;
    var iIds = req.body.itemIds;
    var uId = util.getUserId(req);

    var itemCnt = iIds.length;
    var voteItems = new Array(iIds.length);

    for( var i=0 ; i<itemCnt ; i++ ){
        voteItems[i] = [0, iIds, uId];
    }

    var connection = DB_handler.connectDB();

    connection.query('insert into t_vote_user(vu_id, vu_pid, vu_voter) values ?', voteItems, function(err,data){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(connection);
            return res.json({status:'101'});
        }

        var query = 'update t_vote set v_voted_cnt = v_voted_cnt+1 where v_id = '+vId+';';

        for( var j=0 ; j<itemCnt ; j++ ){
            query = 'update t_vote_item set vi_cnt = vi_cnt+1 where vi_id = '+iIds[i]+';';
        }

        connection.query(query, function(err,data2){
            if (err) {
                console.error(err);
                DB_handler.disconnectDB(connection);
                return res.json({status:'101'});
            }

            return res.json({status:'0'});
        });
    });
});


/**
 * getVoteUserList
 * 투표 항목별 유저 리스트 가져오기 메소드
 * @param itemId
 * @return voteUserList
 */

router.post('/getVoteUserList', util.ensureAuthenticated, function(req, res, next) {

    var id = req.body.itemId;

    var connection = DB_handler.connectDB();

    var query = 'select a.*, b.u_name from t_vote_user a INNER JOIN t_user b ON a.vu_voter = b.u_id where vu_pid = '+id+' ORDER BY b.u_name';

    connection.query(query, function(err,row){
        if (err) {
            console.error(err);
            return res.json({status:'101'});
        }
        else{
            var rows = JSON.stringify(row);
            return res.json(JSON.parse(rows));
        }
    });
});

module.exports = router;