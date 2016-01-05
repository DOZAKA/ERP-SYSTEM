/**
 * Created by jung-inchul on 2016. 1. 1..
 */

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

loadmyHardware();
loadmyBook();
loadMyDuty();
loadTodayDuty();
hasToken();
// 오늘의 당직자 부르고 - 현재파트

function loadTodayDuty(){

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var date = date.getDate();

    var html = year+"."+month+"."+date;

    $('#today').html(html);

    $.post('/duty/loadTodayDuty' , function(response){
        // type , month , date ,year
        console.log(response);
        var htmlString = '';
        var data = response;
        console.log(data);

        if(data.name1!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name1 +
            '</label>';
        }
        if(data.name2!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name2 +
                '</label>';
        }
        if(data.name3!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name3 +
                '</label>';
        }
        if(data.name4!= null){
            flag=0;
            htmlString += '<p><label style="text-overflow: ellipsis;">'
                + data.name4 +
                '</label>';
        }

        if(data === "no data"){
            console.log("ddd");
            htmlString = '<p><label style="text-overflow: ellipsis;">'
                + '오늘의 당직이 없습니다.' +
                '</label>';
            console.log(htmlString);
        }

        $('#content-today_duty').html(htmlString);


    });
}


// 나의 마일리지 부르고 - 보류

// 나의 당직일 부르고 - 현재파트

function loadMyDuty(){

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth()+1;
    var date = currentDate.getDate();


    $.post('/duty/loadMyDuty',{month : month , year : year} , function(response){
        // type , month , date ,year
        var htmlString = '';
        var type = "";
        $.each(response, function(idx, data){


            var diff =  date - data.date;

            if(data.type == 0){
                type = "일반당직";
            }else if(data.type == 1){
                type = "벌당직";
            }

            htmlString += '<p><label style="text-overflow: ellipsis;">'+ data.month + '월 ' + data.date + '일 ' + type + '</label>';


            if(diff <= -7){
                htmlString += '  <span class="label label-default">D' + diff + '</span>';
            }else if(diff < 0){
                htmlString += '  <span class="label label-warning">D' + diff + '</span>';
            }else{
                htmlString += '  <span class="label label-danger">D+' + diff + '</span>';
            }
        });

        if(response.length==0){
            htmlString = "<p style='text-overflow: ellipsis;'> 이번달 당직이 없습니다. </p>"
        }

        $('.content-my_duty').html(htmlString);


    });
}

// 나의 하드웨어 대여 현황 부르고 - 인철파트
function loadmyHardware(){
    $.post('/main/loadmyHardware', function(datalist){
        var myhardwareHTML = settingHTML(datalist, 'hardware');;
        $('.content-myhardware').html(myhardwareHTML);
    });
}

// 도서 대여 현황 부르고 - 인철파트
function loadmyBook(){
    $.post('/main/loadmyBook', function(datalist){
        var mybookHTML = settingHTML(datalist, 'book');
        $('.content-mybook').html(mybookHTML);
    });
}

function settingHTML(datalist, flag){
    var htmlString = '';
    if(datalist.length === 0){
        if(flag === 'book') htmlString += '<p> 대여중인 도서가 없습니다. </p>';
        else htmlString += '<p> 대여중인 하드웨어가 없습니다.'
    }else{
        $.each(datalist, function(idx, data){
            htmlString += '<p><label style="text-overflow: ellipsis;">' + data.name + '</label>';
            var diff = parseInt(data.diff);

            if(diff <= -7){
                htmlString += '  <span class="label label-default">D' + data.diff + '</span>';
            }else if(diff < 0){
                htmlString += '  <span class="label label-warning">D' + data.diff + '</span>';
            }else{
                htmlString += '  <span class="label label-danger">D+' + data.diff + '</span>';
            }
        });
    }

    return htmlString;
}




function hasToken(){
    $.post('/main/hasToken', function(response){

        console.log(response);

        if(response =="true"){
            window.Android.getToken();
        }
        else if(response == "error"){
            toastr['error']('디비 접근 에러.');

        }
        else if(response == "fail"){
            toastr['error']('토큰이 존재하지 않습니다');

        }
        else{
            toastr['error']('에러!!');

        }
    });
}

function getToken(token){
    $.post('/main/getToken',{ token : token, deviceName : "samsung"} , function(response){


        if(response=="success"){
            toastr['success']('기기 등록 완료');
        }else{
            toastr['error']('에러!!');
        }
    });
}


