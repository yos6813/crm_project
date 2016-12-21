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
			$('#phoneSec').children().remove();
			for(var i=0; i<=phoneSel2.length; i++){
				if(phoneSel2[i] != null && phoneSel2[i] != undefined){
					$('#phoneSec').append('<tr>' +
							'<td><input type="radio" value="' + phoneSel2[i][1] + '" class="optionContact" name="optionsContact"></td>' +
							'<td>'+ phoneSel2[i][0] + '</td>' +
							'<td>'+ phoneSel2[i][1] + '</td>' +
							'<td class="text-right">' +
							'<button type="button" class="mod btn-white btn btn-xs" value="' + snapshot.key + '">수정</button>' +
							'<button type="button" class="del btn-white btn btn-xs" value="' + snapshot.key + '">삭제</button>' +
							'</td>' +
							'</tr>');
				} else {
					$('#phoneSec').append('<tr></tr>');
				}
			}
		})
	});
});

$(document).on('click','.del', function(){
	$(this).parents('tr').remove();
	firebase.database().ref('customer/' + $(this).val() + '/cusPhone').child().eq($(this).closest('tr').index() + 1).remove();
})

// 고객 autocomplete 
$(document).ready(function(){
	$(".customerSel").focus(function(){
		var cusSel3 = [];
		var cusSel2 = [];
		console.log($('.companySel').val());
		if($('.companySel').val() == null || $('.companySel').val() == undefined || $('.companySel').val() == ''){
			firebase.database().ref("customer/").orderByKey().on("child_added", function(snapshot){
				firebase.database().ref("customer/" + snapshot.key + '/cusName').on('value', function(snapshot1){
					cusSel3.push(snapshot1.val());
					$(".customerSel").typeahead({source: cusSel3});
				});
			});
		} else {
			var cusSel = $('.companySel').val();
			firebase.database().ref('customer').orderByChild('cusCompany').equalTo(cusSel).on('child_added',function(snapshot){
				firebase.database().ref('customer/' + snapshot.key + '/cusName').on('value', function(snapshot2){
					cusSel2.push(snapshot2.val());
					$(".customerSel").typeahead({source: cusSel2});
				})
			});
		}
	});
})

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
	var uniqueNames = [];
	firebase.database().ref("tags/").orderByKey().endAt("tag").on("child_added", function(snapshot){
		snapshot.forEach(function(data){
			tagSel.push(data.val());
		})
		
		$.each(tagSel, function(i, el){
			if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
		});
		
		$(".tagAuto").typeahead({source: uniqueNames});
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



// 글 등록

function addPost(uid, title, text, tags, postCompany, postCustomer, postType, postCusPhone,
				 postState, username, postDate, userImg, companyType, uploadfile, userId, replyDate, replyName, replyText, replyImg){
	var postData = {
		uid: uid,
		title: title,
		text: text,
		tags: tags,
		postCompany: postCompany,
		postCustomer: postCustomer,
		postType: postType,
		postCusPhone: postCusPhone,
		postState: postState,
		username: username,
		postDate: postDate,
		userImg: userImg,
		companyType: companyType,
		uploadfile: uploadfile
	};
	
	var replyData = {
			userId: userId,
			replyDate: replyDate,
			replyName: replyName,
			replyText: replyText,
			replyImg: replyImg
	};
	
	var newPostKey = firebase.database().ref().child('posts').push().key;
	
	var updates = {};
	updates['/posts/' + newPostKey] = postData;
	updates['/user-posts/' + uid + '/' + newPostKey] = postData;
	updates['/reply/' + newPostKey + '/' + newPostKey] = replyData;
	
	return firebase.database().ref().update(updates);
}



// 태그 등록

function addtags(tag){
	var tagData = {
			tag: tag
	}
	
	var newTagKey = firebase.database().ref().child('tags').push().key;
	
	var updates = {};
	updates['/tags/' + newTagKey] = tagData;
	
	return firebase.database().ref().update(updates);
}

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
		  }).catch(function(error) {
			  console.log(error)
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
			  console.log(error)
		  });
	  }
  }
}
	  document.getElementById('fileButton').addEventListener('change', handleFileSelect, false);

 // 글 저장

	 $('#replyText').val($('#replyText').val().replace(/^\s*|\s*$/g,''));
	  
$('#postSave').click(function(){
	var title = $('#title').val();
	var text = $('#postText').summernote('code');
	var tags = [];
	var tagList = [];
	var tag = '';
	var tagOverlap = '';
	var postCompany = $('.companySel').val();
	var postCustomer = $('.customerSel').val();
	var postType = $('#writeTypeSelect').val();
	var postCusPhone = '';
	var postState = '';
	var today = new Date();
	var postDate = today.getFullYear() + "." + (today.getMonth()+1) + "." + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();
	var userImg = firebase.auth().currentUser.photoURL;
	var uid = firebase.auth().currentUser.uid;
	var username = firebase.auth().currentUser.displayName;
	var uploadfile = [];
	var replyText = $('#replyText').val();
	var replyName = '';
	var replydate = '';
	var post = '';
	var replyImg = '';
	var userId = '';
	
	for(var i=0; i<=$('#fileInput').children().length; i++){
		if($('#fileInput').children().eq(i).text() != undefined && $('#fileInput').children().eq(i).text() != null){
			uploadfile.push($('#fileInput').children().eq(i).text());
		}
	}
	
	
	var companyType = [];
	var comClient = $('.companySel').val();
	firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
		firebase.database().ref("company/" + snapshot.key + "/client").on('value', function(snapshot1){
			companyType.push(snapshot1.val());
		})
	})
	
	$('input[type=radio][name="optionsRadios"]:checked').each(function(){
		postState = $(this).val();
	})
	
	$('input[type=radio][name="optionsContact"]:checked').each(function(){
		postCusPhone = $(this).val();
	})
	
	$('.tagSel').each(function(){
		tags.push($(this).text());
	})
	
	for(var j=0; j<=tags.length; j++){
		if(tags[j] != undefined){
			tag = tags[j]
			addtags(tag);
		}
	}
	
	if($('.fileName').val() == null){
		uploadfile = 'x';
	}
	
	if(replyText == ''){
		replyName = '';
		replyDate = '';
		replyText = '';
		userId = '';
		replyImg = '';
	} else {
		userId = firebase.auth().currentUser.uid;
		replyName = username;
		replyDate = postDate;
		replyText = $('#replyText').summernote('code');
		replyImg = firebase.auth().currentUser.photoURL;
	}
	
	if(title != '' && postCustomer != ''){
		addPost(uid, title, text, tags, postCompany, postCustomer, postType, postCusPhone, postState, username, postDate,
				userImg, companyType, uploadfile, userId, replyDate, replyName, replyText, replyImg);
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
