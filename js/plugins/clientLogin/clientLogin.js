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

$('#clientLogin').click(function(){
	toggleSignIn();
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){
			location.hash = '#/cIndex/main';
		}
	})
})