/**
 * INSPINIA - Responsive Admin Theme
 * 2.6.2
 *
 * Custom scripts
 */

$(document).ready(function () {


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
    
    //customer
		var comName = [];
		firebase.database().ref("company/").orderByKey().on("child_added", function(snapshot){
			firebase.database().ref("company/" + snapshot.key + '/name').on('value', function(snapshot1){
				comName.push(snapshot1.val());
				$(".typeahead_2").typeahead({ source: comName});
			});
		});
	//call list
	
    firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
    	snapshot.forEach(function(data){
    		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
    				+ '</option>');
    	})
    })
    
    $('.yeta').hide();
	$('.academy').hide();
	$('.consulting').hide();
	
	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
		firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			$('#postList').each(function(i){
				$('#postList').append('<tr>' +
						'<td class="project-title">' +
						'</td>' +
						'<td class="project-status">' +
						'<span class="label label-default">' + snapshot1.val().postState + '</span>' +
						'</td>' +
						'<td class="project-category">' +
						'<span>' + snapshot1.val().postType + '</span>' +
						'</td>' +
						'<td class="title project-title">' +
						'<a onclick="viewPage()" value="' + snapshot.key + '">' + snapshot1.val().title + '</a>' +
						'</td>' +
						'<td class="project-title">' +
						'<a id="titleCom">' + snapshot1.val().postCompany + '</a>' +
						'<br/>' +
						'<small>' + snapshot1.val().username + '</small>' +
						'</td>' +
						'<td class="project-clientcategory">' + 
						'<span class="badge badge-success yeta"> YETA </span>' +
						'<span class="badge badge-info academy"> ACADEMY </span>' +
						'<span class="badge badge-warning consulting"> CONSULTING </span>' +
						'</td>' +
						'<td class="project-people">' +
						'<a><img alt="image" class="img-circle" src="' + snapshot1.val().userImg + '"></a>' +
						'</td>' +
						'<td class="project-people">' +
						'<a><img alt="image" class="img-circle" src=""></a>' +
						'</td>' +
						'<td class="project-title">' +
						'<small>접수: ' + snapshot1.val().postDate + '</small>' +
						'<br/>' +
						'<small>처리: 1일 12시간 32분</small>' +
						'</td>' +
				'</tr>');
				$('.yeta').hide();
				$('.academy').hide();
				$('.consulting').hide();
			})
		});
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
	
	// form call record
	
	
	//회사 autocomplete 
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
		
		/* 유형 드롭다운 옵션 추가 */
	
		firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
			snapshot.forEach(function(data){
				$('#writeTypeSelect').append('<option value="'+ data.val() +'">' + data.val()
						+ '</option>');
			})
		})
	
		$("#customerIn").keyup(function(){
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
								'<td><input type="radio" value="' + phoneSel2[i] + '" class="optionContact" name="optionsContact"></td>' +
								'<td>'+ phoneSel2[i][0] + '</td>' +
								'<td>'+ phoneSel2[i][1] + '</td>' +
								'<td class="text-right">' +
	//							'<div class="btn-group">' +
								'<button type="button" class="mod btn-white btn btn-xs" value="' + snapshot.key + '">수정</button>' +
								'<button type="button" class="del btn-white btn btn-xs" value="' + snapshot.key + '">삭제</button>' +
	//							'</div>' +
								'</td>' +
								'</tr>');
					}
				})
			});
		});
		
		
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
	
	
	
	// 글 등록
	
	function addPost(uid, title, text, tags, postCompany, postCustomer, postType, postCusPhone, postState, username, postDate, userImg, companyType, uploadfile){
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
		
		var newPostKey = firebase.database().ref().child('posts').push().key;
		
		var updates = {};
		updates['/posts/' + newPostKey] = postData;
		updates['/user-posts/' + uid + '/' + newPostKey] = postData;
		
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
	    swal({
	        title: "글 작성을 취소하시겠습니까?",
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
	
	
	// 글 저장
	
	$('#postSave').click(function(){
		var title = $('#title').val();
		var text = $('#postText').val();
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
		var uploadfile = '';
		
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
		uploadfile = $('#fileName').val();
		
		addPost(uid, title, text, tags, postCompany, postCustomer, postType, postCusPhone, postState, username, postDate, userImg, companyType, uploadfile);
		$('#bodyPage').load("call_list.html");
	})
	// 파일 업로드
	
	
	$('#fileButton').change(function handleFileSelect(evt) {
	  evt.stopPropagation();
	  evt.preventDefault();
	  var file = evt.target.files[0];
	  var uploadfile = '';
	
	  var metadata = {
	    'contentType': file.type
	  };
	
	  // Push to child path.
	  // [START oncomplete]
	  firebase.storage().ref().child('files/' + file.name).put(file, metadata).then(function(snapshot) {
	    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
	    console.log(snapshot.metadata);
	    var url = snapshot.metadata.downloadURLs[0];
	    console.log('File available at', url);
	   $('#fileInput').append('<input type="text" id="fileName" value="' +  file.name + '">');
	  }).catch(function(error) {
	    console.error('Upload failed:', error);
	  });
	})
		
		$('#fileInput').hide();
	
});