function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var modifyPageno = getParameterByName('no');

/* 유형 드롭다운 옵션 추가 */
firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#writeTypeSelect').append('<option value="'+ data.val() +'">' + data.val()
				+ '</option>');
	})
})

$('#writeTypeSelect').change(function(){
	var type = $(this).val();
	$('#bigGroupli').children().remove();
	$('#bigGroupli').hide();
	$('#bigGroup').hide();
	firebase.database().ref('bigGroup/' + type).on('child_added', function(snapshot){
		$('#bigGroupli').show();
		$('#bigGroup').show();
		$('#bigGroupli').append('<option value="' + snapshot.val().bGroup + '">' + snapshot.val().bGroup + '</option>');
	})
	
	$(document).on('change', '#bigGroupli', function(){
		var type = $('#writeTypeSelect').val();
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

$(document).ready(function(){
	$('#smallGroupli').hide();
	$('#smallGroup').hide();
	
	$('#bigGroupli').hide();
	$('#bigGroup').hide();
	if(modifyPageno != ''){
		firebase.database().ref('/qnaWrite/' + modifyPageno).on('value', function(snapshot){
			$('#customerIn').val(snapshot.val().userName);
			$('#bigGroupli').remove();
			$('#smallGroupli').remove();
			$('#bigGroup').remove();
			$('#smallGroup').remove();
			$('#title').val(snapshot.val().title);
			$('#postText').summernote('code', snapshot.val().text);
			$('#writeTypeSelect').val(snapshot.val().type);
			$('#fileInput').text(snapshot.val().file);
			$('#cusKey').text(snapshot.val().user);
			
			
			firebase.database().ref('clients/' + snapshot.val().user).orderByKey().on('child_added', function(snapshot1){
				firebase.database().ref('company/' + snapshot1.val().company).on('value', function(snapshot2){
					$('.companySel').val(snapshot2.val().name);
				})
				$('#phoneSec').append('<tr>' +
						'<td>직장전화</td>' +
						'<td id="workPhone">'+ snapshot1.val().clientWorkPhone + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>휴대전화</td>' +
						'<td id="phone">'+ snapshot1.val().clientPhone + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>팩스</td>' +
						'<td id="fax">'+ snapshot1.val().clientFax + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>이메일</td>' +
						'<td id="userEmail">'+ snapshot1.val().clientEmail + '</td>' +
						'</tr>');
			})
		})
	}
	
	$('#client_search').hideseek({hidden_mode: true});
	firebase.database().ref('clients/').orderByKey().on('child_added', function(snapshot1){
		firebase.database().ref('clients/' + snapshot1.key).orderByKey().on('child_added', function(snapshot){
			firebase.database().ref('company/' + snapshot.val().company).on('value', function(snapshot2){
				$('.client_searchList').append('<li class="list-item" style="display: none;"><a value="' + snapshot1.key + '">' + 
						snapshot.val().clientName + '(' + snapshot2.val().name + ')' + '</a></li>');
			})
		})
	})
	
	$('.sap').hide();
	$('.cloud').hide();
	$('.onpremises').hide();

	$('#cusKey').hide();
	$(document).on('click', '.client_searchList a', function(){
		$('.sap').hide();
		$('.cloud').hide();
		$('.onpremises').hide();
		$('#cusKey').text($(this).attr('value'));
		$('#phoneSec').children().remove();
		firebase.database().ref('clients/' + $(this).attr('value')).orderByKey().on('child_added', function(snapshot){
			firebase.database().ref('company/' + snapshot.val().company).on('value', function(snapshot2){
				$('#cusKey').text($(this).attr('value'));
				$('#customerIn').val(snapshot.val().clientName);
				$('.companySel').val(snapshot2.val().name);
				$('#phoneSec').append('<tr>' +
						'<td>직장전화</td>' +
						'<td id="workPhone">'+ snapshot.val().clientWorkPhone + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>휴대전화</td>' +
						'<td id="phone">'+ snapshot.val().clientPhone + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>팩스</td>' +
						'<td id="fax">'+ snapshot.val().clientFax + '</td>' +
						'</tr>' +
						'<tr>' +
						'<td>이메일</td>' +
						'<td id="userEmail">'+ snapshot.val().clientEmail + '</td>' +
						'</tr>');
				
					if (snapshot2.val().sap == '1') {
						$('.sap').show();
					}
					if (snapshot2.val().cloud == '1') {
						$('.cloud').show();
					}
					if (snapshot2.val().onpremises == '1') {
						$('.onpremises').show();
					}
			})
		})
	})
})

// 글 등록

function addPost(user, userEmail, bigGroup, smallGroup, title, text, file, date, type, status, company, userName, userId, replyName, officer, replyText, replyImg,
		AcceptName,AcceptDate,AcceptUserId, division, writeUser){
	var postData = {
			user: user,
			userEmail: userEmail,
			bigGroup: bigGroup,
			smallGroup: smallGroup,
			title: title,
			text: text,
			file: file,
//			tag: tag,
			date: date,
			type: type,
			status: status,
			company: company,
			userName: userName,
			officer: officer,
			division: division,
			writeUser: writeUser
	};
	
	var acceptData = {
			AcceptDate: AcceptDate,
			AcceptUserId: AcceptUserId,
			AcceptName: AcceptName,
	};
	
	var replyData = {
			userId: userId,
			replyDate: date,
			replyName: replyName,
			replyText: replyText,
			replyImg: replyImg
	};
	
	var newPostKey = firebase.database().ref().child('posts').push().key;
	var todayMonth;
	if(new Date().getMonth() == 12){
		todayMonth = 1;
	} else {
		todayMonth = new Date().getMonth() + 1;
	}
	
	var updates = {};
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
	updates['/accept/' + newPostKey] = acceptData;
	updates['/reply/' + newPostKey] = replyData;
	
	return firebase.database().ref().update(updates);
}

// 태그 등록

//function addtags(tag){
//	var tagData = {
//			tag: tag
//	}
//	
//	var newTagKey = firebase.database().ref().child('tags').push().key;
//	
//	var updates = {};
//	updates['/tags/' + newTagKey] = tagData;
//	
//	return firebase.database().ref().update(updates);
//}

$('#postCancel').click(function () {
        window.location.hash = '#/index/call_list'
});

// 파일 업로드

var auth = firebase.auth();
var storageRef = firebase.storage().ref();
var file = [];

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
	  document.getElementById('fileButton').addEventListener('change', handleFileSelect, false);

 // 글 저장

	  
$('#postSave').click(function(){
	var title = $('#title').val();
	var text = $('#postText').summernote('code');
	var tags = [];
	var tag = '';
	var type = $('#writeTypeSelect').val();
	var today = new Date();
	var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
//	var date = today.getFullYear() + (today.getMonth()+1) + today.getDate() + today.getHours() + today.getMinutes();
	var user = $('#cusKey').text();
	var file = [];
	var bigGroup = $('#bigGroupli').val();
	var smallGroup = '';
	var officer;
	var AcceptName = firebase.auth().currentUser.displayName;
	var AcceptDate = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
	var AcceptUserId = $('#cusKey').text();
	var division = 'call';
	var writeUser = firebase.auth().currentUser.uid;
	
	smallGroup = $('#smallGroupli').val();
	
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			file.push($('#fileInput').children().eq(i).text());
		}
	}
	
	var userEmail = $('#userEmail').text();
	var status = '접수';
	var company = $('#selCompany').val();
	
		firebase.database().ref('clients/' + $('#cusKey').text()).on('child_added', function(snapshot1){
			firebase.database().ref('company/' + snapshot1.val().company).on('value', function(snapshot2){
				officer = snapshot2.val().officer;
			})
		})
	
	var userId = '';
	var replyName = '';
	var replyText = '';
	var replyImg = '';
	var userName = $('#customerIn').val();
	
		if(modifyPageno != ''){
			firebase.database().ref('qnaWrite/' + modifyPageno).update({
				company: company,
				file: file,
				status: status,
				text: text,
				title: title,
				type: type,
				user: user,
				userEmail: userEmail,
				userName: userName,
				user: user,
				officer: officer
			})
		} else {
			addPost(user, userEmail, bigGroup, smallGroup, title, text, file, date, type, status, company, userName, userId, replyName, officer, replyText, replyImg,AcceptName,AcceptDate,AcceptUserId
					,division, writeUser);
		}
	
	window.location.hash = 'index/call_list';
})

$('.tagsinput').tagsinput({
    tagClass: 'label label-primary'
});

$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true                  // set focus to editable area after initializing summernote
});
