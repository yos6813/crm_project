firebase.auth().onAuthStateChanged(function(user) {
	$('#registerprofileImg').attr('src', user.photoUrl); 
	$('#registerUsername').val(user.displayName);
	$('#emailInput').val(user.email);
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

		/* 부서  */
		firebase.database().ref("departments/").orderByKey().endAt("department").on("child_added", function(snapshot){
			snapshot.forEach(function(data){
				$('#department1').append('<li><a value="' + data.val() + '">' + data.val()
						+ '</a></li>');
			})
			$('#department1 a').on('click', function(){
				$('#department').val($(this).attr('value'));
			})
		})
		
		/* 직책 */
		firebase.database().ref("jobs/").orderByKey().endAt("job").on("child_added", function(snapshot){
				snapshot.forEach(function(data){
					$('#job1').append('<li><a value="' + data.val() + '">' + data.val()
							+ '</a></li>');
			})
			$('#job1 a').on('click', function(){
				$('#job').val($(this).attr('value'));
			})
		})
		
		/* 생년월일 */
		var today = new Date();
		var toyear = parseInt(today.getFullYear());
		var start = toyear - 5;
		var end = toyear - 70;
		
		for(var i=toyear; i>=end; i--){
			$('#year').append('<li><a value="' + i + '">' + i + '</a></li>');
		}
		
		for(var i=1; i<=12; i++){
			$('#month').append('<li><a value="' + i + '">' + i + '</a></li>');
		}
		
		for(var i=1;i<=31;i++){
			$('#day').append('<li><a value="' + i + '">' + i + '</a></li>');
		}
		
		$('#year a').on('click', function(){
			$('#birth1').val($(this).attr('value'));
		})
		
		$('#month a').on('click', function(){
			$('#birth2').val($(this).attr('value'));
		})
		
		$('#day a').on('click', function(){
			$('#birth3').val($(this).attr('value'));
		})

/* add User */

function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}

/* Register Form */

function writeUserInfo(uid, userImg, username, email, nickname, department, job, extension, phone, call, emergency, address, join, birth){
	var infoData = {
		uid: uid,
		picture: userImg,
		username: username,
		email: email,
		nickname: nickname,
		department: department,
		job: job,
		extension: extension,
		phone: phone,
		call: call,
		emergency: emergency,
		address: address,
		join: join,
		birth: birth
	};
	
	var newInfoKey = firebase.database().ref().child('infos').push().key;
	
	var updates = {};
	updates['/infos/' + newInfoKey] = infoData;
	updates['/user-infos/' + uid + '/' + newInfoKey] = infoData;
	
	return firebase.database().ref().update(updates);
}

$('#registerBtn').click(function(){
	var user = firebase.auth().currentUser;
	writeUserData(user.uid, user.displayName, user.email, user.photoURL);
	
	var uid = firebase.auth().currentUser.uid;
	var userImg = firebase.auth().currentUser.photoURL;
	var username = $('#registerUsername').val();
	var email = $('#emailInput').val();
	var nickname = $('#nickname').val();
	var department = $('#department').val();
	var job = $('#job').val();
	var extension = $('#extension').val();
	var phone = $('#phone').val();
	var call = $('#call').val();
	var emergency = $('#emergency').val();
	var address = $('#sample6_address').val() + ' ' + $('#sample6_address2').val();
	var join = $('.join').val();
	var birth = $('#birth1').val() + '/' + $('#birth2').val() + '/' + $('#birth3').val();
	
	writeUserInfo(uid, userImg, username, email, nickname, department, job, extension, phone, call, emergency, address, join, birth);
	window.location.hash="/index/main"
});
