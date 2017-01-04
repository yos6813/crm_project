function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var modifyPageno = getParameterByName('no');

$(document).ready(function(){
	firebase.database().ref('user-infos/' + modifyPageno).on('child_added', function(snapshot){
		firebase.database().ref('user-infos/' + modifyPageno + '/' + snapshot.key).on('value', function(snapshot1){
			$('#modifyprofileImg').attr('src', snapshot1.val().picture); 
			$('#modifyUsername').val(snapshot1.val().username);
			$('#emailInput').val(snapshot1.val().email);
			$('#departmentInputMo').val(snapshot1.val().department);
			$('#jobInputMo').val(snapshot1.val().job);
			$('#extensionMo').val(snapshot1.val().extension);
			$('#callMo').val(snapshot1.val().call);
			$('#phoneMo').val(snapshot1.val().phone);
			$('#emergencyMo').val(snapshot1.val().emergency);
			$('#sample6_address').val(snapshot1.val().address);
			$('#nicknameMo').val(snapshot1.val().nickname);
			$('#birthMo').val(snapshot1.val().birth);
			
			var join = snapshot1.val().join;
			var joinsplit = join.split('/');
			
			var join1 = joinsplit[0];
			var join2 = joinsplit[1];
			var join3 = joinsplit[2];
			
			$('#joinDate').val(join3 + '-' + join1 + '-' + join2);
		})
	})
})

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

			firebase.database().ref("departments/").orderByKey().on("child_added", function(snapshot){
				snapshot.forEach(function(data){
					$('#departmentMo').append('<li><a value="' + data.val() + '">' + data.val()
							+ '</a></li>');
				})
				$('#departmentMo a').on('click', function(){
					$('#departmentInputMo').val($(this).attr('value'));
				})
			})
			
			/* 직책 */
			firebase.database().ref("jobs/").orderByKey().on("child_added", function(snapshot){
				snapshot.forEach(function(data){
					$('#jobMo').append('<li><a value="' + data.val() + '">' + data.val()
							+ '</a></li>');
				})
				$('#jobMo a').on('click', function(){
					$('#jobInputMo').val($(this).attr('value'));
				})
			})
			
/* add User */

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

$('#modifyBtn').click(function(){
	firebase.database().ref('user-infos/' + modifyPageno).on('child_added', function(snapshot){
		firebase.database().ref('user-infos/' + modifyPageno + '/' + snapshot.key).update({
			nickname: $('#nicknameMo').val(),
			department: $('#departmentInputMo').val(),
			job: $('#jobInputMo').val(),
			extension: $('#extensionMo').val(),
			phone: $('#phoneMo').val(),
			call: $('#callMo').val(),
			emergency: $('#emergencyMo').val(),
			address: $('#sample6_address').val() + ' ' + $('#sample6_address2').val()
		})
	})
	
	window.location.hash="/index/userList"
});
