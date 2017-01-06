function toggleSignIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 10) {
      alert('Please enter an email address.');
      return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('비밀번호를 확인해주세요.');
			} if(errorCode === 'auth/too-many-requests'){
				alert('잠시 후 다시 시도해주세요');
			}
			else {
				alert(errorMessage);
			}
			console.log(error);
    });
}

function sendEmailVerification() {
	firebase.auth().currentUser.sendEmailVerification().then(function() {
		alert('이메일 확인을 위한 메일을 전송하였습니다. 메일을 확인해주세요.');
    });
}

$('#clientLogin').click(function(){
	toggleSignIn();
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){
			firebase.database().ref('clients/' + user.uid).on('value', function(snapshot){
				if(snapshot.val() != null){
					location.hash = '#/cIndex/notifyPage';
				} else {
					sendEmailVerification();
					location.hash = '#/clientInfo';
				}
			})
		}
	})
})