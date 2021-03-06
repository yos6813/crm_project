/**
 * INSPINIA - Responsive Admin Theme
 * 2.6.2
 *
 * Custom scripts
 */
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var no = getParameterByName('no');

/* 로그인 확인 */
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
						if(no = '0'){
							location.hash = '#/cIndex/view_qna?no=' + snapshot2.val().replyPost;
						}
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

$('img').error(function(){
	$(this).attr('src', '../../img/photo.png');
})

$(document).ready(function () {
	/* 로그인 */
	$('#login').click(function(){
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);

		firebase.auth().onAuthStateChanged(function(user) {
			if(user){
				firebase.database().ref('user-infos/' + user.uid).on('value', function(snapshot){
					if(snapshot.val() != undefined){
						window.location.hash = 'index/chart';
						$('#navUserName').text(user.displayName);
						$('#navprofileImg').attr('src', user.photoURL);
						firebase.database().ref('user-infos/' + user.uid).once('child_added', function(snapshot1){
							firebase.database().ref('user-infos/' + user.uid + '/' + snapshot1.key).on('value', function(snapshot2){
								$('#navjob').text(snapshot2.val().username + ' / ' + snapshot2.val().nickname);
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
					$('#navjob').text(snapshot2.val().username + ' / ' + snapshot2.val().nickname);
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

/* 로그아웃(관리자) */
function logout(){
	firebase.auth().signOut();
	window.location.hash = '#/login';
	$('#navUserName').text('');
	$('#navUserEMail').text('');
}

/* 로그아웃(고객) */
function Clogout(){
	firebase.auth().signOut();
	window.location.hash = '#/clientLogin';
}

/* 시스템 문의 */
function systemBtn(){
	window.location.hash = '#/cIndex/postWrite?type=system';
	location.reload();
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
}

/* 운용 문의 */
function managementBtn(){
	window.location.hash = '#/cIndex/postWrite?type=management';
	location.reload();
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
}

/* 세법 문의 */
function taxLawBtn(){
	window.location.hash = '#/cIndex/postWrite?type=taxLaw';
	location.reload();
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
}

/* 문의 리스트 */
function qnaList(){
	window.location.hash = '#/cIndex/qnaList?no=' + firebase.auth().currentUser.uid;
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
}

/* 공지사항 리스트 */
function notifyPage(){
	window.location.hash = '#/cIndex/notifyPage';
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
}

/* 리스트 새로고침 */
function reload1(){
	window.location.hash = '#/index/call_list';
	$('href').fadeIn('slow');
}

function reload2(){
	window.location.hash = '#/index/webQnAlist';
	$('href').fadeIn('slow');
}

function reload3(){
	window.location.hash = '#/index/callQnAlist';
	$('href').fadeIn('slow');
}
