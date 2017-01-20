function toggleSignIn() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    if (email.length < 10) {
      alert('이메일을 입력해주세요.');
      $('#email').val();
      $('#email').focus();
      return;
    }
    
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    	if(error){
    		var errorCode = error.code;
    		var errorMessage = error.message;
    		if (errorCode === 'auth/wrong-password') {
    			$('#require').text('비밀번호를 확인해주세요.');
    			firebase.auth().signOut();
    			location.hash = '#/clientLogin';
    		} else if(errorCode === 'auth/too-many-requests'){
    			$('#require').text('잠시 후 다시 시도해주세요.');
    			firebase.auth().signOut();
    			location.hash = '#/clientLogin';
    		} else if(errorCode == 'auth/user-not-found'){
				$('#require').text('사용자가 없습니다.');
				$('#require').show();
    		} else {
    			$('#require').text(errorMessage);
    			firebase.auth().signOut();	
    			location.hash = '#/clientLogin';
    		}
    		console.log(error);
    	} 
    }).then(function(){
    	firebase.auth().onAuthStateChanged(function(user) {
    		if(user){
    			firebase.database().ref('clients/' + user.uid).on('value', function(snapshot){
    				if(snapshot.val() != null){
    					location.hash = '#/cIndex/notifyPage';
    				} else {
    					location.hash = '#/clientInfo';
    				}
    			})
    		}
    	})
    })
}

$('#clientLogin').click(function(){
	toggleSignIn();
})