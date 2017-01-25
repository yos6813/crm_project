function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var type = getParameterByName('no1');
var no = getParameterByName('no');

$(document).ready(function(){
	/* 미로그인 시 로그인 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#patch').hide();
	$('#notice').hide();
	/* 유형 드롭다운 */
	if(type != ''){
		$('#viewButton').append('<a href="#/index/notifyMod?no1=' + type + '" class="btn btn-white btn-sm"><i class="fa fa-pencil"></i> 수정</a>' +
		'<a id="delete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
	
	/* 관리자 페이지 */
	firebase.database().ref('notify/' + type).on('value', function(snapshot1){
		$("#viewText").append(snapshot1.val().text);
		$('#viewTitle').text(snapshot1.val().title);
		$('#notifyDate').append('<i class="fa fa-clock-o"></i>' +snapshot1.val().date);
		
		if(snapshot1.val().notifyType == '패치'){
			$('#patch').show();
			$('#notice').hide();
		} else if(snapshot1.val().notifyType == '공지') {
			$('#patch').hide();
			$('#notice').show();
		}
		
		/* 첨부파일 */
		firebase.database().ref('notify/' + type + '/file').on('value', function(snapshot){
			firebase.database().ref('notify/' + type).on('value', function(snapshot2){
				snapshot.forEach(function(data){
				if(data.val() == ''&& snapshot.val().length <= 1){
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
									'<small>Added: ' + snapshot2.val().date + '</small>' +
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
	
	/* 글 삭제 */
	$(document).on('click','#delete', function(){
		var postRef = firebase.database().ref('notify/' + type);
		
		swal({
	        title: "정말 삭제하시겠습니까?",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "Yes",
	        cancelButtonText: "No",
	        closeOnConfirm: false,
	        closeOnCancel: false },
	    function (isConfirm) {
	        if (isConfirm) {
	            swal("삭제되었습니다.", "success");
	            postRef.remove();
	            location.hash = "#/index/notifyPage?no=1";
	        } else {
	            swal("취소", "error");
	        }
	    });
		
	});
	} else {
	/* 고객 페이지 */
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
		
		/* 첨부파일 */
		firebase.database().ref('notify/' + no + '/file').on('value', function(snapshot){
			firebase.database().ref('notify/' + no).on('value', function(snapshot1){
				snapshot.forEach(function(data){
				if(data.val() == ''&& snapshot.val().length <= 1){
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
	
	/* 글 삭제 */
	$(document).on('click','#delete', function(){
		location.reload();
		var postRef = firebase.database().ref('notify/' + no);
		
		swal({
	        title: "정말 삭제하시겠습니까?",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonColor: "#DD6B55",
	        confirmButtonText: "Yes",
	        cancelButtonText: "No",
	        closeOnConfirm: false,
	        closeOnCancel: false },
	    function (isConfirm) {
	        if (isConfirm) {
	            swal("삭제되었습니다.", "success");
	            postRef.remove();
	            location.hash = "#/cIndex/notifyPage";
	        } else {
	            swal("취소", "error");
	        }
	    });
	});
	}
})