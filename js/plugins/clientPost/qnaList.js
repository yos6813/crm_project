function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var email = getParameterByName('no');

$(document).ready(function(){
	/* 미로그인 시 로그인 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	/* 유저 글 리스트 로드 */
	firebase.database().ref('qnaWrite/').orderByChild('user').equalTo(email).on('child_added', function(snapshot){
		var state;
		if(snapshot.val().status == '해결'){
			state = 'label-default';
		} else if(snapshot.val().status == '보류'){
			state = 'label-warning';
		} else if(snapshot.val().status == '등록'){
			state = 'label-success';
		} else if(snapshot.val().status == '검토중'){
			state = 'label-info';
		} else{
			state = 'label-primary';
		}
		$('#qnaList').append('<tr class="call_list" value="' + snapshot.key + '">' +
				'<td class="project-status">' +
				'<span class="label ' + state + '">' + snapshot.val().status + '</span>' +
				'</td>' +
				'<td class="project-category">' +
				'<span>' + snapshot.val().type + '</span>' +
				'</td>' +
				'<td class="title project-title">' +
				snapshot.val().title +
				'</td>' +
				'<td class="project-title">' + snapshot.val().date + '</td></tr>');
	})
})

/* 리스트 클릭 시 해당 글의 뷰페이지로 이동 */
$(document).on('click', '.call_list', function(){
	location.hash = '#/cIndex/view_qna?no=' + $(this).attr('value') + '&email=' + firebase.auth().currentUser.email;
})