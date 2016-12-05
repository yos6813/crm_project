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

$("#customerIn").blur(function(){
	var phoneSel = $('.customerSel').val();
	var phoneSel2 = [];
	
	firebase.database().ref('customer').orderByChild('cusName').equalTo(phoneSel).on('child_added',function(snapshot){
		firebase.database().ref('customer/' + snapshot.key + '/cusPhone').on('value', function(snapshot2){
			snapshot2.forEach(function(){
				phoneSel2 = snapshot2.val();
			})
			console.log(phoneSel2)
			$('#phoneSec').children().remove();
			for(var i=0; i<=phoneSel2.length; i++){
				$('#phoneSec').append('<tr>' +
						'<td><input type="radio" value="' + phoneSel2[i][1] + '" class="optionContact" name="optionsContact"></td>' +
						'<td>'+ phoneSel2[i][0] + '</td>' +
						'<td>'+ phoneSel2[i][1] + '</td>' +
						'<td class="text-right">' +
//						'<div class="btn-group">' +
						'<button type="button" class="mod btn-white btn btn-xs" value="' + snapshot.key + '">수정</button>' +
						'<button type="button" class="del btn-white btn btn-xs" value="' + snapshot.key + '">삭제</button>' +
//						'</div>' +
						'</td>' +
						'</tr>');
			}
		})
	});
});

$('.del').click(function(){
	$(this).parent().remove();
	alert("삭제");
	firebase.database().ref('customer/' + $(this).val() + '/cusPhone').equalTo($(this).parent().children('td').text()).remove();
})

// 고객 autocomplete 
if($(".companySel").val() == null){
	var cusSel3 = [];
	firebase.database().ref("customer/").orderByKey().on("child_added", function(snapshot){
		firebase.database().ref("customer/" + snapshot.key + '/cusName').on('value', function(snapshot1){
			cusSel3.push(snapshot1.val());
			$(".customerSel").typeahead({ source: cusSel3});
		});
	});
} else {
	$(".companySel").blur(function(){
		var cusSel = $('.companySel').val();
		var cusSel2 = [];
		
		firebase.database().ref('customer').orderByChild('cusCompany').equalTo(cusSel).on('child_added',function(snapshot){
			firebase.database().ref('customer/' + snapshot.key + '/cusName').on('value', function(snapshot2){
				cusSel2.push(snapshot2.val());
				$(".customerSel").typeahead({source: cusSel2});
			})
		});
	});
}


// 회사 autocomplete 
$(document).ready(function(){
	var comSel = [];
	firebase.database().ref("company/").orderByKey().on("child_added", function(snapshot){
		firebase.database().ref("company/" + snapshot.key + '/name').on('value', function(snapshot1){
			comSel.push(snapshot1.val());
			$(".companySel").typeahead({ source: comSel});
		});
	});
	
	var tagSel = [];
	firebase.database().ref("tags/").orderByKey().endAt("tag").on("child_added", function(snapshot){
		snapshot.forEach(function(data){
			tagSel.push(data.val());
		})
		$(".tagAuto").typeahead({source: tagSel});
	});
});

$('.yeta').hide();
$('.academy').hide();
$('.consulting').hide();

$('.companySel').blur(function(){
	
	$('.yeta').hide();
	$('.academy').hide();
	$('.consulting').hide();
	
	var client = [];
	var comClient = $('.companySel').val();
	firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
		firebase.database().ref("company/" + snapshot.key + "/client").on('value', function(snapshot1){
			client.push(snapshot1.val());
			for(var i=0; i<=client[0].length; i++){
				console.log(client[0][i]);
				if(client[0][i] == 'yeta'){
					$('.yeta').show();
				}
				else if(client[0][i] == 'academy'){
					$('.academy').show();
				}
				else if(client[0][i] == 'consulting'){
					$('.consulting').show();
				} 
			}
		})
	})
})

$('#postCancel').click(function () {
    swal({
        title: "글 수정을 취소하시겠습니까?",
        text: "",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        closeOnConfirm: true
    }, function () {
        $('#bodyPage').load("call_list.html");
    });
});

// 파일 업로드

var auth = firebase.auth();
var storageRef = firebase.storage().ref();

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var file = evt.target.files[0];
  var uploadfile = '';

  var metadata = {
    'contentType': file.type
  };

  // Push to child path.
  // [START oncomplete]
  storageRef.child('files/' + file.name).put(file, metadata).then(function(snapshot) {
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
    console.log(snapshot.metadata);
    var url = snapshot.metadata.downloadURLs[0];
    console.log('File available at', url);
   $('#fileInput').append('<input type="text" id="fileName" value="' +  file.name + '">');
  }).catch(function(error) {
    console.error('Upload failed:', error);
  });
}
	
	$('#fileInput').hide();

  document.getElementById('fileButton').addEventListener('change', handleFileSelect, false);

$('.tagsinput').tagsinput({
    tagClass: 'label label-primary'
});

$('.summernote').summernote();

firebase.database().ref('posts/' + modifyPageno).on('value', function(snapshot){
	$('.companySel').val(snapshot.val().postCompany);
	$('.customerSel').val(snapshot.val().postCustomer);
	$('#title').val(snapshot.val().title);
	$('#postText').summernote('code', snapshot.val().text);
})
var companyType = [];
var tags = [];
var tag = '';
var postState = '';
var postCusPhone = '';

$('#postSave').click(function(){
	firebase.database().ref("company/" + modifyPageno + "/client").on('value', function(snapshot1){
		companyType.push(snapshot1.val());
	})
	
	for(var j=0; j<=tags.length; j++){
		if(tags[j] != undefined){
			tag = tags[j]
			addtags(tag);
		}
	}
	
	$('.tagSel').each(function(){
		tags.push($(this).text());
	})
	
	$('input[type=radio][name="optionsRadios"]:checked').each(function(){
		postState = $(this).val();
	})
	
	$('input[type=radio][name="optionsContact"]:checked').each(function(){
		postCusPhone = $(this).val();
	})
	
	console.log(companyType);
	firebase.database().ref('posts/' + modifyPageno).set({
		postCompany: $('.companySel').val(),
		postCustomer: $('.customerSel').val(),
		title: $('#title').val(),
		text: $('#postText').summernote('code'),
		postType: $('#writeTypeSelect').val(),
		companyType: companyType,
		tags: tags,
		postCusPhone: postCusPhone,
		postState: postState,
		userImg: firebase.auth().currentUser.photoURL,
		username: firebase.auth().currentUser.displayName,
		uid: firebase.auth().currentUser.uid,
		uploadfile: $('#fileName').val()
	});
	window.location.hash = 'index/view_call_record?no=' + modifyPageno;
});