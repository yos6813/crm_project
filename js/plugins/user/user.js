function messages(){
	var user = firebase.auth().currentUser;
	firebase.database().ref('userAlert/').on('child_added', function(snapshot){
		firebase.database().ref('userAlert/' + snapshot.key  + '/' + user.uid).on('value', function(snapshot2){
			var replyDate = snapshot2.val().replyDay;
	    	var replyDate1 = replyDate.split(' ');
	    	var replyDate2 = replyDate1[0].split('.');
	    	var replyDate3 = replyDate1[1].split(':');
	    	var replyDate4 = new Date(replyDate2[0], replyDate2[1]-1, replyDate2[2], replyDate3[0], replyDate3[1]).getTime() / 1000;
	    	
	    	var now = new Date().getTime() / 1000;
	    	var gap = now - replyDate4;
	    	
	    	var hour = parseInt(gap / 3600);
			var day = parseInt(hour / 24);
			var min =	parseInt((gap%3600)/60);
			var time;
			
			if(replyDate3[0] > 12){
				replyDate3[0] -= 12;
				time = 'pm';
			} else {
				time = 'am';
			}
			
			$('#messageBox').append('<div class="feed-element messageChild">' +
			                    	'<div>' +
			                        '<small class="pull-right text-navy">'+ min + 'm ago</small>' +
			                        snapshot2.val().replyUserName +
			                        '<div><a class="check" style="color:gray" href="#/index/view_call_record?no=' + snapshot2.val().replyPost +
			                        '"><strong>' + snapshot2.val().replyTitle + '</strong></a></div>' +
			                        '<small class="text-muted">' + time + ' ' + replyDate3[0] +
									' : ' + replyDate3[1] + ' - ' + replyDate1[0] + '</small>' +
			                        '<a style="color:gray" id="postLlink" ng-click="closebox()" value="' + snapshot2.val().replyPost + '">' +
			                        '<i class="pull-right fa fa-times"></i></a>' +
			                        '</div>' +
			                		'</div>');
			
			if(snapshot2.val().check == '확인안함'){
				$('.check').addClass('text-navy');
				$('.check').css('color', '');
			}
			
			$('#size').text($('#messageBox').children('.messageChild').size());
			
			$(document).on('click', '#postLlink', function(){
				location.reload();
				firebase.database().ref('userAlert/' + $(this).attr('value')).remove(); 
			})
			$(document).on('click', '.alertChild', function(){
				location.hash = '#/index/view_call_record?no=' + snapshot2.val().replyPost;
				firebase.database().ref('userAlert/' + snapshot2.val().replyPost + '/' + user.uid).update({
					check: '확인'
				})
			})
		})
	})
}

$(document).ready(function(){
	messages();
})