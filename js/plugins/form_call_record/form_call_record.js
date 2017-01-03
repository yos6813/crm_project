/* 유형 드롭다운 옵션 추가 */

firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#writeTypeSelect').append('<option value="'+ data.val() +'">' + data.val()
				+ '</option>');
	})
})

$(document).ready(function(){
	
	
	$('#client_search').hideseek({hidden_mode: true});
	firebase.database().ref('customer/').orderByKey().on('child_added', function(snapshot){
		$('.client_searchList').append('<li class="list-item" style="display: none;"><a value="' + snapshot.key + '">' + 
										snapshot.val().cusName + '(' + snapshot.val().cusCompany + ')' + '</a></li>');
	})
	
	$(document).on('click', '.client_searchList a', function(){
		firebase.database().ref('customer/' + $(this).attr('value')).on('value', function(snapshot){
			$('#customerIn').val(snapshot.val().cusName);
			$('.companySel').val(snapshot.val().cusCompany);
			$('.yeta').hide();
			$('.academy').hide();
			$('.consulting').hide();
			
			var client = [];
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

$('.yeta').hide();
$('.academy').hide();
$('.consulting').hide();


// 글 등록

function addPost(uid, title, text, tags, postCompany, postCustomer, yeta, academy, consulting, sap, cloud, onpremises, postCusPhone,
				 postState, username, postDate, userImg, companyType, uploadfile, userId, replyDate, replyName, replyText, replyImg, AcceptName,
				 AcceptDate, AcceptUserId, postType){
	var postData = {
		uid: uid,
		title: title,
		text: text,
		tags: tags,
		postCompany: postCompany,
		postCustomer: postCustomer,
		yeta: yeta,
		academy: academy,
		consulting: consulting,
		sap: sap,
		cloud: cloud,
		onpremises: onpremises,
		postCusPhone: postCusPhone,
		postState: postState,
		username: username,
		postDate: postDate,
		userImg: userImg,
		companyType: companyType,
		uploadfile: uploadfile,
		postType: postType
	};
	
	var replyData = {
			userId: userId,
			replyDate: replyDate,
			replyName: replyName,
			replyText: replyText,
			replyImg: replyImg
	};
	
	var acceptData = {
			AcceptName: AcceptName,
			AcceptDate: AcceptDate,
			AcceptUserId: AcceptUserId
	}
	
	var newPostKey = firebase.database().ref().child('posts').push().key;
	var todayMonth;
	if(new Date().getMonth() == 12){
		todayMonth = 1;
	} else {
		todayMonth = new Date().getMonth() + 1;
	}
	
	var updates = {};
	updates['/posts/' + newPostKey] = postData;
	updates['/user-posts/' + uid + '/' + newPostKey] = postData;
	updates['/reply/' + newPostKey] = replyData;
	updates['/timePosts/' + todayMonth + '/' + new Date().getDate() + '/' + new Date().getHours() + '/' + newPostKey] = postData;
	updates['/monthPosts/' + new Date().getFullYear() + '/' + todayMonth + '/' +new Date().getDate() + '/' + newPostKey] = postData;
 	updates['/accept/' + newPostKey] = acceptData; 
	
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
	var AcceptUserId = '';
	var AcceptDate = '';
	var AcceptName = '';
	var postCusPhone = '';
	
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
	
	var postState = '';
	$('input[type=radio][name="optionsRadios"]:checked').each(function(){
		postState = $(this).val();
		if($(this).val() == '접수'){
			AcceptUserId = firebase.auth().currentUser.uid;
			AcceptDate = postDate;
			AcceptName = username;
		} else {
			AcceptUserId = '';
			AcceptDate = '';
			AcceptName = '';
		}
	})
	
	$('.optionContact').each(function(){
		if($(this).filter(':checked').val() != undefined){
			postCusPhone = '(' + $(this).parents('tr').children('td').eq(1).text() + ') ' + $(this).filter(':checked').val();
		}
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
	
	if(title != '' && postCustomer != ''){
		addPost(uid, title, text, tags, postCompany, postCustomer, yeta, academy, consulting, sap, cloud, onpremises, postCusPhone,
				 postState, username, postDate, userImg, companyType, uploadfile, userId, replyDate, replyName, replyText, replyImg, AcceptName,
				 AcceptDate, AcceptUserId, postType);
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
