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
	  focus: true                  // set focus to editable area after initializing summernote
	});

$(document).ready(function(){
	firebase.database().ref('qnaWrite/' + no).on('value', function(snapshot){
		$('#modifyType').text(snapshot.val().type);
		$('#modifyTitle').val(snapshot.val().title);
		$('#modifyText').summernote('code', snapshot.val().text);
		if(snapshot.val().file != ''){
			$('#fileInput').append(snapshot.val().file);
		}
		
		firebase.database().ref('bigGroup/' + snapshot.val().type).on('child_added', function(snapshot1){
			$('#bigGroupli').append('<option value="' + snapshot1.val().bGroup + '">' + snapshot1.val().bGroup + '</option>');
		})
	})
})



$(document).on('change', '#bigGroupli', function(){
	$('#smallGroupli').children().remove();
	firebase.database().ref('smallGroup/' + $('#modifyType').text() + '/' + $(this).val()).on('child_added', function(snapshot2){
		$('#smallGroupli').append('<option value="' + snapshot2.val().sGroup + '">' + snapshot2.val().sGroup + '</option>');
	})
})

