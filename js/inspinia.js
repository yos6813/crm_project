/**
 * INSPINIA - Responsive Admin Theme
 * 2.6.2
 *
 * Custom scripts
 */

$(document).ready(function () {
	
	if(firebase.auth().currentUser == null){
		$('#loginBtn').text('login');
	} else {
		$('#loginBtn').text('logout');
	}
	
	$('#login').click(function(){
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);
		
		var host = window.location.host;
		firebase.auth().onAuthStateChanged(function(user) {
			if(user){
				firebase.database().ref('user-infos/' + user.uid).on('value', function(snapshot){
					if(snapshot.val() != null){
						window.location.hash = 'index/main';
					} else {
						window.location.hash = 'register';
					}
				})
			}
		});
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
	
	
