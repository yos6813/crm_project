/* summernote 설정 */
$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true,                  // set focus to editable area after initializing summernote
    toolbar: [
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']],
	['insert', ['picture','link','video','table','hr']]
  ]
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

/* 공지사항 저장 function */
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

/* 글 저장 */
$('#Save').click(function(){
	var notifyType = $("#writeTypeSelect").val();
	var text = $('#notifyText').summernote('code');
	var title = $('#title').val();
	var today = new Date();
	var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
	var uploadfile = [];
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			uploadfile.push($('#fileInput').children().eq(i).text());
		}
	}
	
	addnotify(notifyType, title, text, uploadfile, date);
	
	location.hash = "#/index/notifyPage?no=1";
})

/* 작성 취소 */
$('#Cancel').click(function(){
	swal({
        title: "글 작성을 취소하시겠습니까?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        closeOnConfirm: false,
        closeOnCancel: false },
    function (isConfirm) {
        if (isConfirm) {
            swal("", "success");
            location.hash = "#/index/notifyPage?no=1";
        } else {
            swal("", "error");
        }
    });
})

$(document).ready(function(){
	/* 미로그인 시 로그인 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/login';
		}
	})
	
	var user = firebase.auth().currentUser;
	/* client 아이디로 로그인 시 client 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + user.uid).on('child_added',function(snapshot){
				if(snapshot.val().grade == '0'){
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	$('#notifyText').summernote('code', '');
	$('#title').val('');
	$('#fileInput').val('');
})