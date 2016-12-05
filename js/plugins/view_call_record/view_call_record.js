function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var viewPageno = getParameterByName('no');


$('#viewYeta').hide();
$('#viewAcademy').hide();
$('#viewConsulting').hide();

$(document).ready(function(){
	firebase.database().ref('posts/' + viewPageno).on('value', function(snapshot){
		$('#viewCompany').text(snapshot.val().postCompany);
		$('#viewTitle').text(snapshot.val().title);
		$('#viewCustomer').text(snapshot.val().postCustomer);
		$('#viewCall').text(snapshot.val().postCusPhone);
		
		var client = [];
		var comClient = $('#viewCompany').text();
		firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
			firebase.database().ref("company/" + snapshot.key + "/client").on('value', function(snapshot1){
				client.push(snapshot1.val());
				for(var i=0; i<=client[0].length; i++){
					if(client[0][i] == 'yeta'){
						$('#viewYeta').show();
					}
					else if(client[0][i] == 'academy'){
						$('#viewAcademy').show();
					}
					else if(client[0][i] == 'consulting'){
						$('#viewConsulting').show();
					} 
				}
			})
		})
	})
})

$('#viewTaxLaw').hide();
$('#viewType1').hide();
$('#viewSystem').hide();
$('#viewType2').hide();
$('#viewEmployment').hide();
$('#viewType3').hide();
$('#viewEtc').hide();
$('#viewType4').hide();

$(document).ready(function(){
	firebase.database().ref('posts/' + viewPageno + '/postType').on('value', function(snapshot){
		if(snapshot.val() == '세법'){
			$('#viewTaxLaw').show();
			$('#viewType1').show();
		} else if(snapshot.val() == '시스템'){
			$('#viewSystem').show();
			$('#viewType2').show();
		} else if(snapshot.val() == '운용'){
			$('#viewEmployment').show();
			$('#viewType3').show();
		} else if(snapshot.val() == '기타'){
			$('#viewEtc').show();
			$('#viewType4').show();
		}
	})
	
	firebase.database().ref('posts/' + viewPageno + '/tags').on('value', function(snapshot){
		var tags = [];
		tags.push(snapshot.val());
		for(var i=0; i<=tags[0].length; i++){
			if(tags[0][i] != undefined)
			$('.tag-list').append('<li><a href=""><i class="fa fa-tag"></i>' + tags[0][i] + '</a></li>');
		}
	})
	
	firebase.database().ref('posts/' + viewPageno + '/text').on('value', function(snapshot){
		$('#viewText').text(snapshot.val());
	})
	
	firebase.database().ref('posts/' + viewPageno).on('value', function(snapshot){
		firebase.storage().ref('files/' + snapshot.val().uploadfile).getDownloadURL().then(function(url){
			$('#viewFile').append('<div class="file-box">' +
                                  '<div class="file">' + 
                                  '<a href="' + url + '">' + 
                                  '<span class="corner"></span>' + 
                                  '<div class="image">' + 
                                  	'<img alt="file" class="img-responsive" src="' + url + '">' + 
                                  '</div>' + 
                                  '<div class="file-name">' + snapshot.val().uploadfile +
                                  '<br/>' +
                                  '<small>Added: ' + snapshot.val().postDate + '</small>' +
                                  '</div>' +
                                  '</a>' +
                                  '<div>' +
                                  '</div>' +
                                  '<div class="clearfix"></div>');
		});
	})
	
	function addAccept(name, post, date){
		var acceptData = {
				name: name,
				post: post,
				date: date
		}
		
		var newAcceptKey = firebase.database().ref().child('accept').push().key;
		
		var updates = {};
		updates['/accept/' + newAcceptKey] = acceptData;
		
		return firebase.database().ref().update(updates);
	}
	
	$('#postAccept').click(function(){
		var name = firebase.auth().currentUser.displayName;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var date = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var post = viewPageno;

		addAccept(name, post, date);
	})
	
	$(document).ready(function(){
		firebase.database().ref("accept/").orderByChild('post').equalTo(viewPageno).on('child_added', function(snapshot){
			firebase.database().ref("accept/" + snapshot.key).on('value', function(snapshot1){
				if(snapshot.key != null){
					$('#viewAccept').text('접수: ' + snapshot1.val().name +
										  ' (' + snapshot1.val().date + ')');
					$("#postAccept").attr( "disabled", "disabled" );
					$('#postAccept').unbind('click');
				}
			})
		})
	})
	
	function addComment(commentImg, commentDate, commentName, comment, post){
		var commentData = {
				commentImg: commentImg,
				commentDate: commentDate,
				commentName: commentName,
				comment: comment,
				post: post
		}
		
		var newCommentKey = firebase.database().ref().child('comment').push().key;
		
		var updates = {};
		updates['/comment/' + newCommentKey] = commentData;
		
		return firebase.database().ref().update(updates);
	}
	
	$('#uploadComment').click(function(){
		var user = firebase.auth().currentUser;
		var commentImg = user.photoURL;
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();
		var hour = today.getHours();
		var minutes = today.getMinutes();
		var commentDate = year + '.' + month + '.' + day + ' ' + hour + ':' + minutes;
		var commentName = user.displayName;
		var comment = $('#comment').val();
		var post = viewPageno
		
		addComment(commentImg, commentDate, commentName, comment, post);
		
		$('#comment').val('');
	})
	
	$(document).ready(function(){
		firebase.database().ref("comment/").orderByChild('post').equalTo(viewPageno).on('child_added', function(snapshot){
			firebase.database().ref("comment/" + snapshot.key).on('value', function(snapshot1){
			$('#commentArea').append('<a class="pull-left">' +
	                                 '<img alt="image" src="' + snapshot1.val().commentImg + '">' +
	                                 '</a>' +
	                                 '<div class="media-body">' +
	                                 '<a>' + snapshot1.val().commentName +
	                                 '</a>' +
	                                 '<small class="text-muted">'+ snapshot1.val().commentDate +'</small>' +
	                                 '<br/>' + snapshot1.val().comment +
	                                 '<br/>' +
	                                 '</div><br>');
			});
		});
	})
	
	firebase.auth().onAuthStateChanged(function(user) {
		var userId = firebase.auth().currentUser;
		firebase.database().ref('user-posts/' + userId.uid + '/' + viewPageno).on('value', function(snapshot){
			if(snapshot.val() != null){
				$('#viewButton').append('<a href="#/index/form_call_record_modify?no=' + viewPageno + '" id="viewModify" class="btn btn-white btn-sm" title="Reply"><i class="fa fa-pencil"></i> 수정</a>' +
										'<a id="viewDelete" class="btn btn-white btn-sm" data-toggle="tooltip" data-placement="top" title="Move to trash"><i class="fa fa-trash-o"></i> 삭제</a>');
			}
			console.log(snapshot.val());
		})
	});
	
	$('#viewDelete').click(function(){
	firebase.database().ref('posts/' + viewPageno).remove(function(snapshot){
			console.log('삭제');
		})
	})
})