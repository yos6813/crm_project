/**
 * INSPINIA - Responsive Admin Theme
 * 2.6.2
 *
 * Custom scripts
 */

function userAlert(user){
	firebase.database().ref('userAlert/').limitToFirst(5).on('child_added', function(snapshot){
		firebase.database().ref('userAlert/' + snapshot.key  + '/' + user.uid).on('value', function(snapshot2){
			if(snapshot2.val() != null){
				if(snapshot2.val().check == '확인안함'){
					var replyDate = snapshot2.val().replyDay;
			    	var replyDate1 = replyDate.split(' ');
			    	var replyDate2 = replyDate1[0].split('.');
			    	var replyDate3 = replyDate1[1].split(':');
			    	var replyDate4 = new Date(replyDate2[0], replyDate2[1]-1, replyDate2[2], replyDate3[0], replyDate3[1]).getTime() / 1000;
			    	
			    	var now = new Date().getTime() / 1000;
			    	var gap = now - replyDate4;
			    	
			    	var hour = parseInt(gap / 3600);
					var day = parseInt(hour / 24);
					
					$('#userAlert').prepend('<li class="alertChild">' +
										   '<div class="dropdown-messages-box">' +
										   '<a ui-sref="profile" class="pull-left">' +
										   '<img alt="image" class="img-circle" src="' + snapshot2.val().replyPhoto + '">' +
										   '</a>' +
										   '<div>' +
										   '<strong>' + snapshot2.val().replyTitle + '</strong><br>' +
										   '<strong>' + snapshot2.val().replyUserName + '</strong> replied.<br>' +
										   '<small class="text-muted">' + day + ' days ago at '+ replyDate1[1] + ' - ' + replyDate1[0] + '</small>' +
										   '</div>' +
										   '</div>' +
										   '</li>' +
										   '<li class="divider"></li>');
					
					$('.alertNum').text($('#userAlert').children('.alertChild').size());
					
					$(document).on('click', '.alertChild', function(){
						location.hash = '#/index/view_call_record?no=' + snapshot2.val().replyPost;
						
						firebase.database().ref('userAlert/' + snapshot2.val().replyPost + '/' + user.uid).update({
							check: '확인'
						})
					})
				}
			}
		})
	})
	firebase.database().ref('userAlert/').orderByChild('check').equalTo('확인안함').on('value', function(snapshot){
		if(snapshot.numChildren() == '0'){
			$('#userAlert').children('.noM').remove();
			$('#userAlert').prepend('<p class="noM">There is no new message</p>' + '<li class="noM divider"></li>');
		}
	})
}

$(window).load(function() {
	$(".se-pre-con").fadeOut("slow");
})

$(document).ready(function () {
	$('#login').click(function(){
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);

		firebase.auth().onAuthStateChanged(function(user) {
			if(user){
				firebase.database().ref('user-infos/' + user.uid).on('value', function(snapshot){
					if(snapshot.val() != null){
						window.location.hash = 'index/chart';
						$('#navUserName').text(user.displayName);
						$('#navprofileImg').attr('src', user.photoURL);
						firebase.database().ref('user-infos/' + user.uid).once('child_added', function(snapshot1){
							firebase.database().ref('user-infos/' + user.uid + '/' + snapshot1.key).on('value', function(snapshot2){
								$('#navjob').text(snapshot2.val().department + ' / ' + snapshot2.val().job);
							})
						})
						userAlert(user);
					}else {
						window.location.hash = 'register';
					}
				});
			}
		})
	})
	
	
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){
			userAlert(user);

			firebase.database().ref('user-infos/' + user.uid).on('child_added', function(snapshot){
				firebase.database().ref('user-infos/' + user.uid + '/' + snapshot.key).on('value', function(snapshot2){
					$('#navjob').text(snapshot2.val().department + ' / ' + snapshot2.val().job);
				});
			});
			$('#navprofileImg').attr('src', user.photoURL);
			$('#navUserName').text(user.displayName);
		}
	})
	
    // Full height of sidebar
    function fix_height() {
        var heightWithoutNavbar = $("body > #wrapper").height() - 61;
        $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

        var navbarHeigh = $('nav.navbar-default').height();
        var wrapperHeigh = $('#page-wrapper').height();

        if(navbarHeigh > wrapperHeigh){
            $('#page-wrapper').css("min-height", navbarHeigh + "px");
        }

        if(navbarHeigh < wrapperHeigh){
            $('#page-wrapper').css("min-height", $(window).height()  + "px");
        }

        if ($('body').hasClass('fixed-nav')) {
            if (navbarHeigh > wrapperHeigh) {
                $('#page-wrapper').css("min-height", navbarHeigh  + "px");
            } else {
                $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
            }
        }

    }

    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {
                fix_height();
        }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function(){
        if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav') ) {
            $('#right-sidebar').addClass('sidebar-top');
        } else {
            $('#right-sidebar').removeClass('sidebar-top');
        }
    });

    setTimeout(function(){
        fix_height();
    });
    
	// Minimalize menu when screen is less than 768px
	$(function() {
	    $(window).bind("load resize", function() {
	        if ($(document).width() < 769) {
	            $('body').addClass('body-small')
	        } else {
	            $('body').removeClass('body-small')
	        }
	    })
	});
	
});

function logout(){
	firebase.auth().signOut();
	window.location.hash = '#/login';
	$('#navUserName').text('');
	$('#navUserEMail').text('');
}

function Clogout(){
	firebase.auth().signOut();
	window.location.hash = '#/clientLogin';
}

function systemBtn(){
	window.location.hash = '#/cIndex/postWrite?type=시스템';
}

function managementBtn(){
	window.location.hash = '#/cIndex/postWrite?type=운용';
}

function taxLawBtn(){
	window.location.hash = '#/cIndex/postWrite?type=세법';
}

function qnaList(){
	window.location.hash = '#/cIndex/qnaList?email=' + firebase.auth().currentUser.email;
}
