/**
 * Created by jung-inchul on 2015. 12. 17..
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

$('ul.nav-pills li').click(function(){
    var index = $(this).index();
    $('ul.nav-pills li').removeClass('active');
    $(this).addClass('active');
    loadRequest(index);
});

loadRequest(0);                 // 모든 것 통합본 때려버려, 형태도 0, 1, 2는 같고 3만 다르게.

function loadRequest(flag){
    if(flag != 3){
        $.post('/hardware/manage/loadRequest', {kind : flag}, function(datalist){
            setTable(datalist, flag);
            $('#tableData tr').click(function(){
                var index = $(this).index();
                if(datalist[index].hw_result != 0){
                    toastr['error']('처리된 건은 수정할 수 없습니다');
                }else{
                    $(this).toggleClass('warning');
                }
            });
            approveButton(datalist, flag);
            rejectButton(datalist, flag);
        });
    }else{
        $.post('/hardware/manage/loadApply', function(datalist){
            setTable(datalist, flag);
            detailButton(datalist);
            $('#tableData tr').click(function(){
                var index = $(this).index();
                if(datalist[index].ha_result === 0){
                    $(this).toggleClass('warning');
                    $('#temp').text(calSum(datalist) + '원');
                }else{
                    toastr['error']('처리된 건은 수정할 수 없습니다');
                }
            });
            approveButton(datalist, flag);
            rejectButton(datalist, flag);
        });
    }
}

function setTable(datalist, flag){                //  html 테이블 만들기
    var htmlString;
    if(flag != 3){
        htmlString = '<thead><tr><th>신청자</th><th>하드웨어 이름</th><th>신청일</th><th>처리상태</th></tr></thead>';
        htmlString += '<tfoot><tr><th colspan="4"><button type="button" id="approve" class="btn btn-primary">승인</button><button type="button" id="reject" class="btn btn-danger">미승인</button></th></tr></tfoot>';
        htmlString += '<tbody id="tableData">';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.u_name + '</td><td>' + data.h_name + '</td><td>' + data.hw_request_date + '</td><td>';
            switch(data.hw_result){
                case 0:
                    htmlString += '<span class="label label-warning"> 대기중 </span></td></tr>';
                    break;
                case 1:
                    htmlString += '<span class="label label-primary"> 승인 </span></td></tr>';
                    break;
                default:
                    htmlString += '<span class="label label-danger"> 미승인 </span></td></tr>';
            }
        });
        htmlString += '</tbody>';
    }else{
        htmlString = '<thead><tr><th>PL</th><th>프로젝트 이름</th><th>처리상태</th><th>자세히</th></tr></thead>';
        htmlString += '<tfoot><tr><th colspan="4"><button type="button" id="approve" class="btn btn-primary">승인</button><button type="button" id="reject" class="btn btn-danger">미승인</button><button type="button" id="down2excel" class="btn btn-info">엑셀로 다운</button><span id="temp" class="pull-right">0 원</span></th></tr></tfoot>';
        htmlString += '<tbody id="tableData">';
        $.each(datalist, function(idx, data){
            htmlString += '<tr><td>' + data.ha_pl_name + '</td><td>' + data.ha_project_title + '</td><td>';
            if(data.ha_result === 0) {
                htmlString += '<span class="label label-warning"> 대기중 </span></td>';
            }else {
                htmlString += '<span class="label label-primary"> 처리완료 </span></td>';
            }
            htmlString += '<td><button type="button" id="detail" class="btn btn-xs btn-info">More</button></td></tr>';
        });
        htmlString += '</tbody>';
    }
    $('#requestTable').html(htmlString);
}

function calSum(datalist){
    var sum = 0;
    $('#tableData tr').each(function(index){
        if($(this).hasClass('warning')){
            sum += datalist[index].ha_total;
        }
    });
    return sum;
}

function approveButton(datalist, flag){           // 승인 버튼
    $('button#approve').unbind().click(function(){
        var approveIdlist = '';
        var hardwareIdlist = '';
        var userIdlist = '';
        var rentalIdlist = '';

        if($('#tableData tr.warning').length === 0){
            toastr['error']('항목이 선택되지 않았습니다');
            return;
        }
        if(flag != 3){
            $('#tableData tr').each(function(index){
                if($(this).hasClass('warning')){
                    approveIdlist += datalist[index].hw_id + ',';
                    hardwareIdlist += datalist[index].hw_hardware_id + ',';
                    userIdlist += datalist[index].hw_user + ',';
                    rentalIdlist += datalist[index].hw_rental_id + ',';
                }
            });
            approveIdlist = approveIdlist.substring(0, approveIdlist.length -1);
            hardwareIdlist = hardwareIdlist.substring(0, hardwareIdlist.length -1);
            rentalIdlist = rentalIdlist.substring(0, rentalIdlist.length -1);
            userIdlist = userIdlist.substring(0, userIdlist -1);
        }else{
            $('#tableData tr').each(function(index){
                if($(this).hasClass('warning')){
                    approveIdlist += datalist[index].ha_id + ',';
                }
            });
            approveIdlist = approveIdlist.substring(0, approveIdlist.length -1);
        }
        console.log(approveIdlist);
        $.post('/hardware/manage/approveRequest', {type: flag, approveIdlist: approveIdlist, hardwareIdlist: hardwareIdlist, userIdlist: userIdlist, rentalIdlist: rentalIdlist}, function(response){
            if(response === 'success')   toastr['success']('승인처리 완료');
            else    toastr['error']('승인처리 실패');
        });
    });
}

function rejectButton(datalist, flag){            // 거절 버튼
    $('button#reject').unbind().click(function(){
        var rejectlist = '';

        if($('#tableData tr.success').length == 0){
            toastr['error']('항목이 선택되지 않았습니다');
            return;
        }
        $('#tableData tr').each(function(index){
            if($(this).hasClass('success')){
                rejectlist += datalist[index].hw_id + ',';
            }
        });
        rejectlist = rejectlist.substring(0, rejectlist.length-1);
        $.post('/hardware/manage/rejectRequest', {type: flag, rejectlist: rejectlist}, function(response){
            if(response === 'success')   toastr['success']('미승인처리 완료');
            else    toastr['error']('미승인처리 실패');
        });
    });
}

function detailButton(datalist){            // 자세히 보기 버튼
    $('button#detail').each(function(index){
        $(this).unbind().click(function(){
            var string = '<table class="table table-striped table-bordered">';
            string += '<tr class="warning"><th colspan="4">' + datalist[index].ha_item_name + '</th></tr>';
            string += '<tr><td colspan="4">' + datalist[index].ha_project_title + '</td></tr>';
            string += '<tr><td>Team</td><td colspan="2">' + datalist[index].ha_team_name + '</td><td><span class="label label-warning">PL : ' + datalist[index].ha_pl_name + '</span></td></tr>';
            string += '<tr><td>구분</td><td>' + datalist[index].ha_category + '</td><td>역할</td><td>' + datalist[index].ha_role + '</td></tr>';
            string += '<tr><td>규격</td><td>' + datalist[index].ha_size + '</td><td>연락처</td><td>' + datalist[index].ha_call + '</td></tr>';
            string += '<tr><td>제조업체</td><td>' + datalist[index].ha_manufactor + '</td><td>판매업체</td><td>' + datalist[index].ha_salesmall + '</td></tr>';
            string += '<tr><td>단가</td><td>' + datalist[index].ha_price + '</td><td>수량</td><td>' + datalist[index].ha_cnt + '</td></tr>';
            string += '<tr><td>규격</td><td>' + datalist[index].ha_size + '</td><td>총액</td><td>' + datalist[index].ha_total + '</td></tr>';
            string == '<tr><td></td>'
            string += '<tr><td colspan="4"><a href="' +datalist[index].ha_url + '" target="_blank" style="color:blue">URL 이동</a></td></tr>';
            $('div.modal-body').html(string);
            $('div.modal').modal();
        });
    });
}

function saveExcelButton(){         // 엑셀로 저장 버튼

}