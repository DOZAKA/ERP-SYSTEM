/**
 * Created by HyunJae on 2016. 1. 2..
 */


var currentDate = new Date();

var selected_days = [];
var duty_count = null;
var bad_duty_count = null;
var year = currentDate.getFullYear;
var month = currentDate.getMonth()+1;
$(document).ready(function() {

    $('#calendar').fullCalendar({
        dayClick: day_click,
        defaultDate : currentDate,
        header: false
    })

});



$('.datepicker').datepicker({
    format: "yyyy년 m월",
    minViewMode: 1,
    defaultDate : currentDate,
    keyboardNavigation : false,
    todayHighlight: true,
    startView: 1,
    endDate: '+50d',
    autoclose: true
});

$('.datepicker').on('changeDate',function(event){
    year = event.date.getFullYear();
    month = event.date.getMonth() + 1;
    selected_days = [];
    $("#selected_days").html(""+selected_days.length);
    $("#calendar").fullCalendar( 'gotoDate' , new Date(year,month-1,1) );

});


$("#setting").click(function (){

    var falg = 1;

    $.post("/duty/updateMemberPoint", function(res){
        if(res != 'success'){
            flag = 0;
        }
    });

    var sendData = {};
    sendData.selected_days = selected_days;
    sendData.duty_count = duty_count;
    sendData.bad_duty_count = bad_duty_count;
    sendData.year = year;
    sendData.month = month;

    $.post("/duty/autoMakeDuty", sendData, function(res){



    });

});


$('#duty_count li a').click(function(){
    duty_count = $(this).parent().index()+1;
    $('#duty_button').html(duty_count +"");
    isSelected();
});

$('#bad_duty_count li a').click(function(){
    bad_duty_count = $(this).parent().index()+1;
    $('#bad_duty_button').html(bad_duty_count+"");
    isSelected();
});



function isSelected(){
    if(duty_count !=null && bad_duty_count!=null){
        $("#setting").removeClass("hidden");
    }
}

function day_click(date) {
    var flag = 1;
    for(var i=0 ; i<selected_days.length; i++){
        if(selected_days[i] == date.format()){
            flag = 0;
            selected_days.splice(i,1);
            $("#selected_days").html(""+selected_days.length);
            $(this).css('background-color', 'white');
        }
    }
    if(flag){
        selected_days.push(date.format());
        $("#selected_days").html(""+selected_days.length);
        // change the day's background color just for fun
        $(this).css('background-color', '#00bcd4');
    }
}