function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var no = getParameterByName('no');

$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#viewButton').append('<a href="#/cIndex/postModify?no=' + no + '" id="qnamodify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
	'<a id="qnadelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
	
	firebase.database().ref('qnaWrite/' + no).on('value', function(snapshot){
		$('#viewTitle').text(snapshot.val().title);
		$('#viewText').append(snapshot.val().text);
		$('#postDate').text('글 작성일: ' + snapshot.val().date);
		
		firebase.database().ref('reply/' + no).on('value', function(snapshot1){
			$('#replyText').text(snapshot1.val().replyText);
			if(snapshot1.val().replyDate != '')
			$('#replyDate').text('답변 작성일: ' + snapshot1.val().replyDate);
		})
		
		if(snapshot.val().file == ''){
			$('#viewFile').append('<div class="file-box"><small>no file</small></div>');
		}else{
			firebase.storage().ref('files/' + snapshot.val().file).getDownloadURL().then(function(url){
				$('#viewFile').append('<div class="file-box">' +
						'<div class="file">' + 
						'<a href="' + url + '">' + 
						'<span class="corner"></span>' + 
						'<div class="image">' + 
						'<img alt="file" class="img-responsive" src="' + url + '">' + 
						'</div>' + 
						'<div class="file-name">' + snapshot1.val().file +
						'<br/>' +
						'<small>Added: ' + snapshot.val().date + '</small>' +
						'</div>' +
						'</a>' +
						'<div>' +
						'</div>' +
						'<div class="clearfix"></div>');
			})
		}
	})
})
$(document).on('click','#qnadelete', function(){
	var postRef = firebase.database().ref('qnaWrite/' + no);
	postRef.remove();
	
	location.hash = '#/cIndex/qnaList?email=' + firebase.auth().currentUser.email;
	location.reload();
});