/**
 * INSPINIA - Responsive Admin Theme
 * 2.6.2
 *
 * Custom scripts
 */

$(document).ready(function () {
	$('#login').click(function(){
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);

		firebase.auth().onAuthStateChanged(function(user) {
			if(user){
				firebase.database().ref('user-infos/' + user.uid).on('value', function(snapshot){
					console.log(snapshot.val());
					if(snapshot.val() != null){
						window.location.hash = 'index/main';
						$('#navUserName').text(user.displayName);
						$('#navprofileImg').attr('src', user.photoURL);
						firebase.database().ref('user-infos/' + user.uid).once('child_added', function(snapshot1){
							firebase.database().ref('user-infos/' + user.uid + '/' + snapshot1.key).on('value', function(snapshot2){
								$('#navjob').text(snapshot2.val().department + ' / ' + snapshot2.val().job);
							})
						})
					}else {
						window.location.hash = 'register';
					}
				});
			}
		})
	})
	
	
	firebase.auth().onAuthStateChanged(function(user) {
		
		$('#navprofileImg').attr('src', user.photoURL);
		firebase.database().ref('user-infos/' + user.uid).on('child_added', function(snapshot){
			firebase.database().ref('user-infos/' + user.uid + '/' + snapshot.key).on('value', function(snapshot2){
				$('#navjob').text(snapshot2.val().department + ' / ' + snapshot2.val().job);
			});
		});
		
		$('#navUserName').text(user.displayName);
		
		$('#logout').click(function(){
			firebase.auth().signOut();
			window.location.hash = 'login';
			$('#navUserName').text('');
			$('#navUserEMail').text('');
		})
		
		$('#navlogout').click(function(){
			firebase.auth().signOut();
			window.location.hash = 'login';
			$('#navUserName').text('');
			$('#navUserEMail').text('');
		})
		
	});
	
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
	
	
