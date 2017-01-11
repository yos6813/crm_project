function handleSignUp() {
  var clientEmail = $('#clientEmail').val();
  var password = $('#pw').val();
  
  firebase.auth().createUserWithEmailAndPassword(clientEmail, password).catch(function(error) {
	  if(error){
	      var errorCode = error.code;
	      var errorMessage = error.message;
	      if (errorCode == 'auth/email-already-in-use'){
	    	  $('#require1').text('이미 있는 이메일 입니다.');
	    	  $('#require1').show();
	      } else {
	    	  $('#require1').text(errorMessage);
	    	  $('#require1').show();
	      }
	      console.log(error);
	  }
  });
}

$(document).ready(function(){
	$('#require').hide();
})

function demo2(){
    swal({
        title: "가입 완료",
        text: "로그인 후 정보를 입력해주세요.",
        type: "success"
    });
};

//$('#pw').keypress(function(){
//	if($('#pw').val().length < 6) {
//		$('#require1').text('비밀번호는 6자 이상으로 생성해주세요.');
//		$('#require1').show();
//    } else {
//    	$('#require1').hide();
//    }
//})

$('#clientRegister').click(function(){
	if($('#pw').val() == $('#pwCheck').val() && $('#pw').val().length > 6){
		handleSignUp();
		location.hash = '#/clientLogin';
		demo2();
	} else if($('#pw').val() != $('#pwCheck').val()){
  	  	  $('#pwCheck').val('');
		  $('#pw').val('');
		  $('#pw').focus();
		  $('#require1').text('');
		  $('#require1').text('비밀번호가 일치하지 않습니다.');
		  $('#require1').show();
    } else if($('#pw').val().length < 6){
    	  $('#pwCheck').val('');
    	  $('#pw').val('');
		  $('#pw').focus();
		  $('#require1').text('');
		  $('#require1').text('비밀번호는 6자 이상으로 생성해주세요.');
		  $('#require1').show();
    }
})