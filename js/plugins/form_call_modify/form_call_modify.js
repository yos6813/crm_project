function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var modifyPageno = getParameterByName('no');

/* user post alert */
function writeAlert(uid, replyPhoto, replyUser, replyDay, replyTitle, replyPost, replyUserName, check){
	var alertData = {
			replyPhoto: replyPhoto,
			replyUser: replyUser,
			replyDay: replyDay,
			replyTitle: replyTitle,
			replyPost: replyPost,
			replyUserName: replyUserName,
			check: check
	}
	
	var updates = {};
	updates['/userAlert/' + replyPost + '/' + uid] = alertData;
	
	return firebase.database().ref().update(updates);
}

$(document).ready(function(){
	firebase.database().ref('clients/' + firebase.auth().currentUser.uid).on('child_added',function(snapshot){
		if(snapshot.val().grade == '0'){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#clientEmail').hide();
	$('#clientTitle').hide();
	firebase.database().ref('qnaWrite/' + modifyPageno).on('value', function(snapshot){
		$('#viewClient').text(snapshot.val().userName);
		$('#viewCompany').text(snapshot.val().company);
		$('#viewTitle').text(snapshot.val().title);
		$('#viewText').append(snapshot.val().text);
		$('#clientEmail').val(snapshot.val().userEmail);
		$('#clientTitle').val(snapshot.val().title);
	})

	
	var comClient = $('#viewCompany').text();
	firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot1){
		firebase.database().ref("company/" + snapshot1.key).on('value', function(snapshot2){
			if(snapshot1.val().yeta == '1'){
				$('#viewCompany').append('<span class="badge badge-success yeta"> Y </span>');
			}
			if(snapshot1.val().academy == '1'){
				$('#viewCompany').append('<span class="badge badge-info academy"> A </span>');
			}
			if(snapshot1.val().consulting == '1'){
				$('#viewCompany').append('<span class="badge badge-warning consulting"> C </span>');
			}
		})
	})
})

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
		  }).catch(function(error) {
		  });
	  } else if(evt.target.files[i] != undefined && evt.target.files.length == 0){
		  file = evt.target.files[0];
		  
		  var metadata = {
				  'contentType': file.type
		  };
		  
		  storageRef.child('files/' + file.name).put(file, metadata).then(function(snapshot) {
			  var url = snapshot.metadata.downloadURLs[0];
			  $('#fileInput').append('<span class="fileName">' +  file.name + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
		  }).catch(function(error) {
		  });
	  }
  }
}

  document.getElementById('fileButton').addEventListener('change', handleFileSelect, false);



$('#fileInput').hide();

var postState = '';
var postCusPhone = '';

$('#replySave').click(function(){
	var today = new Date();
	var uploadfile = [];
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			uploadfile.push($('#fileInput').children().eq(i).text());
		}
	}
	
	var replyText = $('#replyText').summernote('code');
	
		replyText = $('#replyText').summernote('code');
		replydate = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
		replyName = firebase.auth().currentUser.displayName;
		userId = firebase.auth().currentUser.uid;
		replyImg = firebase.auth().currentUser.photoURL;
		
		firebase.database().ref('reply/' + modifyPageno).update({
			replyText: replyText,
			replyDate: replydate,
			replyName: replyName,
			userId: userId,
			replyImg: replyImg,
			replyFile: uploadfile
		})
		
		firebase.database().ref('qnaWrite/' + modifyPageno).on('value', function(snapshot){
			var replyPhoto = firebase.auth().currentUser.photoURL;
			var replyTitle = $('#viewTitle').text();
			var replyUser = firebase.auth().currentUser.uid;
			var replyDay = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
			var uid = snapshot.val().user;
			var replyUserName = firebase.auth().currentUser.displayName;
			var replyPost = modifyPageno;
			var check = '확인안함';
			
			writeAlert(uid, replyPhoto, replyUser, replyDay, replyTitle, replyPost, replyUserName, check);
		})
		
		firebase.database().ref('qnaWrite/' + modifyPageno).update({
			status: '해결'
		})
		
		firebase.database().ref('qnaWrite/' + modifyPageno).on('value', function(snapshot){
			emailjs.send("gmail", "template_jbvbOZH3", {
				"reply_to" : snapshot.val().userEmail,
				"to_name" : snapshot.val().userName,
				"message_html" : '#/cIndex/view_qna?no=' + modifyPageno,
				"from_name" : 'YETA2016'
			});
		})
});


$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true                  // set focus to editable area after initializing summernote
});