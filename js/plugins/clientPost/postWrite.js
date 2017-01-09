function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var writeType = getParameterByName('type');
var no = getParameterByName('no');

$('.tagsinput').tagsinput({
    tagClass: 'label label-primary'
});

$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true                  // set focus to editable area after initializing summernote
});

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
	 
function postAdd(user, bigGroup, smallGroup, title, text, file, tag, date, type, status, company, userId, userName, replyDate, replyName, replyText, replyImg){
	var postData = {
			user: user,
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
			userName: userName
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
	$('#fileInput').children().remove();
	$('#qnaText').summernote('code', '');
	$('#qnaTitle').val('');
	
	if(writeType == 'taxLaw')
		$('#writeType').text('세법');
	else if(writeType == 'system')
		$('#writeType').text('시스템');
	else if(writeType == 'management')
		$('#writeType').text('운용')
		
	$('#qnaSave').click(function(){
		var user = firebase.auth().currentUser.uid;
		firebase.database().ref('clients/' + user).on('child_added', function(snapshot){
			checkUnload = false;
			var title = $('#qnaTitle').val();
			var text = $('#qnaText').summernote('code');
			var file = [];
			var tag = [];
			var today = new Date();
			var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
			var status = '접수';
			var company = snapshot.val().companyName;
			var userName = snapshot.val().clientName;
			var type = $('#writeType').text();
			var bigGroup = '';
			var smallGroup = '';
			
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
			
			if(title != '' && text != ''){
				postAdd(user, bigGroup, smallGroup, title, text, file, tag, date, type, status, company, userId, userName, replyDate, replyName, replyText, replyImg);
				location.hash = '#/cIndex/qnaList?no=' + user;
			}
		})
	})
	
	var type = $('#writeType').text();
	firebase.database().ref('bigGroup/' + type).on('child_added', function(snapshot){
			$('#bigGroupli').append('<option value="' + snapshot.val().bGroup + '">' + snapshot.val().bGroup + '</option>');
	})
	
	
	
	$(document).on('click', '#bigGroupli option', function(){
		var type = $('#writeType').text();
		$('#smallGroupli').children().remove();
		firebase.database().ref('smallGroup/' + type + '/' + $(this).val()).on('child_added', function(snapshot){
			$('#smallGroupli').append('<option value="' + snapshot.val().sGroup + '">' + snapshot.val().sGroup + '</option>');
		})
	})
})