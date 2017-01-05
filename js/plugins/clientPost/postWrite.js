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
	 
function postAdd(user, title, text, file, tag, date, type, status){
	var postData = {
			user: user,
			title: title,
			text: text,
			file: file,
			tag: tag,
			date: date,
			type: type,
			status: status
	}
	
	var newPostKey = firebase.database().ref().child('qnaWrite/').push().key;
	
	var updates = {};
	updates['/qnaWrite/' + newPostKey] = postData;
	
	return firebase.database().ref().update(updates);
}

$(document).ready(function(){
	$('#qnaSave').click(function(){
		var user = firebase.auth().currentUser.email;
		var title = $('#qnaTitle').val();
		var text = $('#qnaText').val();
		var file = [];
		var tag = [];
		var today = new Date();
		var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
		var type = writeType;
		var status = '접수';
		
		for(var i=0; i<=$('#fileInput').children().length; i++){
			if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
				file.push($('#fileInput').children().eq(i).text());
			}
		}
		
		$('.tagSel').each(function(){
			tag.push($(this).text());
		})
		
		if(title != '' && text != ''){
			postAdd(user, title, text, file, tag, date, type, status);
			location.hash = '#/cIndex/qnaList?no' + user;
		}
	})
})