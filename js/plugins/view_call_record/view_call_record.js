function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var viewPageno = getParameterByName('no');

$('#viewYeta').hide();
$('#viewAcademy').hide();
$('#viewConsulting').hide();

$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){
			firebase.database().ref('clients/' + user.uid).on('child_added',function(snapshot){
				if(snapshot.val().grade == '0'){
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	firebase.database().ref('qnaWrite/' + viewPageno).on('value', function(snapshot){
		$('#viewTitle').text(snapshot.val().title);
		$('#viewCustomer').text(snapshot.val().userName);
		
		firebase.database().ref('clients/' + snapshot.val().user).on('child_added', function(snapshot1){
			$('#viewCall').text(snapshot1.val().clientPhone);
			$('#viewExtension').text(snapshot1.val().clientExtension);
			$('#viewWorkPhone').text(snapshot1.val().WorkPhone);
			$('#viewFax').text(snapshot1.val().clientFax);
			$('#viewEmail').text(snapshot1.val().clientEmail);
		})

		if(snapshot.val().postCompany != ''){
			$('#viewCompany').text(snapshot.val().company);
			var comClient = $('#viewCompany').text();
			firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
				firebase.database().ref("company/" + snapshot.key).on('value', function(snapshot1){
					if(snapshot.val().yeta == '1'){
						$('#viewYeta').show();
					}
					if(snapshot.val().academy == '1'){
						$('#viewAcademy').show();
					}
					if(snapshot.val().consulting == '1'){
						$('#viewConsulting').show();
					}
				})
			})
		} else {
			$('#viewCompany').text();
		}
	})
})

$('#viewTaxLaw').hide();
$('#viewType1').hide();
$('#viewSystem').hide();
$('#viewType2').hide();
$('#viewEmployment').hide();
$('#viewType3').hide();
$('#viewEtc').hide();
$('#viewType4').hide();

$(document).ready(function(){
	
	firebase.database().ref('qnaWrite/' + viewPageno + '/status').on('value', function(snapshot){
		if(snapshot.val() == '해결'){
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="resolve">해결</option>' +
			            		   '<option value="accept">접수</option>' + 
			            		   '<option value="defer">보류</option>');
		} else if(snapshot.val() == '접수'){
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="accept">접수</option>' + 
									'<option value="resolve">해결</option>' +
			            		   	'<option value="defer">보류</option>');
		} else if(snapshot.val() == '보류'){
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="defer">보류</option>' + 
									'<option value="resolve">해결</option>' +
			            		   	'<option value="accept">접수</option>');
		} else if(snapshot.val() == '등록'){
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="update">등록</option>' +
									'<option value="accept">접수</option>' + 
									'<option value="resolve">해결</option>' +
					    		   	'<option value="defer">보류</option>');
		}
	})
	
	firebase.database().ref('qnaWrite/' + viewPageno + '/type').on('value', function(snapshot){
		if(snapshot.val() == '세법'){
			$('#viewTaxLaw').show();
			$('#viewType1').show();
		} else if(snapshot.val() == '시스템'){
			$('#viewSystem').show();
			$('#viewType2').show();
		} else if(snapshot.val() == '운용'){
			$('#viewEmployment').show();
			$('#viewType3').show();
		} 
	})
	
	firebase.database().ref('qnaWrite/' + viewPageno + '/text').on('value', function(snapshot){
		$('#viewText').append(snapshot.val());
	})
	
	firebase.database().ref('reply/' + viewPageno + '/replyText').on('value', function(snapshot){
		$('#ReplyText').append(snapshot.val());
	})
	
	firebase.database().ref('qnaWrite/' + viewPageno + '/file').on('value', function(snapshot){
		firebase.database().ref('qnaWrite/' + viewPageno).on('value', function(snapshot1){
			snapshot.forEach(function(data){
			if(data.val() == ''&& snapshot.val().length <= 0){
				$('#viewFile').children().remove();
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
	
	
	$('#acceptSel1').change(function(){
		var user = firebase.auth().currentUser;
		var img = user.photoURL;
		var name = user.displayName;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var date = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var post = viewPageno;
		var state = $(this).val();

		if(state == 'accept'){
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status:'접수'
			})
			firebase.database().ref('accept/' + viewPageno).update({
				AcceptName: user.displayName,
				AcceptDate: date,
				AcceptUserId: user.uid,
				post: post
			})
			location.reload();
		} else if(state == 'defer'){
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '보류'
			})
//			firebase.database().ref("accept/" + viewPageno).update({
//				AcceptName: '',
//				AcceptDate: '',
//				AcceptUserId:''
//			})
			location.reload();
		} else {
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '해결'
			})
//			firebase.database().ref('reply/' + viewPageno).update({
//				replyDate: date,
//				replyImg: user.photoURL,
//				replyName: name,
//				userId: user.uid
//			})
			location.reload();
		}
	})
	
	$(document).ready(function(){
		firebase.database().ref("qnaWrite/" + viewPageno).on('value', function(snapshot){
				$('#viewAccept').text('문의시간: ' + snapshot.val().date);
		})
		
		firebase.database().ref("reply/" + viewPageno).on('value', function(snapshot1){
			if(snapshot1.val().replyName != ''){
				$('#viewReply').text('해결: ' + snapshot1.val().replyName +
									 ' (' + snapshot1.val().replyDate + ')');
			} else {
				$('#viewReply').text('');
			}
		})
	})
	
	function addComment(commentImg, commentDate, commentName, comment, post){
		var commentData = {
				commentImg: commentImg,
				commentDate: commentDate,
				commentName: commentName,
				comment: comment,
				post: post
		}
		
		var newCommentKey = firebase.database().ref().child('comment').push().key;
		
		var updates = {};
		updates['/comment/' + newCommentKey] = commentData;
		
		return firebase.database().ref().update(updates);
	}
	
	$('#uploadComment').click(function(){
		var user = firebase.auth().currentUser;
		var commentImg = user.photoURL;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var commentDate = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var commentName = user.displayName;
		var comment = $('#comment').val();
		var post = viewPageno
		
		addComment(commentImg, commentDate, commentName, comment, post);
		
		$('#comment').val('');
	})
	
	$(document).ready(function(){
		firebase.database().ref("comment/").orderByChild('post').equalTo(viewPageno).on('child_added', function(snapshot){
			firebase.database().ref("comment/" + snapshot.key).on('value', function(snapshot1){
			$('#commentArea').append('<a class="pull-left">' +
	                                 '<img alt="image" src="' + snapshot1.val().commentImg + '">' +
	                                 '</a>' +
	                                 '<div class="media-body">' +
	                                 '<a>' + snapshot1.val().commentName +
	                                 '</a>&nbsp;' +
	                                 '<small class="text-muted">'+ snapshot1.val().commentDate +'</small>' +
	                                 '<br/>' + snapshot1.val().comment +
	                                 '<br/>' +
	                                 '</div><br>');
			});
		});
	})
	
//	firebase.auth().onAuthStateChanged(function(user) {
//		var userId = firebase.auth().currentUser;
//		firebase.database().ref('user-posts/' + userId.uid + '/' + viewPageno).on('value', function(snapshot){
//			if(snapshot.val() != null){
				$('#viewButton').append('<a href="#/index/form_call_record_modify?no=' + viewPageno + '" id="viewModify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 답변</a>' +
										'<a id="viewDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
//			}
//		})
//	});
	
	$(document).on('click','#viewDelete', function(){
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
                var today = new Date();
        		var year = today.getFullYear();
        		var month = today.getMonth()+1;
        		var day = today.getDate();
        		var hour = today.getHours();
        		var minutes = today.getMinutes();
        		var postRef = firebase.database().ref('qnaWrite/' + viewPageno);
        		var replyRef = firebase.database().ref('reply/' + viewPageno);
        		firebase.database().ref('timePosts/' + month + '/' + day + '/' + hour + '/' + viewPageno).remove();
        		firebase.database().ref('monthPosts/' + year + '/' + month + '/' + day + '/' + viewPageno).remove();
        		
        		postRef.remove();
        		replyRef.remove();
        		window.location.hash = 'index/call_list';
                
        		swal("삭제되었습니다.", "Your imaginary file has been deleted.", "success");
            } else {
                swal("취소되었습니다.", "Your imaginary file is safe :)", "error");
            }
        });
	});
})