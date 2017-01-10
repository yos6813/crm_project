function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var no = getParameterByName('no');

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

$(document).ready(function(){
	$('#smallGroup').hide();
	$('#smallGroupli').hide();
	firebase.database().ref('qnaWrite/' + no).on('value', function(snapshot){
		if(snapshot.val().smallGroup != ''){
			$('#smallGroup').show();
			$('#smallGroupli').show();
			firebase.database().ref('smallGroup/' + snapshot.val().type + '/' + snapshot.val().bigGroup).on('child_added', function(snapshot2){
				if($('#smallGroupli').val() != snapshot2.val().sGroup)
					$('#smallGroupli').append('<option value="' + snapshot2.val().sGroup + '">' + snapshot2.val().sGroup + '</option>');
			})
		}
		$('#modifyType').text(snapshot.val().type);
		$('#modifyTitle').val(snapshot.val().title);
		$('#bigGroupli').append('<option value="' + snapshot.val().bigGroup + '">' + snapshot.val().bigGroup + '</option>');
		$('#smallGroupli').append('<option value="' + snapshot.val().smallGroup + '">' + snapshot.val().smallGroup + '</option>');
		$('#modifyText').summernote('code', snapshot.val().text);
		
		if(snapshot.val().file[i] != ' ' || snapshot.val().file[i] != undefined){
			for(var i=0; i<=snapshot.val().file.length; i++){
				$('#fileInput').append('<span class="fileName">' +  snapshot.val().file[i] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;');
			}
		}
		
		firebase.database().ref('bigGroup/' + snapshot.val().type).on('child_added', function(snapshot1){
			if(snapshot.val().bigGroup != snapshot1.val().bGroup)
			$('#bigGroupli').append('<option value="' + snapshot1.val().bGroup + '">' + snapshot1.val().bGroup + '</option>');
		})
	})
})
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
$('#modifySave').click(function(){
		var user = firebase.auth().currentUser.uid;
		firebase.database().ref('clients/' + user).on('child_added', function(snapshot){
			checkUnload = false;
			var title = $('#modifyTitle').val();
			var text = $('#modifyText').summernote('code');
			var file = [];
			var today = new Date();
			var date = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
			var status = '접수';
			var company = snapshot.val().companyName;
			var userName = snapshot.val().clientName;
			var type = $('#modifyType').text();
			var bigGroup = '';
			var smallGroup = '';
			var userEmail = firebase.auth().currentUser.email;
			
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
				if($('#fileInput').children().eq(i).text() != null){
					file.push($('#fileInput').children().eq(i).text());
				}
			}
			
			firebase.database().ref('qnaWrite/' + no).update({
				bigGroup: bigGroup,
				company: company,
				date: date,
				file: file,
				smallGroup: smallGroup,
				status: status,
				text: text,
				title: title,
				type: type,
				user: user,
				userEmail: userEmail,
				userName: userName
			})
			
			
			location.hash = '#/cIndex/qnaList?no=' + user;
		})
	})


$(document).on('change', '#bigGroupli', function(){
	$('#smallGroupli').children().remove();
	$('#smallGroupli').hide();
	$('#smallGroup').hide();
	firebase.database().ref('smallGroup/' + $('#modifyType').text() + '/' + $(this).val()).on('child_added', function(snapshot2){
		$('#smallGroupli').show();
		$('#smallGroup').show();
		if($('#smallGroupli').val() != snapshot2.val().sGroup)
		$('#smallGroupli').append('<option value="' + snapshot2.val().sGroup + '">' + snapshot2.val().sGroup + '</option>');
	})
})

