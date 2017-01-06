function handleSignUp() {
  var clientEmail = $('#clientEmail').val();
  var password = $('#pw').val();
  
  firebase.auth().createUserWithEmailAndPassword(clientEmail, password).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
	  alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
  });
}

$('#clientRegister').click(function(){
	var clientEmail = $('#clientEmail').val();
    var password = $('#pw').val();
    
	  
	if($('#pw').val() == $('#pwCheck').val()){
		  handleSignUp();
		  location.hash = '#/clientLogin';
	  } else {
		  $('#pwCheck').val('');
		  $('#pw').val('');
		  alert('비밀번호를 확인해주세요');
	  }
})