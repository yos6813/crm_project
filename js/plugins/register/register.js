firebase.auth().onAuthStateChanged(function(user) {
	$('#registerprofileImg').attr('src', user.photoUrl); 
	$('#registerUsername').val(user.displayName);
	$('#emailInput').val(user.email);
	
	firebase.database().ref("jobs/").orderByKey().on("child_added", function(snapshot){
		snapshot.forEach(function(data){
			$('#job1').append('<li><a value="' + data.val() + '">' + data.val()
					+ '</a></li>');
		})
		$('#job1 a').on('click', function(){
			$('#job').val($(this).attr('value'));
		})
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

/* Register Form */

function writeUserInfo(uid, job, userImg, username, email, nickname, extension, phone, call, slack, grade){
	var infoData = {
		uid: uid,
		job: job,
		picture: userImg,
		username: username,
		email: email,
		nickname: nickname,
		extension: extension,
		phone: phone,
		call: call,
		slack: slack,
		grade: grade
	};
	
	var newInfoKey = firebase.database().ref().child('infos').push().key;
	
	var updates = {};
	updates['/infos/' + newInfoKey] = infoData;
	updates['/user-infos/' + uid + '/' + newInfoKey] = infoData;
	
	return firebase.database().ref().update(updates);
}

$('#registerBtn').click(function(){
	if($('#extension').val() != '' && $('#call').val() != '' && $('#phone').val() != '' && $('#nickname').val() != ''){
			var user = firebase.auth().currentUser;
			writeUserData(user.uid, user.displayName, user.email, user.photoURL);
			
			var uid = firebase.auth().currentUser.uid;
			var job = $('#job').val();
			var userImg = firebase.auth().currentUser.photoURL;
			var username = $('#registerUsername').val();
			var email = $('#emailInput').val();
			var nickname = $('#nickname').val();
			var extension = $('#extension').val();
			var phone = $('#phone').val();
			var call = $('#call').val();
			var address = $('#sample6_address').val() + ' ' + $('#sample6_address2').val();
			var grade = '1';
			var slack = $('#slack').val();
			
			writeUserInfo(uid, job, userImg, username, email, nickname, extension, phone, call, slack, grade);
			window.location.hash="/index/chart"
			location.reload();
	}
});