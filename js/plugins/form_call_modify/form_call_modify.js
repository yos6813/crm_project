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

/* 유형 드롭다운 옵션 추가 */

firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#writeTypeSelect').append('<option value="'+ data.val() +'">' + data.val()
				+ '</option>');
	})
})

$(document).ready(function(){
	$('#client_search_modify').hideseek({hidden_mode: true});
	firebase.database().ref('customer/').orderByKey().on('child_added', function(snapshot){
		$('.client_searchList').append('<li class="list-item" style="display:none;"><a value="' + snapshot.key + '">' + 
										snapshot.val().cusName + '(' + snapshot.val().cusCompany + ')' + '</a></li>');
	})
	
	$(document).on('click', '.client_searchList a', function(){
		firebase.database().ref('customer/' + $(this).attr('value')).on('value', function(snapshot){
			$('.customerSel').val(snapshot.val().cusName);
			$('.companySel').val(snapshot.val().cusCompany);
			$('.yeta').hide();
			$('.academy').hide();
			$('.consulting').hide();
			
			var comClient = $('.companySel').val();
			firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
				firebase.database().ref("company/" + snapshot.key).on('value', function(snapshot1){
					if(snapshot.val().yeta == '1'){
						$('.yeta').show();
					}
					if(snapshot.val().academy == '1'){
						$('.academy').show();
					}
					if(snapshot.val().consulting == '1'){
						$('.consulting').show();
					}
				})
			})
			
			var phoneSel = $('.customerSel').val();
			
			firebase.database().ref('customer').orderByChild('cusName').equalTo(phoneSel).on('child_added',function(snapshot){
				$('#phoneSec').children().remove();
					$('#phoneSec').append('<tr>' +
							'<td><input type="radio" value="' + snapshot.val().workPhone + '" name="optionContact" class="optionContact"></td>' +
							'<td>직장전화</td>' +
							'<td>'+ snapshot.val().workPhone + '</td>' +
							'</tr>' +
							'<tr>' +
							'<td><input type="radio" value="' + snapshot.val().mobilePhone + '" class="optionContact" name="optionContact"></td>' +
							'<td>휴대전화</td>' +
							'<td>'+ snapshot.val().mobilePhone + '</td>' +
							'</tr>' +
							'<tr>' +
							'<td><input type="radio" value="' + snapshot.val().fax + '" class="optionContact" name="optionContact"></td>' +
							'<td>팩스</td>' +
							'<td>'+ snapshot.val().fax + '</td>' +
							'</tr>' +
							'<tr>' +
							'<td><input type="radio" value="' + snapshot.val().email + '" class="optionContact" name="optionContact"></td>' +
							'<td>이메일</td>' +
							'<td>'+ snapshot.val().email + '</td>' +
							'</tr>');
			});
		})
	})
})

$("#customerIn").blur(function(){
	var phoneSel = $('.customerSel').val();
	
	firebase.database().ref('customer').orderByChild('cusName').equalTo(phoneSel).on('child_added',function(snapshot){
		$('#phoneSec').children().remove();
			$('#phoneSec').append('<tr>' +
					'<td><input type="radio" value="' + snapshot.val().workPhone + '" name="optionContact" class="optionContact"></td>' +
					'<td>직장전화</td>' +
					'<td>'+ snapshot.val().workPhone + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().mobilePhone + '" class="optionContact" name="optionContact"></td>' +
					'<td>휴대전화</td>' +
					'<td>'+ snapshot.val().mobilePhone + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().fax + '" class="optionContact" name="optionContact"></td>' +
					'<td>팩스</td>' +
					'<td>'+ snapshot.val().fax + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().email + '" class="optionContact" name="optionContact"></td>' +
					'<td>이메일</td>' +
					'<td>'+ snapshot.val().email + '</td>' +
					'</tr>');
	});
});

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
	
	var comClient = $('.companySel').val();
	firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
		firebase.database().ref("company/" + snapshot.key).on('value', function(snapshot1){
			if(snapshot.val().yeta == '1'){
				$('.yeta').show();
			}
			if(snapshot.val().academy == '1'){
				$('.academy').show();
			}
			if(snapshot.val().consulting == '1'){
				$('.consulting').show();
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

$('.tagsinput').tagsinput({
    tagClass: 'label label-primary'
});

$('.summernote').summernote();
$('#fileInput').hide();
firebase.database().ref('posts/' + modifyPageno).on('value', function(snapshot){
	$('.companySel').val(snapshot.val().postCompany);
	$('.customerSel').val(snapshot.val().postCustomer);
	$('#title').val(snapshot.val().title);
	$('#postText').summernote('code', snapshot.val().text);
	if(snapshot.val().uploadfile != '' || snapshot.val().uploadfile != 'x' || snapshot.val().uploadfile != undefined){
		for(var i=0; i<snapshot.val().uploadfile.length; i++){
			$('#fileInput').append('<span class="fileName">' +  snapshot.val().uploadfile[i] + '</span>');
		}
	}
})
var tags = [];
var tag = '';
var postState = '';
var postCusPhone = '';

$('#postSave').click(function(){
	var today = new Date();
	var yeta = '0';
	var academy = '0';
	var consulting = '0';
	var sap = '0';
	var cloud = '0';
	var onpremises = '0';
	var comClient = $('.companySel').val();
	firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
		firebase.database().ref("company/" + snapshot.key).on('value', function(snapshot1){
			yeta = snapshot.val().yeta;
			sap = snapshot.val().sap;
			cloud = snapshot.val().cloud;
			onpremises = snapshot.val().onpremises;
			academy = snapshot.val().academy;
			consulting = snapshot.val().consulting;
		})	
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
	
	var postCusPhone = '';
	$('.optionContact').each(function(){
		if($(this).filter(':checked').val() != undefined){
			postCusPhone = '(' + $(this).parents('tr').children('td').eq(1).text() + ') ' + $(this).filter(':checked').val();
		}
	})
	
	var uploadfile = [];
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			uploadfile.push($('#fileInput').children().eq(i).text());
		}
	}
	
	var replyText = $('#replyText').summernote('code');
	
	if(postState == '해결'){
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
			replyImg: replyImg
		})
		
		firebase.database().ref('posts/' + modifyPageno).on('value', function(snapshot){
			var replyPhoto = firebase.auth().currentUser.photoURL;
			var replyTitle = $('#title').val();
			var replyUser = firebase.auth().currentUser.uid;
			var replyDay = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
			var uid = snapshot.val().uid;
			var replyUserName = firebase.auth().currentUser.displayName;
			var replyPost = modifyPageno;
			var check = '확인안함';
			writeAlert(uid, replyPhoto, replyUser, replyDay, replyTitle, replyPost, replyUserName, check);
		})
		
	} else {
		replyText = '';
		replydate = '';
		replyName = '';
		userId = '';
		replyImg = ''
			
		firebase.database().ref('reply/' + modifyPageno).set({
			replyText: replyText,
			replyDate: replydate,
			replyName: replyName,
			userId: userId,
			replyImg: replyImg
		})
		
//		firebase.database().ref('userAlert/').orderByChild('replyPost').equalTo(modifyPageno).remove();
	}
	
	var postday;
	firebase.database().ref('posts/' + modifyPageno + '/postDate').on('value', function(snapshot){
		postday = snapshot.val();
	})
	
	var yeta = '0';
	var academy = '0';
	var consulting = '0';
	var sap = '0';
	var cloud = '0';
	var onpremises = '0';
	
	firebase.database().ref('company/').on('child_added', function(snapshot){
		yeta = snapshot.val().yeta;
		sap = snapshot.val().sap;
		cloud = snapshot.val().cloud;
		onpremises = snapshot.val().onpremises;
		academy = snapshot.val().academy;
		consulting = snapshot.val().consulting;
	})
	
	firebase.database().ref('posts/' + modifyPageno).update({
		postCompany: $('.companySel').val(),
		postCustomer: $('.customerSel').val(),
		title: $('#title').val(),
		text: $('#postText').summernote('code'),
		postType: $('#writeTypeSelect').val(),
		tags: tags,
		postCusPhone: postCusPhone,
		postState: postState,
		userImg: firebase.auth().currentUser.photoURL,
		username: firebase.auth().currentUser.displayName,
		uid: firebase.auth().currentUser.uid,
		uploadfile: uploadfile,
		postDate: postday,
		yeta: yeta,
		sap: sap,
		cloud: cloud,
		onpremises: onpremises,
		academy: academy,
		consulting: consulting
	});
	
	window.location.hash = 'index/view_call_record?no=' + modifyPageno;
});

// 회사 유형 로드
firebase.database().ref('posts/' + modifyPageno).on('value', function(snapshot){
	if(snapshot.val().yeta == '1'){
		$('.yeta').show();
	}
	if(snapshot.val().academy == '1'){
		$('.academy').show();
	}
	if(snapshot.val().consulting == '1'){
		$('.consulting').show();
	}
});

$('.summernote').summernote({
  height: 300,                 // set editor height
  minHeight: null,             // set minimum height of editor
  maxHeight: null,             // set maximum height of editor
  focus: true                  // set focus to editable area after initializing summernote
});

// 연락처 로드
$(document).ready(function(){
	var phoneSel = $('.customerSel').val();
	
	firebase.database().ref('customer').orderByChild('cusName').equalTo(phoneSel).on('child_added',function(snapshot){
		$('#phoneSec').children().remove();
			$('#phoneSec').append('<tr>' +
					'<td><input type="radio" value="' + snapshot.val().workPhone + '" name="optionContact" class="optionContact"></td>' +
					'<td>직장전화</td>' +
					'<td>'+ snapshot.val().workPhone + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().mobilePhone + '" class="optionContact" name="optionContact"></td>' +
					'<td>휴대전화</td>' +
					'<td>'+ snapshot.val().mobilePhone + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().fax + '" class="optionContact" name="optionContact"></td>' +
					'<td>팩스</td>' +
					'<td>'+ snapshot.val().fax + '</td>' +
					'</tr>' +
					'<tr>' +
					'<td><input type="radio" value="' + snapshot.val().email + '" class="optionContact" name="optionContact"></td>' +
					'<td>이메일</td>' +
					'<td>'+ snapshot.val().email + '</td>' +
					'</tr>');
	});
})