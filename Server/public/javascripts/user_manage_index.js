/**
 * Created by KIMDONGWON on 2015-12-29.
 */
toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

var degree = ['','운영자','회장','총무','자재부장','생활장','세미나장','문화장','네트워크장','교육장'];
var COMMAND_DEGREE = 9;
degree[100] = '정회원';
degree[101] = '준회원';
degree[102] = '수료예정';
degree[103] = '비활성화';
degree[104] = '가입대기';
degree[105] = '수료회원';
getMemberList();

function getMemberList(){
    var periodNum = '';
    var tbodyString = '';

    var send = {
        type:'command'
    };

    $.ajax({
        type:'post',
        url:'/user/userlist',
        data:JSON.stringify(send),
        contentType:'application/json',
        success: function(data){
            if(data.status == 'fail') {
                toastr['error']('회원 목록 로딩 실패');
            }
            else {
                tbodyString += '<tr>';
                var periodCnt = 0;
                for (var i = 0; i < data.length; i++) {
                    var user = data[i];
                    if (periodCnt % 5 == 0 && i != 0) {
                        tbodyString += '</tr><tr>';
                    }
                    if (periodNum != user.u_period) {
                        tbodyString += '</tr><th colspan="5">' + user.u_period + '</th></tr><tr>';
                        periodNum = user.u_period;
                        periodCnt = 0;
                    }
                    var classString = 'table-clickable';
                    if (user.u_state <= COMMAND_DEGREE) classString += ' text-command';
                    if (user.u_state == 104 || user.u_state == 102) classString += ' text-disable';
                    if (user.u_state == 103) classString += ' text-wait';
                    //console.log(user.u_photo_url);
                    tbodyString += '<td id="' + user.u_id + '" class="' + classString + '">' + user.u_name + '</td>';
                    periodCnt++;
                }
                var remain = periodCnt % 5;
                if (remain > 0) {
                    for (i = remain; i < 5; i++) {
                        tbodyString += '<td></td>';
                    }
                }

                tbodyString += '</tr>';
                $('#memberList tbody').empty();
                $('#memberList tbody').append(tbodyString);
            }
        }
    });
}

$('#memberList').on('click','td',function(){
    var send = {
        u_id:$(this).attr('id')
    };
    $.ajax({
        type:'post',
        url:'/user/memberinfo',
        data:JSON.stringify(send),
        contentType:'application/json',
        success: function(data){
            if(data.status == 'fail'){
                toastr['error']('회원 정보 읽기 실패');
            }
            else {
                console.log(data);
                $('div.modal #id').html(data[0].u_id);
                $('div.modal #name').html(data[0].u_name);
                $('div.modal #period').html(data[0].u_period);
                $('div.modal #phone').html(data[0].u_phone);
                $('div.modal #mail').html(data[0].u_email);
                $('div.modal #type').html(degree[data[0].u_state]);
                $('div.modal #selectAdmin').html('계정 전환');
                document.getElementById('type').setAttribute('origin', data[0].u_state);
                document.getElementById('profile').setAttribute('src', 'http://www.swmem.org/image?name=' + data[0].u_photo_url);
                //document.getElementById('profile').setAttribute('src','http://www.swmem.org/image?name='+data[0].u_photo_url);
                document.getElementById('selectAdmin').setAttribute('number', 0);
                $('div.modal').modal();
            }
        }
    });
});

$('#reset').unbind().click(function(){
    var u_id = $('div.modal #id').html();
    var send = {
        u_id:u_id
    };
    $.ajax({
        type:'post',
        url:'/user/reset',
        data: JSON.stringify(send),
        contentType:'application/json',
        success: function(data) {
            if (data.status == '0') {
                toastr['success']('비밀번호 초기화');
            }
            else{
                toastr['error']('비밀번호 초기화 실패');
            }
        }
    });
});

$('ul#toggleAdmin li').unbind().click(function(){
    var index = $(this).attr('id');
    selectedadmin = index.substring(4);
    $('#selectAdmin').text(degree[selectedadmin] + '(으)로 전환');
    document.getElementById('selectAdmin').setAttribute('number',selectedadmin);
});

$('#save').unbind().click(function(){
    var setDegree =  document.getElementById('selectAdmin').getAttribute('number');
    var originDegree = document.getElementById('type').getAttribute('origin');
    if(setDegree == 0){

    }
    else{
        var u_id = $('div.modal #id').html();
        var send = {
            grade:setDegree,
            u_id:u_id,
            origin_grade:originDegree
        };
        $.ajax({
            type:'post',
            url:'/user/updateUserGrade',
            data: JSON.stringify(send),
            contentType:'application/json',
            success: function(data) {
                if (data.status == '0') {
                    getMemberList();
                    $('div.modal').modal('hide');
                    toastr['success']('저장 완료');
                }
                else{
                    toastr['error']('저장 실패');
                }
            }
        })
    }
});