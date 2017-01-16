function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var no = getParameterByName('no');

$('#officer_search').hideseek({hidden_mode: true});
firebase.database().ref('users/').orderByKey().on('child_added', function(snapshot1){
	$('.officer_searchList').append('<li class="list-item" style="display: none;"><a value="' + snapshot1.key + '">' + 
			snapshot1.val().username + '</a></li>');
})

/* 다음 주소 찾기 */
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var fullAddr = ''; // 최종 주소 변수
            var extraAddr = ''; // 조합형 주소 변수

            // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                fullAddr = data.roadAddress;

            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                fullAddr = data.jibunAddress;
            }

            // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
            if(data.userSelectedType === 'R'){
                //법정동명이 있을 경우 추가한다.
                if(data.bname !== ''){
                    extraAddr += data.bname;
                }
                // 건물명이 있을 경우 추가한다.
                if(data.buildingName !== ''){
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
                fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            document.getElementById('addr').value = fullAddr;

            // 커서를 상세주소 필드로 이동한다.
            document.getElementById('addr2').focus();
        }
    }).open();
}

/* 회사 등록 */

function addCompany(name, addr, corporate, yeta, academy, consulting, sap, cloud, onpremises){
	var companyData = {
		name: name,
		addr: addr,
//		license: license,
		corporate: corporate,
		yeta: yeta,
		academy: academy,
		consulting: consulting,
		sap: sap,
		cloud: cloud,
		onpremises: onpremises
	};
	
	var newCompanyKey = firebase.database().ref().child('company').push().key;
	
	var updates = {};
	updates['/company/' + newCompanyKey] = companyData;
	
	return firebase.database().ref().update(updates);
}

$(document).ready(function(){
//	$('input[name=yetacheck]').change(function(){
//	 if($(this).is(":checked")){
//		 $('.yetaList').append('<label class="col-sm-2 control-label">YETA 고객구분 <br/><small class="text-navy">복수 선택 가능</small></label>' +
//			 	   		       '<div class="i-checks"><label> <input class="checkBox1" type="checkbox" name="sapcheck" value="SAP"> <i></i> SAP </label></div>' +
//			 	   		       '<div class="i-checks"><label> <input class="checkBox1" type="checkbox" name="cloudcheck" value="cloud"> <i></i> Cloud </label></div>' +
//	           				   '<div class="i-checks"><label> <input class="checkBox1" type="checkbox" name="precheck" value="OnPremises"> <i></i> On Premises </label></div>');
//        }else{
//            $('.yetaList').children().remove();
//        }
//	})
	if(no != ''){
		firebase.database().ref('company/' + no).on('value', function(snapshot){
			$('#comName').val(snapshot.val().name);
			$('#addr').val(snapshot.val().addr);
			$('#licenseeNum').val(snapshot.val().license);
			
			if(snapshot.val().sap == '1'){
				$('.SAP').prop('checked', true)
			} if(snapshot.val().cloud == '1'){
				$('.cloud').prop('checked', true)
			} if(snapshot.val().onpremises == '1'){
				$('.OnPremises').prop('checked', true)
			}
		})
	}
})

function submitCompany(){
	var name = $('#comName').val();
	var addr = $('#addr').val() + ' ' + $("#addr2").val();
	var corporate = $('#licenseeNum').val();
//	var corporate = $('#corporateNum').val();
	var yeta = '1';
	var academy = '0';
	var consulting = '0';
	var sap = '0';
	var cloud = '0';
	var onpremises = '0';
	
//	if($('input[name="yetacheck"]').filter(':checked').val() != undefined){
//		yeta = '1';
		if($('.SAP').is(':checked')){
			sap = '1';
		} 
		if($('.cloud').is(':checked')){
			cloud = '1';
		} 
		if($('.OnPremises').is(':checked')){
			onpremises = '1';
		}
//	}
//	if($('input[name="academycheck"]').filter(':checked').val() != undefined){
//		academy = '1';
//	}
//	if($('input[name="consultingcheck"]').filter(':checked').val() != undefined){
//		consulting = '1';
//	} 
	
	if(no != ''){
		firebase.database().ref('company/' + no).update({
			name: name,
			addr: addr,
			corporate: corporate,
			yeta: yeta,
			sap: sap,
			cloud: cloud,
			onpremises: onpremises
		})
	} else {
		addCompany(name, addr, corporate, yeta, academy, consulting, sap, cloud, onpremises);
	}
	
	$('#comName').val('');
	$('#addr').val('');
	$('#addr2').val('');
	$('#licenseeNum').val('');
//	$('#corporateNum').val('');
	location.hash = '#/index/client_company_list';
}