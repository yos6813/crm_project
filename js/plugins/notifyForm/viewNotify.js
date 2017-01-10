function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var type = getParameterByName('no1');
var no = getParameterByName('no');

$(document).ready(function(){
	
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#patch').hide();
	$('#notice').hide();
	if(type != ''){
		$('#viewButton').append('<a href="#/index/notifyWrite?no=' + no + '" id="modify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
		'<a id="delete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
	}
	firebase.database().ref('notify/' + no).on('value', function(snapshot){
		$("#viewText").append(snapshot.val().text);
		$('#viewTitle').text(snapshot.val().title);
		$('#notifyDate').append('<i class="fa fa-clock-o"></i>' +snapshot.val().date);
		
		if(snapshot.val().notifyType == '패치'){
			$('#patch').show();
			$('#notice').hide();
		} else if(snapshot.val().notifyType == '공지') {
			$('#patch').hide();
			$('#notice').show();
		}
		
		firebase.database().ref('notify/' + no + '/file').on('value', function(snapshot){
			if(snapshot.val() == undefined || snapshot.val() == ''){
				$('#viewFile').append('<div class="file-box"><small>no file</small></div>');
			}else{
				firebase.database().ref('notify/' + no).on('value', function(snapshot1){
					snapshot.forEach(function(data){
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
									'<small>Added: ' + snapshot1.val().postDate + '</small>' +
									'</div>' +
									'</a>' +
									'<div>' +
									'</div>' +
									'<div class="clearfix"></div>');
						})
					})
				})
			}
		})
	})
	
	$(document).on('click','#delete', function(){
		location.hash = '#/index/notifyPage';
		location.reload();
		var postRef = firebase.database().ref('notify/' + no);
		
		postRef.remove();
	});
})