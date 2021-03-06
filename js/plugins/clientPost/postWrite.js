function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var writeType = getParameterByName('type');
var no = getParameterByName('no');

/* summernote 설정 */
$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true,                  // set focus to editable area after initializing summernote
    toolbar: [
    // [groupName, [list of button]]
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']]
  ]
});

var auth = firebase.auth();
var storageRef = firebase.storage().ref();
var file = [];

/* 첨부파일 저장 */
function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  
  for(var i=0; i<=evt.target.files.length; i++){
	  if(evt.target.files[i] != undefined && evt.target.files.length > 0){
		  file = evt.target.files[i];
		  
		  var metadata = {
			  'contentType': file.type,
			  'name': file.name
		  };
		  
		  storageRef.child('files/' + file.name).put(file, metadata).then(function(snapshot) {
			  var url = snapshot.metadata.downloadURLs[i];
			  $('#fileInput').append('<span class="fileName">' +  snapshot.metadata.name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		  })
		  
		  storageRef.child('files/' + file.name).put(file).on('state_changed', function progress(snapshot) {
			   var per = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
			   $('#file_loader').css('width', per + '%');
		   })
	  } else if(evt.target.files[i] != undefined && evt.target.files.length == 0){
		  file = evt.target.files[0];
		  
		  var metadata = {
				  'contentType': file.type
		  };
		  
		  storageRef.child('files/' + file.name).put(file, metadata).then(function(snapshot) {
			  var url = snapshot.metadata.downloadURLs[0];
			  $('#fileInput').append('<span class="fileName">' +  file.name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		  })
		  
		  storageRef.child('files/' + file.name).put(file).on('state_changed', function progress(snapshot) {
		   var per = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
		   $('#file_loader').css('width', per + '%');
		   })
	  }
  }
}

/* 파일 저장 버튼 이벤트 핸들러 */
document.getElementById('fileButton').addEventListener('change', handleFileSelect, false);
	 
/* post save function */
function postAdd(user, officer, userEmail, bigGroup, smallGroup, title, text, file, tag, date, type, status, company, userId, userName, replyDate, replyName, replyText, replyImg
				 , division, writeUser){
	var postData = {
			user: user,
			officer: officer,
			userEmail: userEmail,
			bigGroup: bigGroup,
			smallGroup: smallGroup,
			title: title,
			text: text,
			file: file,
			tag: tag,
			date: date,
			type: type,
			status: status,
			company: company,
			userName: userName,
			division: division,
			writeUser: writeUser
	}
	
	var replyData = {
			userId: userId,
			replyDate: replyDate,
			replyName: replyName,
			replyText: replyText,
			replyImg: replyImg
	}
	
	var newPostKey = firebase.database().ref().child('qnaWrite/').push().key;
	var todayMonth;
	if(new Date().getMonth() == 12){
		todayMonth = 1;
	} else {
		todayMonth = new Date().getMonth() + 1;
	}
	
	var updates = {};
	updates['/qnaWrite/' + newPostKey] = postData;
	updates['/timePosts/' + todayMonth + '/' + new Date().getDate() + '/' + new Date().getHours() + '/' + newPostKey] = postData;
	updates['/monthPosts/' + new Date().getFullYear() + '/' + todayMonth + '/' +new Date().getDate() + '/' + newPostKey] = postData;
	updates['/reply/' + newPostKey] = replyData;
	
	return firebase.database().ref().update(updates);
}

$(document).ready(function(){
	$('#smallGroup').hide();
	$('#smallGroupli').hide();
	
	$('#bigGroup').hide();
	$('#bigGroupli').hide();
	
	/* 로그인을 하지 않았을 시 로그인 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#fileInput').children().remove();
	$('#qnaText').summernote('code', '');
	$('#qnaTitle').val('');
	
	if(writeType == 'taxLaw')
		$('#writeType').text('세법');
	else if(writeType == 'system')
		$('#writeType').text('시스템');
	else if(writeType == 'management')
		$('#writeType').text('운용')
		
		
	/* 저장 버튼 */
	$('#qnaSave').click(function(){
		var user = firebase.auth().currentUser.uid;
		firebase.database().ref('clients/' + user).on('child_added', function(snapshot){
			firebase.database().ref('company/' + snapshot.val().company).on('value', function(snapshot1){
				var officer = snapshot1.val().officer;
				var title = $('#qnaTitle').val();
				var text = $('#qnaText').summernote('code');
				var file = [];
				var tag = [];
				var today = new Date();
				var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
				var status = '등록';
				var company = snapshot1.val().name;
				var userName = snapshot.val().clientName;
				var type = $('#writeType').text();
				var bigGroup = '';
				var smallGroup = '';
				var userEmail = firebase.auth().currentUser.email;
				var division = 'client';
				var writeUser = firebase.auth().currentUser.uid;
				
				if($('#bigGroupli').val() != '선택'){
					bigGroup = $('#bigGroupli').val();
				}
				
				if($('#smallGroupli').val() != ''){
					smallGroup = $('#smallGroupli').val();
				}
				
				var userId = '';
				var replyName = '';
				var replyDate = '';
				var replyName = '';
				var replyText = '';
				var replyImg = '';
				
				
				for(var i=0; i<=$('#fileInput').children().length; i++){
					if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
						file.push($('#fileInput').children().eq(i).text());
					}
				}
				
				$('.tagSel').each(function(){
					tag.push($(this).text());
				})
				
				postAdd(user, officer, userEmail, bigGroup, smallGroup, title, text, file, tag, date, type, status, company, userId, userName, replyDate, replyName, replyText, replyImg, division, writeUser);
				swal({
					title: "글을 등록하였습니다.",
					type: "success"
				});
				location.hash = '#/cIndex/qnaList?no=' + user;
				
				/* 책임자 슬랙으로 알림 전송 */
				var types = "<http://yeta.center/#/index/call_list|문의 글 리스트 가기>";
				var url;
				var channel;
				if(type == '시스템'){
					url = "https://hooks.slack.com/services/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";
				} else if(type == '세법'){
					url = "https://hooks.slack.com/services/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";
				} else if(type == '운용'){
					url = "https://hooks.slack.com/services/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";
				}
				var payload;
				if(snapshot1.val().officer != undefined){
					firebase.database().ref('user-infos/' + snapshot1.val().officer).on('child_added', function(snapshot5){
						console.log(snapshot5.val().slack);
						payload2={
								"channel": "@" + snapshot5.val().slack,
								"username": "YETA2016",
								"fields":[{
									"value": "이름: " + userName + "\n" + "제목: " + title + "\n" + types,
									"short":false
								}]
						}
						sendToSlack_(url,payload2);
					})
				} else {
					payload = {
						"attachments":[
							{
								"fallback":type + " 문의 등록",
								"pretext":type + " 문의 등록",
								"color":"#D00000",
								"fields":[{
									"value": "이름: " + userName + "\n" + "제목: " + title + "\n" + types,
									"short":false
								}]
							}
						]
					}
					sendToSlack_(url,payload)
				}
				
				
			})
		})
	})
	
	var type = $('#writeType').text();
	/* 대분류 구성 */
	firebase.database().ref('bigGroup/' + type).on('child_added', function(snapshot){
		$('#bigGroupli').show();
		$('#bigGroup').show();
			$('#bigGroupli').append('<option value="' + snapshot.val().bGroup + '">' + snapshot.val().bGroup + '</option>');
	})
	
	/* 대분류 선택 시 하위 소분류 구성 */
	$(document).on('change', '#bigGroupli', function(){
		var type = $('#writeType').text();
		$('#smallGroupli').children().remove();
		$('#smallGroupli').hide();
		$('#smallGroup').hide();
		firebase.database().ref('smallGroup/' + type + '/' + $(this).val()).on('child_added', function(snapshot){
			$('#smallGroupli').show();
			$('#smallGroup').show();
			$('#smallGroupli').append('<option value="' + snapshot.val().sGroup + '">' + snapshot.val().sGroup + '</option>');
		})
	})
})

/* webhook function */
function sendToSlack_(url,payload) {
	$.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(payload),
        dataType: "application/json",
    });
}

