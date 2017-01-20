function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var viewPageno = getParameterByName('no');

function history(historyType, user, date, historytext){
	var historyData = {
			historyType: historyType,
			user: user,
			date: date,
			historytext: historytext
	}
	
	var hitoryKey = firebase.database().ref().child('history').push().key;

	var updates = {};
	updates['/history/' + viewPageno] = historyData;

	return firebase.database().ref().update(updates);
}

$('#sap').hide();
$('#cloud').hide();
$('#onpremises').hide();

function sendToSlack_(url,payload) {
	$.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "application/json",
    });
}

$(document).ready(function () {
	firebase.database().ref('qnaWrite/' + viewPageno).on('value', function(snapshot){
		if(snapshot.val().warn == '긴급'){
			$('#checkbox6').prop('checked', true);
		}
	})
	$('#mail').hide();
	
	firebase.database().ref('reply/' + viewPageno).on('value', function(snapshot){
		if(snapshot.val().replyText == ''){
			$('#mail').hide();
		} else {
			$('#mail').show();
		}
	})
	
	$('#checkbox6').change(function(){
		if($(this).is(":checked")){
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				warn: "긴급"
			})
		} else {
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				warn: " "
			})
		}
	})
	
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + user.uid).on('child_added', function (snapshot) {
				if (snapshot.val().grade == '0') {
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	$('#list1').children('.userlist').remove();
	firebase.database().ref('users/').on('child_added', function (snapshot1) {
		if(snapshot1.val().username != undefined){
			var picture;
			
			$('#list1').append('<tr class="userlist"><td><input type="radio" value="' + snapshot1.key + '" name="radioInline" ></td>' +
					'<td><img alt="image" class="img-circle" src="' + snapshot1.val().profile_picture + '"></td>' +
					'<td class="nameLi">' + snapshot1.val().username + '</td></tr>');
			
			$('img').error(function(){
				$(this).attr('src', '../../img/photo.png');
			})
		}
	})
	
	$('#list').children().remove();
	firebase.database().ref('users/').on('child_added', function (snapshot1) {
		firebase.database().ref('accept/').orderByChild('AcceptUserId').equalTo(snapshot1.key).on('value', function(snapshot3){
			if(snapshot1.val().username != undefined){
				$('#list').append('<tr><td><input type="radio" value="' + snapshot1.key + '" name="radioInline" ></td>' +
								'<td><img alt="image" class="img-circle" src="' + snapshot1.val().profile_picture + '"></td>' +
								'<td>' + snapshot1.val().username + '</td><td>' + snapshot3.numChildren() + '</td></tr>');
				
				$('img').error(function(){
					$(this).attr('src', '../../img/photo.png');
				})
			}
		})
	})
	$('#modalSave').click(function(){
		var historytext;
			if($('input[type=radio]:checked').val() == 'tech'){
				var name = firebase.auth().currentUser.displayName;
				var types = "<" + window.location.href + ">";
				var url = "https://hooks.slack.com/services/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";
				historytext = 'tech방에 slack 공유';
				payload= {
							"text": name + "님이 공유하였습니다." + "\n" + types
						 }
				
				sendToSlack_(url,payload);
			}
			firebase.database().ref('company/').orderByChild('name').equalTo($('#viewCompany').text()).on('child_added', function(snapshot1){
				firebase.database().ref('users/' + snapshot1.val().officer).on('value', function(snapshot2){
					firebase.database().ref('user-infos/' + $('input[type=radio]:checked').val()).on('child_added', function(snapshot){
						var name = firebase.auth().currentUser.displayName;
						var types = "<" + window.location.href + ">";
						var url = "https://hooks.slack.com/services/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";
						historytext = snapshot.val().username + '에게 slack 공유';
						payload = {
								"channel": "@" + snapshot.val().slack,
								"username": "YETA2016",
								"fields":[{
									"value": name + "님이 공유하였습니다." + "\n" + types,
									"short":false
								}]
						}
						sendToSlack_(url,payload);
							
						firebase.database().ref('user-infos/' + firebase.auth().currentUser.uid).on('child_added', function(snapshot1){
							payload2 = {
									"channel": "@" + snapshot1.val().slack,
									"username": "YETA2016",
									"fields":[{
										"value": snapshot.val().username + "님에게 공유하였습니다." + "\n" + types,
										"short":false
									}]
							}
							sendToSlack_(url,payload2);
						})
					})
				$('#myModal6').modal('hide');
			})
		})
		var historyType = 'slack공유';
		var user = firebase.auth().currentUser.uid;
		var today = new Date();
		var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
		firebase.database().ref('history/' + viewPageno).push({
			historyType: historyType,
			user: user,
			date: date,
			historytext: historytext
		})		
	})
		
		$('#modalSave1').click(function(){
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				officer: $('input[type=radio]:checked').val()
			})
			$('#myModal5').modal('hide');
			location.reload();
			
			firebase.database().ref('users/' + $('input[type=radio]:checked').val()).on('value', function(snapshot){
				var historyType = '책임자변경';
				var user = firebase.auth().currentUser.uid;
				var today = new Date();
				var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
				var historytext = snapshot.val().username + '로 책임자변경';
				firebase.database().ref('history/' + viewPageno).push({
					historyType: historyType,
					user: user,
					date: date,
					historytext: historytext
				})	
			})
		})
	

	
	firebase.database().ref('qnaWrite/' + viewPageno).on('value', function (snapshot) {
		$('#viewTitle').text(snapshot.val().title);
		$('#viewCustomer').text(snapshot.val().userName);
		if(snapshot.val().division != '' || snapshot.val().division != undefined){
			$('#division').text(snapshot.val().division);
		}
		firebase.database().ref('users/' + snapshot.val().officer).on('value', function(snapshot3){
			$('#officer').text(snapshot3.val().username);
		})
		firebase.database().ref('clients/' + snapshot.val().user).on('child_added', function (snapshot1) {
			$('#viewCall').text(snapshot1.val().clientPhone);
			$('#viewExtension').text(snapshot1.val().clientExtension);
			$('#viewWorkPhone').text(snapshot1.val().clientWorkPhone);
			$('#viewFax').text(snapshot1.val().clientFax);
			$('#viewEmail').text(snapshot1.val().clientEmail);
		})

		if (snapshot.val().postCompany != '') {
			$('#viewCompany').text(snapshot.val().company);
			var comClient = $('#viewCompany').text();
			firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function (snapshot) {
				firebase.database().ref("company/" + snapshot.key).on('value', function (snapshot1) {
					if (snapshot.val().sap == '1') {
						$('#sap').show();
					}
					if (snapshot.val().cloud == '1') {
						$('#cloud').show();
					}
					if (snapshot.val().onpremises == '1') {
						$('#onpremises').show();
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

function history(){
	var html;
	firebase.database().ref('history/' + viewPageno).on('child_added', function(snapshot){
		firebase.database().ref('users/' + snapshot.val().user).on('value', function(snapshot1){
			var date = snapshot.val().date.split('.');
			var date1 = date[1] + '/' + date[2];
			$('#history').append('<div class="timeline-item">' +
								 '<div class="row">' +
								 '<div class="col-xs-3 date historyDate"><i class="fa fa-check"></i>' + date1 +
								 '</div>' +
								 '<div class="col-xs-7 content no-top-border">' +
								 '<p><strong class="historyTitle">' + snapshot.val().historytext + '</strong></p>' +
								 '<p class="user">' + snapshot1.val().username + '</p>' +
								 '</div>' +
								 '</div>' +
								 '</div>');
		})
	})
}

$(document).ready(function () {
	history();
	firebase.database().ref('qnaWrite/' + viewPageno + '/status').on('value', function (snapshot) {
		switch(snapshot.val()){
		case '해결':
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="resolve">해결</option>' +
									'<option value="accept">접수</option>' +
									'<option value="check">검토중</option>' +
									'<option value="defer">보류</option>');
			break;
		case '접수':
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="accept">접수</option>' +
									'<option value="resolve">해결</option>' +
									'<option value="check">검토중</option>' +
									'<option value="defer">보류</option>');
			break;
		case '보류':
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="defer">보류</option>' +
									'<option value="check">검토중</option>' +
									'<option value="resolve">해결</option>' +
									'<option value="accept">접수</option>');
			break;
		case '등록':
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="update">등록</option>' +
									'<option value="accept">접수</option>' +
									'<option value="resolve">해결</option>' +
									'<option value="check">검토중</option>' +
									'<option value="defer">보류</option>');
			break;
		case '검토중':
			$('#acceptSel1').show();
			$('#postAccept').hide();
			$('#acceptSel1').children().remove();
			$('#acceptSel1').append('<option value="check">검토중</option>' +
									'<option value="defer">보류</option>' +
									'<option value="resolve">해결</option>' +
									'<option value="accept">접수</option>');
			break;
		}
	})

	firebase.database().ref('qnaWrite/' + viewPageno + '/type').on('value', function (snapshot) {
		if (snapshot.val() == '세법') {
			$('#viewTaxLaw').show();
			$('#viewType1').show();
		} else if (snapshot.val() == '시스템') {
			$('#viewSystem').show();
			$('#viewType2').show();
		} else if (snapshot.val() == '운용') {
			$('#viewEmployment').show();
			$('#viewType3').show();
		}
	})

	firebase.database().ref('qnaWrite/' + viewPageno + '/text').on('value', function (snapshot) {
		$('#viewText').append(snapshot.val());
	})

	firebase.database().ref('reply/' + viewPageno + '/replyText').on('value', function (snapshot) {
		$('#ReplyText').append(snapshot.val());
	})
	
$('#viewFile').children().remove();
	firebase.database().ref('qnaWrite/' + viewPageno + '/file').on('value', function (snapshot) {
		firebase.database().ref('qnaWrite/' + viewPageno).on('value', function (snapshot1) {
			snapshot.forEach(function (data) {
				if (data.val() == '' && snapshot.val().length <= 0) {
					$('#viewFile').children().remove();
					$('#viewFile').append('<div class="file-box"><small>no file</small></div>');
				} else {
					firebase.storage().ref('files/' + data.val()).getDownloadURL().then(function (url) {
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
	firebase.database().ref('reply/' + viewPageno).on('value', function (snapshot) {
		if(snapshot.val().replyText != ''){
			$('#mail').disabled = true;
		}
	})
	
	$('#mail').click(function(){
		firebase.database().ref('qnaWrite/' + viewPageno).on('value', function (snapshot) {
			firebase.database().ref('users/' + snapshot.val().officer).on('value', function(snapshot2){
				emailjs.send("gmail", "answer_01", 
				{
					"receiver":snapshot.val().userEmail,
					"sender": snapshot2.val().email,
					"incharge":snapshot2.val().email,
					"name":snapshot.val().userName,
					"title":snapshot.val().title,
					"link":'https://yeta.center/#/cIndex/view_qna?no=' + snapshot.key + '&email=' + snapshot.val().userEmail
				})
				swal({
					title: "메일을 발송하였습니다.",
					type: "success"
				});
			})
		})
		var historyType = '메일전송';
		var user = firebase.auth().currentUser.uid;
		var today = new Date();
		var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
		var historytext = '메일전송';
		firebase.database().ref('history/' + viewPageno).push({
			historyType: historyType,
			user: user,
			date: date,
			historytext: historytext
		})
	})
	
	$('#replyFile').children('file-box').remove();
	firebase.database().ref('reply/' + viewPageno + '/replyFile').on('value', function (snapshot) {
		firebase.database().ref('reply/' + viewPageno).on('value', function (snapshot1) {
			snapshot.forEach(function (data) {
				if (data.val() == '' && snapshot.val().length <= 0) {
					$('#replyFile').children().remove();
					$('#replyFile').append('<div class="file-box"><small>no file</small></div>');
				} else {
					firebase.storage().ref('files/' + data.val()).getDownloadURL().then(function (url) {
						$('#replyFile').append('<div class="file-box">' +
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


	$('#acceptSel1').change(function () {
		var user = firebase.auth().currentUser;
		var img = user.photoURL;
		var name = user.displayName;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var date = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var post = viewPageno;
		var state = $(this).val();
		var historyType;
		var historytext;
		
		switch(state){
		case 'accept':
			historyType = '접수로 상태변경';
			historytext = '접수로 상태변경';
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '접수'
			})
			firebase.database().ref('accept/' + viewPageno).set({
				AcceptName: user.displayName,
				AcceptDate: date,
				AcceptUserId: user.uid
			})
			firebase.database().ref('history/' + viewPageno).push({
				historyType: historyType,
				user: user.uid,
				date: date,
				historytext: historytext
			})	
			location.reload();
			break;
		case 'defer':
			historyType = '보류로 상태변경';
			historytext = '보류로 상태변경';
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '보류'
			})
			firebase.database().ref('history/' + viewPageno).push({
				historyType: historyType,
				user: user.uid,
				date: date,
				historytext: historytext
			})	
			location.reload();
			break;
		case 'check':
			historyType = '검토중으로 상태변경';
			historytext = '검토중으로 상태변경';
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '검토중'
			})
			firebase.database().ref('history/' + viewPageno).push({
				historyType: historyType,
				user: user.uid,
				date: date,
				historytext: historytext
			})	
			location.reload();
			break;
		default:
			historyType = '해결로 상태변경';
			historytext = '해결로 상태변경';
			firebase.database().ref('qnaWrite/' + viewPageno).update({
				status: '해결'
			})
			location.reload();
			firebase.database().ref('history/' + viewPageno).push({
				historyType: historyType,
				user: user.uid,
				date: date,
				historytext: historytext
			})
			break;
		}
	})


	$(document).ready(function () {
		firebase.database().ref("qnaWrite/" + viewPageno).on('value', function (snapshot) {
			$('#writeTime').text(snapshot.val().date);
			if(snapshot.val().division == "call"){
				firebase.database().ref('users/' + snapshot.val().writeUser).on('value', function(snapshot1){
					$('#writeUser').text(snapshot1.val().username);
				})
			} else {
				firebase.database().ref('clients/' + snapshot.val().writeUser).on('child_added', function(snapshot2){
					$('#writeUser').text(snapshot2.val().clientName);
				})
			}
		})
		firebase.database().ref("qnaWrite/" + viewPageno).on('value', function (snapshot) {
			firebase.database().ref('accept/' + viewPageno).on('value', function(snapshot1){
				$('#viewAccept').append('<div class="text-muted">접수자: <i class="fa fa-user"></i>&ensp;' + snapshot1.val().AcceptName + '</div>' +
						'<div class="text-muted"><i class="fa fa-clock-o"></i>&ensp;' + snapshot1.val().AcceptDate + '</div>');
			})
		})
		$('#replyButton').append('<a href="#/index/form_call_record_modify?no=' + viewPageno + '" target="_blank" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 작성</a>' +
								 '<a id="replyDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
		firebase.database().ref("reply/" + viewPageno).on('value', function (snapshot1) {
			
			if (snapshot1.val().replyName != '') {
				$('#replyButton').children().remove();
				$('#viewReply').append('<div class="text-muted"><i class="fa fa-user"></i>&ensp;' + snapshot1.val().replyName + '</div>' +
					'<div class="text-muted"><i class="fa fa-clock-o"></i>&ensp;' + snapshot1.val().replyDate + '</div>'
				);
				
				$('#replyButton').append('<a href="#/index/form_call_record_modify?no=' + viewPageno + '&Rno=' + snapshot1.key + '" target="_blank" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
				'<a id="replyDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');

			} else {
				$('#viewReply').text('');
				
				
			}
		})
	})

	function addComment(commentImg, commentDate, commentName, comment, post) {
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

	$('#uploadComment').click(function () {
		var user = firebase.auth().currentUser;
		var commentImg = user.photoURL;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth() + 1;
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

	$(document).ready(function () {
		firebase.database().ref("comment/").orderByChild('post').equalTo(viewPageno).on('child_added', function (snapshot) {
			firebase.database().ref("comment/" + snapshot.key).on('value', function (snapshot1) {
				$('#commentArea').append('<a class="pull-left">' +
					'<img alt="image" src="' + snapshot1.val().commentImg + '">' +
					'</a>' +
					'<div class="media-body">' +
					'<a>' + snapshot1.val().commentName +
					'</a>&nbsp;' +
					'<small class="text-muted">' + snapshot1.val().commentDate + '</small>' +
					'<br/>' + snapshot1.val().comment +
					'<br/>' +
					'</div><br>');
			});
		});
	})

	$('#viewButton').append('<a href="#/index/form_call_record?no=' + viewPageno + '" id="viewModify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
		'<a id="viewDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');

	$(document).on('click', '#replyDelete', function () {
		swal({
				title: "정말 삭제하시겠습니까?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function (isConfirm) {
				if (isConfirm) {
					var replyRef = firebase.database().ref('reply/' + viewPageno);
					replyRef.remove();
					location.reload();
					swal("삭제되었습니다.", "Your imaginary file has been deleted.", "success");
				} else {
					swal("취소되었습니다.", "Your imaginary file is safe :)", "error");
				}
			});
	});
	
	$(document).on('click', '#viewDelete', function () {
		swal({
				title: "정말 삭제하시겠습니까?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes",
				cancelButtonText: "No",
				closeOnConfirm: false,
				closeOnCancel: false
			},
			function (isConfirm) {
				if (isConfirm) {
					var today = new Date();
					var year = today.getFullYear();
					var month = today.getMonth() + 1;
					var day = today.getDate();
					var hour = today.getHours();
					var minutes = today.getMinutes();
					
					var postRef = firebase.database().ref('qnaWrite/' + viewPageno);
					var replyRef = firebase.database().ref('reply/' + viewPageno);
					firebase.database().ref('accept/' + viewPageno).remove();
					
					firebase.database().ref('timePosts/' + month + '/' + day + '/' + hour + '/' + viewPageno).remove();
					firebase.database().ref('monthPosts/' + year + '/' + month + '/' + day + '/' + viewPageno).remove();
					firebase.database().ref('history/' + viewPageno).remove();

					postRef.remove();
					replyRef.remove();
					window.location.hash = 'index/call_list';

					swal("삭제되었습니다.", "deleted.", "success");
				} else {
					swal("취소되었습니다.", "safe :)", "error");
				}
			});
	});
})