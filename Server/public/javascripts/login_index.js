/**
 * Created by KIMDONGWON on 2016-01-24.
 */

toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-bottom-center',
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

$('#loginButton').click(function(){
    var id = $('#login_id').val();
    var password = $('#login_password').val();
    $.ajax({
        url: '/',
        type: 'post',
        data : {id:id,password:password},
        success: function(response){
            if(response.state == 404){
                toastr['error']('ID 혹은 PASSWORD 확인바랍니다');
            }
            else if(response.state == 104){
                toastr['warning']('가입승인 대기중입니다');
            }
            else if(response.state == 105){
                toastr['info']('수료회원은 이용할수 없습니다');
            }
            else{
                location.reload();
            }
        }
    });
});

$('#login_id').keypress(function(event) {
    if (event.keyCode == 13){
        $('#loginButton').click();
    }
});

$('#login_password').keypress(function(event) {
    if (event.keyCode == 13){
        $('#loginButton').click();
    }
});