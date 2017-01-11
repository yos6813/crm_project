function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var no = getParameterByName('no');
var email = getParameterByName('email');

$(document).ready(function(){
	firebase.database().ref('qnaWrite/').orderByChild('userEmail').equalTo(email).on('child_added', function(snapshot){
		var state;
		if(snapshot.val().status == '해결'){
			state = 'label-default';
		} else if(snapshot.val().status == '보류'){
			state = 'label-warning';
		} else if(snapshot.val().status == '등록'){
			state = 'label-info';
		} else{
			state = 'label-primary';
		}
		$('#viewQnaList').append('<tr class="call_list" value="' + snapshot.key + '">' +
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
	
	$(document).on('click', '.call_list', function(){
		location.hash = '#/cIndex/view_qna?no=' + $(this).attr('value') + '&email=' + firebase.auth().currentUser.email;
		location.reload();
	})
	
	$('#replyBox').hide();
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#viewButton').append('<a href="#/cIndex/postModify?no=' + no + '" id="qnamodify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
	'<a id="qnadelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
	
	$(document).on('click', '#qnadelete', function(){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		
		firebase.database().ref('qnaWrite/' + no).remove();
		firebase.database().ref('timePosts/' + month + '/' + day + '/' + hour + '/' + no).remove();
		firebase.database().ref('monthPosts/' + year + '/' + month + '/' + day + '/' + no).remove();
		
		location.hash = '#/cIndex/qnaList?no=' + firebase.auth().currentUser.uid;
	});
	
	firebase.database().ref('qnaWrite/' + no).on('value', function(snapshot){
		$('#viewTitle').text(snapshot.val().title);
		$('#viewText').append(snapshot.val().text);
		$('#postDate').text('글 작성일: ' + snapshot.val().date);
		$('#mark').prepend(snapshot.val().type + '문의/ ' + snapshot.val().bigGroup + '/ ' + snapshot.val().smallGroup);
		
		firebase.database().ref('reply/' + no).on('value', function(snapshot1){
			$('#replyName').text(snapshot1.val().replyName);
			$('#replyText').append(snapshot1.val().replyText);
			if(snapshot1.val().replyDate != ''){
				$('#replyBox').show();
				$('#replyDate').text('답변 작성일: ' + snapshot1.val().replyDate);
			}
			firebase.database().ref('reply/' + no + '/replyFile').on('value', function(snapshot){
				firebase.database().ref('reply/' + no).on('value', function(snapshot1){
					snapshot.forEach(function(data){
					if(data.val() == ''&& snapshot.val().length <= 1){
//						$('#replyFile').children().remove();
						$('#replyFile').append('<div class="file-box"><small>no file</small></div>');
					} else {
							firebase.storage().ref('files/' + data.val()).getDownloadURL().then(function(url){
								$('#replyFile').append('<div class="file-box">' +
										'<div class="file">' + 
										'<a href="' + url + '">' + 
										'<span class="corner"></span>' + 
										'<div class="image">' + 
										'<img alt="file" class="img-responsive" src="' + url + '">' + 
										'</div>' + 
										'<div class="file-name">' + data.val() +
										'<br/>' +
										'<small>Added: ' + snapshot1.val().replyDate + '</small>' +
										'</div>' +
										'</a>' +
										'<div>' +
										'</div>' +
										'<div class="clearfix"></div>');
							})
						}
					})
				})
			})
		})
		
		firebase.database().ref('qnaWrite/' + no + '/file').on('value', function(snapshot){
			firebase.database().ref('qnaWrite/' + no).on('value', function(snapshot1){
				snapshot.forEach(function(data){
				if(data.val() == '' && snapshot.val().length <= 1){
//					$('#viewFile').children().remove();
					$('#viewFile').append('<div class="file-box"><small>no file</small></div>');
				} else {
						firebase.storage().ref('files/' + data.val()).getDownloadURL().then(function(url){
							$('#viewFile').append('<div class="file-box">' +
									'<div class="file">' + 
									'<a href="' + url + '">' + 
									'<span class="corner"></span>' + 
									'<div class="image">' + 
									'<img alt="file" class="img-responsive" src="' + url + '">' + 
									'</div>' + 
									'<div class="file-name">' + data.val() +
									'<br/>' +
									'<small>Added: ' + snapshot1.val().date + '</small>' +
									'</div>' +
									'</a>' +
									'<div>' +
									'</div>' +
							'<div class="clearfix"></div>');
						})
					}
				})
			})
		})
	})
	
})
//$(document).on('click','#qnadelete', function(){
//	var postRef = firebase.database().ref('qnaWrite/' + no);
//	postRef.remove();
//	
//	location.hash = '#/cIndex/qnaList?no=' + firebase.auth().currentUser.uid;
//	location.reload();
//});