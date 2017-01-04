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
            document.getElementById('sample6_address').value = fullAddr;

            // 커서를 상세주소 필드로 이동한다.
            document.getElementById('sample6_address2').focus();
        }
    }).open();
}

function addClient(clientLicense, companyName, clientEmail, password, clientName, clientAddress, clientPosition,
				   clientJob, clientDepartment, clientWorkPhone, clientPhone, clientExtension, clientFax){
	var clientData = {
		clientLicense: clientLicense,
		companyName: companyName,
		clientEmail: clientEmail,
		password: password,
		clientName: clientName,
		clientAddress: clientAddress,
		clientPosition: clientPosition,
		clientJob: clientJob,
		clientDepartment: clientDepartment,
		clientWorkPhone: clientWorkPhone,
		clientPhone: clientPhone,
		clientExtension: clientExtension,
		clientFax: clientFax
	};
	
	var newClientKey = firebase.database().ref().child('clients').push().key;
	
	var updates = {};
	updates['/clients/' + newClientKey] = clientData;
	
	return firebase.database().ref().update(updates);
}

$(document).ready(function(){
	console.log('왜 안돼');
	$('#companyName').hideseek({hidden_mode: true});
	firebase.database().ref('company/').orderByKey().on('child_added', function(snapshot){
		$('.companyList').append('<li class="list-item" style="display:none;"><a value="' + snapshot.key + '">' +
												snapshot.val().name + '(' + snapshot.val().license + ')' + '</a></li>');
	})		
})

$('#clientRegister').click(function(){
	var clientLicense = $('#clientCorporate').val();
	var companyName = $('#companyName').val();
	var clientEmail = $('#clientEmail').val();
	var password = $('#pw').val();
	var clientName = $('#clientName').val();
	var clientAddress = $('#sample6_address').val() + ' ' + $('#sample6_address2').val();
	var clientPosition = $('#cPosition').val();
	var clientJob = $('#cJob').val();
	var clientDepartment = $('#cDepartment').val();
	var clientWorkPhone = $('#clientCall').val();
	var clientPhone = $('#clientPhone').val();
	var clientExtension = $('#clientExtension').val();
	var clientFax = $('#clientFax').val();
	
	addClient(clientLicense, companyName, clientEmail, password, clientName, clientAddress, clientPosition,
			   clientJob, clientDepartment, clientWorkPhone, clientPhone, clientExtension, clientFax);
			   location.hash = '#/clientLogin';
})