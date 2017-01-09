function handleSignUp() {
  var clientEmail = $('#clientEmail').val();
  var password = $('#pw').val();
  
  firebase.auth().createUserWithEmailAndPassword(clientEmail, password).catch(function(error) {
	  if(error){
	      var errorCode = error.code;
	      var errorMessage = error.message;
	      if (errorCode == 'auth/weak-password') {
	    	  $('#require1').text('비밀번호의 보안이 약합니다.');
	    	  $('#require1').show();
	      } else if (errorCode == 'auth/email-already-in-use'){
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

$('#clientRegister').click(function(){
	if($('#pw').val() == $('#pwCheck').val()){
		handleSignUp();
		location.hash = '#/clientLogin';
	}
	else {
  	  $('#pwCheck').val('');
		  $('#pw').val('');
		  $('#pw').focus();
		  $('#require1').text('');
		  $('#require1').text('비밀번호가 일치하지 않습니다.');
		  $('#require1').show();
    } 
})