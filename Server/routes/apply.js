/**
 * Created by KIMDONGWON on 2015-12-07.
 */
var express = require('express');
var DB_handler = require('./DB_handler');
var apply_newbook_handler = require('./apply_newbook_handler');

var router = express.Router();
var util = require('./util');

var APPLY_TYPE_ROOM = 1;
var APPLY_TYPE_SERVER = 2;
var APPLY_TYPE_EQUIPMENT = 3;

/* @book */
router.get('/newbook', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_newbook', { title: '도서 신청', grade: util.getUserGrade(req)});
});

router.post('/newbook/request', util.ensureAuthenticated, function(req, res){
    apply_newbook_handler.request(req, res);   // { 책의 내용들 } 형태
});

router.post('/newbook/loadMyapply', util.ensureAuthenticated, function(req, res){
    apply_newbook_handler.loadMyapply(req, res);   // id 만 딱 전송
});

router.post('/newbook/deleteMyapply', util.ensureAuthenticated,  function(req, res){
    apply_newbook_handler.deleteMyapply(req, res);   // { b_isbn : 숫자 } 형태
});

router.post('/newbook/checkDuplication', function(req, res){
    apply_newbook_handler.checkDuplication(req, res);
});
/* book@ */

/* apply push */
/* @room */

function ApplyPush(rows,title,content,res){
    var manager = JSON.parse(JSON.stringify(rows));
    if(manager.length == 1){
        util.send(manager[0].u_id,title,content, function(err,data) {
            if (err) {
                console.log(err);
                return res.json({status:'fail'});
            } else {
                return res.json({status:'success'});
            }
        });
    }
    else{
        var Managers = [];
        for(var i=0;i<Seminar.length;i++){
            Managers.push(Seminar[i].u_id);
        }
        console.log(Managers);
        util.sendList(Managers,title,content, function(err,data) {
            if (err) {
                console.log(err);
                return res.json({status:'fail'});
            } else {
                return res.json({status:'success'});
            }
        });
    }
}

router.get('/room', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select * from t_apply where a_apply_type = '+APPLY_TYPE_ROOM+' and a_due_date > "'+ util.getCurDate() +'" Order by a_write_date';
    var con = DB_handler.connectDB();
    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.render('error',{title:'잘못된 접근'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.render('apply_room_server_equip', {title: '프로젝트실 신청', grade: util.getUserGrade(req), lists: JSON.parse(send)});
        }
    });
});
//router.post('/room', util.ensureAuthenticated, function(req, res, next) {
//    var title ='SWSSM NOTICE';
//    var userName = util.getUserName(req);
//    var content = '[알림]'+userName+'님이 프로젝트실신청을 하였습니다.';
//    var query = 'select u_id from t_user where u_state = 6';
//    var con = DB_handler.connectDB();
//    con.query(query,function(err,rows){
//        if(err){
//            console.error(err);
//            DB_handler.disconnectDB(con);
//            return res.json({status:'fail'});
//        }
//        else{
//            ApplyPush(rows,title,content,res);
//            DB_handler.disconnectDB(con);
//        }
//    });
//});
/* room@ */

/* @server */
router.get('/server', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select * from t_apply where a_apply_type = '+APPLY_TYPE_SERVER+' and a_due_date > "'+ util.getCurDate() +'" Order by a_write_date';
    var con = DB_handler.connectDB();
    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.render('error',{title:'잘못된 접근'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.render('apply_room_server_equip', {title: '서버 신청', grade: util.getUserGrade(req), lists: JSON.parse(send)});
        }
    });
});

//router.post('/server', util.ensureAuthenticated, function(req, res, next) {
//    var title ='SWSSM NOTICE';
//    var userName = util.getUserName(req);
//    var content = '[알림]'+userName+'님이 서버신청을 하였습니다.';
//    var query = 'select u_id from t_user where u_state = 8';
//    var con = DB_handler.connectDB();
//    con.query(query,function(err,rows){
//        if (err) {
//            console.error(err);
//            DB_handler.disconnectDB(con);
//            return res.json({status:'fail'});
//        }
//        else{
//            ApplyPush(rows,title,content,res);
//            DB_handler.disconnectDB(con);
//        }
//    });
//});
/* server@ */

/* @equipment */
router.get('/equipment', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select * from t_apply where a_apply_type = '+APPLY_TYPE_EQUIPMENT+' and a_due_date > "'+ util.getCurDate() +'" Order by a_write_date';
    var con = DB_handler.connectDB();
    con.query(query, function(err,rows){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.render('error',{title:'잘못된 접근'});
        }
        else{
            var send = JSON.stringify(rows);
            DB_handler.disconnectDB(con);
            return res.render('apply_room_server_equip', {title: '비품 신청', grade: util.getUserGrade(req), lists: JSON.parse(send)});
        }
    });
});
//router.post('/equipment', util.ensureAuthenticated, function(req, res, next) {
//    var title ='SWSSM NOTICE';
//    var userName = util.getUserName(req);
//    var content = '[알림]'+userName+'님이 비품신청을 하였습니다.';
//    var query = 'select u_id from t_user where u_state = 5';
//    var con = DB_handler.connectDB();
//    con.query(query,function(err,rows){
//        if (err) {
//            console.error(err);
//            DB_handler.disconnectDB(con);
//            return res.json({status:'fail'});
//        }
//        else{
//            ApplyPush(rows,title,content,res);
//            DB_handler.disconnectDB(con);
//        }
//    });
//});
/* equipment@ */

/* @hardware */
router.get('/hardware', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_hardware', {title: '하드웨어 신청', grade: util.getUserGrade(req)});
});

router.post('/hardware', util.ensureAuthenticated, function(req, res, next) {
    var query = '';
    var datalist = req.body;
    for(var i = 0; i < datalist.length; i++){
        query += 'insert into t_hardware_apply set ha_project_title="' + datalist[i].projectName + '", ha_requester="' + req.session.passport.user.id + '", ha_role="' + datalist[i].use + '", ha_upper_category="' + datalist[i].type + '", ha_lower_category="' + datalist[i].label + '", ha_item_name="' + datalist[i].name + '", ha_size="' + datalist[i].ea + '", ha_amount="' + datalist[i].count + '", ha_maker="' + datalist[i].maker + '", ha_link="' + datalist[i].link + '";';
    }
    var con = DB_handler.connectDB();
    con.query(query, function(err, response){
        if(err){
            console.log(err);
            DB_handler.disconnectDB(con);
            return res.send('failed');
        }
        else{
            DB_handler.disconnectDB(con);
            return res.send('success');
        }
    })
});

/* hardware@ */

router.get('/room/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_manage',{title:'프로젝트실 신청관리', grade: util.getUserGrade(req)});
});

router.get('/server/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_manage',{title:'서버 신청 관리', grade: util.getUserGrade(req)});
});

router.get('/equipment/manage', util.ensureAuthenticated, function(req, res, next) {
    res.render('apply_manage',{title:'비품 신청 관리', grade: util.getUserGrade(req)});
});

router.post('/setApplyList/:type', util.ensureAuthenticated, function(req, res, next) {
    var arr = req.body;
    var arrLength = arr.length;
    var values = new Array();
    var currentTime = new Date();
    for(var i=0; i<arrLength; i++){
        var obj = arr[i];
        var a_id = 0;
        var a_apply_type = req.params.type;
        var a_title = obj.Content;
        var a_weblink = obj.Link;
        var a_write_date = currentTime.getFullYear() + "/" + (currentTime.getMonth() +1) + "/" + currentTime.getDate() + " " + currentTime.getHours() +":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
        var a_date = obj.Date;
        var a_due_date = obj.Due;
        var a_writer = util.getUserId(req);
        values[i] = [a_id, a_apply_type, a_title, a_weblink, a_date,a_due_date,a_write_date, a_writer];
    }
    var con = DB_handler.connectDB();
    con.query('insert into t_apply(a_id, a_apply_type, a_title, a_weblink, a_date,a_due_date,a_write_date, a_writer) values ?', [values], function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            return res.json({status:'0'});
        }
    });
});

router.get('/getApplyList/:type', util.ensureAuthenticated, function(req, res, next) {
    var query = 'select * from t_apply where a_writer = "'+util.getUserId(req)+'" and a_apply_type = "'+ req.params.type+'"';
    var con = DB_handler.connectDB();
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'fail'});
        }
        else{
            var send = JSON.stringify(result);
            DB_handler.disconnectDB(con);
            return res.json({list:JSON.parse(send)});
        }
    });
});

router.post('/edit/:type', util.ensureAuthenticated, function(req, res, next) {
    var arr = req.body;
    var currentTime = new Date();
    var id = arr.Id;
    var a_apply_type = req.params.type;
    var a_title = arr.Content;
    var a_weblink = arr.Link;
    var a_write_date = currentTime.getFullYear() + "/" + (currentTime.getMonth() +1) + "/" + currentTime.getDate() + " " + currentTime.getHours() +":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
    var a_date = arr.Date;
    var a_due_date = arr.Due;
    var a_writer = util.getUserId(req);

    var query = 'update t_apply set a_title="'+a_title+'",a_weblink="'+a_weblink+'",a_write_date="'+a_write_date+'",a_date="'+a_date+'",a_due_date="'+a_due_date+'" where a_writer="'+a_writer+'" and a_apply_type="'+a_apply_type+'" and a_id="'+id+'"';
    var con = DB_handler.connectDB();
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            return res.json({status:'0'});
        }
    });
});

router.post('/delete/:type', util.ensureAuthenticated, function(req, res, next) {
    var query = 'delete from t_apply where a_id='+req.body.delete_id+' and a_apply_type = '+req.params.type;
    var con = DB_handler.connectDB();
    con.query(query, function(err,result){
        if (err) {
            console.error(err);
            DB_handler.disconnectDB(con);
            return res.json({status:'101'});
        }
        else{
            DB_handler.disconnectDB(con);
            return res.json({status:'0'});
        }
    });
});

module.exports = router;