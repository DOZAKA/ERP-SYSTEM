'use strict';
var btn = $('#sign_up_button');
var inputId = $('#sign_up_id');
var inputPw = $('#sign_up_password');
var inputPwConfirm = $('#sign_up_password_confirm');
var inputName = $('#sign_up_name');
var inputBirth = $('#sign_up_birth');
var inputPeriod = $('#sign_up_period');
var inputPhone = $('#sign_up_phone');
var inputMail = $('#sign_up_mail');
var inputImg = $('#sign_up_img');

/* @regex */
var idReg= /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
var periodReg = /^[0-9]{2}(\-)[1-2]{1}$/;
var phoneReg = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;
var birthReg =   /^(\d{2})(\d{2})(\d{2})$/;
var emailReg =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
var pattern = new RegExp(' ');
/* regex@ */

/* @message */
var idErr='ID의 길이가 짧습니다<br>';
var idKoErr='ID는 영어만 사용하세요<br>';
var idSpaceErr='ID에 빈칸은 불필요합니다<br>';
var pwErr='Password 길이가 짧습니다<br>';
var pwDiff='Password가 다릅니다<br>';
var nameErr='이름이 중복됩니다<br>';
var birthErr='생년월일 형식을 지켜주세요<br>';
var periodErr='기수 형식을 지켜주세요<br>';
var phoneErr='전화번호 형식을 지켜주세요<br>';
var emailErr='E-mail 형식을 지켜주세요<br>';
var imgErr='사진을 넣으세요<br>';
/* message@ */

/* @toast */
var result ='';
/* toast@ */

var btn_male = $('#sign_up_male');
var btn_female = $('#sign_up_female');

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

$(document).ready(function(){
    btn_male.on('click',function(){
        var male=$('#sex_male');
        var female=$('#sex_female');
        male.checked = true;
        female.checked = false;
        btn_male.css('backgroundColor','#1E2858');
        btn_female.css('backgroundColor','#dfdfdf');
        btn_male.css('color','#fff');
        btn_female.css('color','black');
    });

    btn_female.on('click',function(){
        var male=$('#sex_male');
        var female=$('#sex_female');
        female.checked = true;
        male.checked = false;
        btn_female.css('backgroundColor','#1E2858');
        btn_male.css('backgroundColor','#dfdfdf');
        btn_female.css('color','#fff');
        btn_male.css('color','black');
    });

    $('input[type=file]').change(function(e) {
        var fn = $(this);
        if(fn.val() != ''){
            var fileName = fn.val().split( '\\' ).pop();
            $('label[id = sign_up_img_label]').text(fileName);
        }
        else{
            $('label[id = sign_up_img_label]').text('사진 선택');
        }
    });

    $('#form').submit(function(){
        /* @init */
        var id = inputId.val();
        var pw = inputPw.val();
        var confirm = inputPwConfirm.val();
        var name = inputName.val();
        var birth = inputBirth.val();
        var period = inputPeriod.val();
        var phone = inputPhone.val();
        var email = inputMail.val();
        var img = inputImg.val();
        result ='';
        var signup_success = true;
        /* init @ */

        /* @id check */
        if(id.length < 4){
            signup_success = false;
            result += idErr;
        }
        else if(idReg.test(id)){
            signup_success = false;
            result += idKoErr;
        }
        else if(pattern.test(id)){
            signup_success = false;
            result += idSpaceErr;
        }
        /* id check@ */

        /* @password check */
        if(pw.length < 4){
            signup_success = false;
            result += pwErr;
        }
        else if(pw != confirm){
            signup_success = false;
            result += pwDiff;
        }
        /* password check@ */

        /* @name check */
        /*if(){ db check
            result += nameErr;
        }*/
        /* name check@ */

        /* @birth check */
        if(!birthReg.test(birth)){
            signup_success = false;
            result += birthErr;
        }
        /* birth check@ */

        /* @period check */
        if(!periodReg.test(period)){
            signup_success = false;
            result += periodErr;
        }
        /* period check@ */

        /* @phone check */
        if(!phoneReg.test(phone)){
            signup_success = false;
            result += phoneErr;
        }
        /* phone check@ */

        /* @email check */
        if(!emailReg.test(email)){
            signup_success = false;
            result += emailErr;
        }
        /* email check@ */

        /* @image check */
        if(img == ''){
            signup_success = false;
            result += imgErr;
        }
        /* image check@ */

        /* @can submit? */
        if(signup_success){
            signup_success = true;
        }
        else{
            toastr['info'](result);
            signup_success = false;
        }
        /* can submit?@ */
            return signup_success;
    });
});
