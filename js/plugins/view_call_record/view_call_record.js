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
	firebase.database().ref('posts/' + viewPageno).on('value', function(snapshot){
		$('#viewTitle').text(snapshot.val().title);
		$('#viewCustomer').text(snapshot.val().postCustomer);
		$('#viewCall').text(snapshot.val().postCusPhone);

		if(snapshot.val().postCompany != ''){
			$('#viewCompany').text(snapshot.val().postCompany);
			var client = [];
			var comClient = $('#viewCompany').text();
			firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
				firebase.database().ref("company/" + snapshot.key + "/client").on('value', function(snapshot1){
					client.push(snapshot1.val());
					for(var i=0; i<=client[0].length; i++){
						if(client[0][i] == 'yeta'){
							$('#viewYeta').show();
						}
						else if(client[0][i] == 'academy'){
							$('#viewAcademy').show();
						}
						else if(client[0][i] == 'consulting'){
							$('#viewConsulting').show();
						} 
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
	
	firebase.database().ref('posts/' + viewPageno + '/postState').on('value', function(snapshot){
		if(snapshot.val() == '해결'){
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="resolve">해결</option>' +
			            		   '<option value="accept1">접수</option>' + 
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
		}
	})
	
	firebase.database().ref('posts/' + viewPageno + '/postType').on('value', function(snapshot){
		if(snapshot.val() == '세법'){
			$('#viewTaxLaw').show();
			$('#viewType1').show();
		} else if(snapshot.val() == '시스템'){
			$('#viewSystem').show();
			$('#viewType2').show();
		} else if(snapshot.val() == '운용'){
			$('#viewEmployment').show();
			$('#viewType3').show();
		} else if(snapshot.val() == '기타'){
			$('#viewEtc').show();
			$('#viewType4').show();
		}
	})
	
	firebase.database().ref('posts/' + viewPageno + '/tags').on('value', function(snapshot){
		var tags = [];
		tags.push(snapshot.val());
		if(tags[0] == null){
			$('.tag-list').append('<li><a href=""><i class="fa fa-tag"></i>No tags</a></li>');
		} else {
			for(var i=0; i<=tags[0].length; i++){
				if(tags[0][i] != undefined)
					$('.tag-list').append('<li><a href=""><i class="fa fa-tag"></i>' + tags[0][i] + '</a></li>');
			}
		}
	})
	
	firebase.database().ref('posts/' + viewPageno + '/text').on('value', function(snapshot){
		$('#viewText').append(snapshot.val());
	})
	
	firebase.database().ref('reply/' + viewPageno + '/replyText').on('value', function(snapshot){
		$('#ReplyText').append(snapshot.val());
	})
	
	firebase.database().ref('posts/' + viewPageno + '/uploadfile').on('value', function(snapshot){
		if(snapshot.val() == undefined || snapshot.val() == 'x'){
			$('#viewFile').append('<div class="file-box"><small>no file</small></div>');
		}else{
			firebase.database().ref('posts/' + viewPageno).on('value', function(snapshot1){
				snapshot.forEach(function(data){
				if(data.val() == 'x' || data.val() == ''){
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
									'<small>Added: ' + snapshot1.val().postDate + '</small>' +
									'</div>' +
									'</a>' +
									'<div>' +
									'</div>' +
							'<div class="clearfix"></div>');
						})
					}
				})
			})
		}
	})
	
	
	$('#acceptSel1').change(function(){
		var user = firebase.auth().currentUser;
		var name = user.displayName;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var date = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var post = viewPageno;
		var state = $(this).children("option:selected").val();

		if(state == 'accept'){
			$('#acceptSel1').show();
			firebase.database().ref('posts/' + viewPageno).update({
				postState:'접수'
			})
			firebase.database().ref('accept/' + viewPageno).update({
				AcceptName: user.displayName,
				AcceptDate: date,
				AcceptUserId: user.uid
			})
			location.reload();
		} else if(state == 'defer'){
			firebase.database().ref("accept/" + viewPageno).update({
				AcceptName: '',
				AcceptDate: '',
				AcceptUserId:''
			})
			firebase.database().ref('posts/' + viewPageno).update({
				postState: '보류'
			})
			location.reload();
		} else if(state == 'accept1'){
			firebase.database().ref('reply/' + viewPageno).update({
				replyDate: '',
				replyImg: '',
				replyName: '',
				userId: ''
			});
			firebase.database().ref('posts/' + viewPageno).update({
				postState:'접수',
				date: date
			})
			firebase.database().ref('accept/' + viewPageno).update({
				AcceptName: user.displayName,
				AcceptDate: date,
				AcceptUserId: user.uid
			})
			location.reload();
		} else {
			firebase.database().ref('posts/' + viewPageno).update({
				postState: '해결'
			})
			firebase.database().ref('reply/' + viewPageno).update({
				replyDate: date,
				replyImg: user.photoURL,
				replyName: name,
				userId: user.uid
			})
			location.reload();
		}
	})
	
	$(document).ready(function(){
		firebase.database().ref("accept/" + viewPageno).on('value', function(snapshot){
				if(snapshot.val().AcceptUserId != ''){
					$('#acceptSel1').show();
					$('#postAccept').hide();
					$('#viewAccept').text('접수: ' + snapshot.val().AcceptName +
										  ' (' + snapshot.val().AcceptDate + ')');
				} else {
					$('#viewAccept').text('');
				}
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
				$('#viewButton').append('<a href="#/index/form_call_record_modify?no=' + viewPageno + '" id="viewModify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
										'<a id="viewDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
//			}
//		})
//	});
	
	$(document).on('click','#viewDelete', function(){
		window.location.hash = 'index/call_list';
		var uid = firebase.auth().currentUser.uid;
		var postRef = firebase.database().ref('posts/' + viewPageno);
		var userPostRef = firebase.database().ref('user-posts/' + uid + '/' + viewPageno);
		var replyRef = firebase.database().ref('reply/' + viewPageno);
		
		postRef.remove();
		
		replyRef.remove();
		
		userPostRef.remove();
	});
})