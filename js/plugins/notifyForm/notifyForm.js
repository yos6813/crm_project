function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var modifyNo = getParameterByName('no');

$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true                  // set focus to editable area after initializing summernote
});

//파일 업로드
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

function addnotify(notifyType, title, text, file, date){
	
		var notifyData = {
			notifyType: notifyType,
			title: title,
			text: text,
			file: file,
			date: date
		};

	var newNotifyKey = firebase.database().ref().child('notify').push().key;
	
	var updates = {};
	updates['/notify/' + newNotifyKey] = notifyData;
	
	return firebase.database().ref().update(updates);
}

$('#Save').click(function(){
	var notifyType = $("#writeTypeSelect").val();
	var text = $('#notifyText').summernote('code');
	var title = $('#title').val();
	var today = new Date();
	var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
	var file = [];
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			file.push($('#fileInput').children().eq(i).text());
		}
	}
	addnotify(notifyType, title, text, file, date);
	location.hash = "#/index/notifyPage?no=1";
})

$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/login';
		}
	})
	
	firebase.database().ref('user-infos/').on('child_added',function(snapshot){
		if(snapshot.val().uid != firebase.auth().currentUser.uid){
			window.location.hash = '#/clientLogin';
		}
	})
	
	if(modifyNo != null){
		firebase.database().ref('notify/' + modifyNo).on('value', function(snapshot){
			$("#writeTypeSelect").val(snapshot.val().notifyType);
			$('#notifyText').summernote('code', snapshot.val().text);
			$('#title').val(snapshot.val().title);
			if(snapshot.val().file != ''){
				for(var i=0; i<snapshot.val().file.length; i++){
					$('#fileInput').append('<span class="fileName">' +  snapshot.val().file[i] + '</span>');
				}
			}
		})
	}
})