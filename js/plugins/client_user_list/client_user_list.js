function clientPost(snapshot){
		$('#client_posts_user_box').show();
		$('#client_posts_user').children().remove();
		firebase.database().ref('qnaWrite/').orderByChild('user').equalTo(snapshot).on('child_added', function(snapshot1){
			$('#client_posts_user').each(function(){
			var state;
			if(snapshot1.val().status == '해결'){
				state = 'label-default';
			} else if(snapshot1.val().status == '접수'){
				state = 'label-primary';
			} else if(snapshot1.val().status == '등록'){
				state = 'label-info';
			} else if(snapshot1.val().status == '보류'){
				state = 'label-warning';
			}
			$('#client_posts_user').append('<tr class="client_List" value="' + snapshot1.key + '">' +
										   '<td><span class="label ' + state + '">' + snapshot1.val().status + '</span></td>' +
										   '<td>' + snapshot1.val().title + '</td>' +
										   '<td>' + snapshot1.val().date + '</td>' +
										   '</tr>');
		})
			var rowsShown = 5;
			var rowsTotal = $('#client_posts_user').children('.client_List').size();
			if(rowsTotal > rowsShown){
				$('#client_posts_load').show();
			}
			var numPages = Math.ceil(rowsTotal/rowsShown);
			$('#client_posts_user').children('.client_List').hide();
			$('#client_posts_user').children('.client_List').slice(0, rowsShown).show();
			$('#client_posts_load').bind('click', function(){
				if(rowsTotal < rowsShown){
					$('#client_posts_load').hide();
				}
				rowsShown ++;
				rowsShown ++;
				rowsShown ++;
				rowsShown ++;
				rowsShown ++;
				console.log(rowsShown);
				var endItem = rowsShown;
				$('#client_posts_user').children('.client_List').css('opacity','0.0').hide().slice(0, endItem).
				css('display','table-row').animate({opacity:1}, 300);
			});
	})
}

function clientLi(snapshot){
	firebase.database().ref('clients/' + snapshot.key).on('child_added', function(snapshot1){
		firebase.database().ref('company/' + snapshot1.val().company).on('value', function(snapshot2){
			$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
					'<td>' + snapshot1.val().clientName + '</td>' +
					'<td>' + snapshot2.val().name + '</td>' +
					'<td>' + snapshot1.val().clientDepartment + '</td>' +
					'<td>' + snapshot1.val().clientPosition + '</td>' +
			'</tr>');
			
			//pagination
			$('#client_nav a').remove();
			var rowsShown = 9;
			var rowsTotal = $('#client_user').children('.clientList').size();
			var numPages = Math.ceil(rowsTotal/rowsShown);
			for(i = 0;i < numPages;i++) {
				var pageNum = i + 1;
				$('#client_nav').append('<li><a rel="'+i+'">'+pageNum+'</a></li>');
			}
			$('#client_user').children('.clientList').hide();
			$('#client_user').children('.clientList').slice(0, rowsShown).show();
			$('#client_nav a:first').addClass('active');
			$('#client_nav a').bind('click', function(){
				
				$('#client_nav a').removeClass('active');
				$(this).addClass('active');
				var currPage = $(this).attr('rel');
				var startItem = currPage * rowsShown;
				var endItem = startItem + rowsShown;
				$('#client_user').children('.clientList').css('opacity','0.0').hide().slice(startItem, endItem).
				css('display','table-row').animate({opacity:1}, 300);
			});
		})
	})
}

$(document).on('click', '.client_List', function(){
	location.hash = '#/index/view_call_record?no=' + $(this).attr('value');
})

$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + firebase.auth().currentUser.uid).on('child_added',function(snapshot){
				if(snapshot.val().grade == '0'){
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	firebase.database().ref('clients/').on('child_added', function(snapshot){
		clientLi(snapshot);
	})
	
	$('#client_posts_user_box').hide();
	$('#client_posts_load').hide();
	
	
	$(document).on('click', '.clientList', function(){
			clientPost($(this).attr('value'));
			$('#infoModify').remove();
			$('#userInfoBox').prepend('<button class="btn btn-default pull-right" style="color:gray" id="infoModify" value="' + $(this).attr('value') + 
			'">수정</button>');
			firebase.database().ref('clients/' + $(this).attr('value')).on('child_added', function(snapshot){
				firebase.database().ref('company/' + snapshot.val().company).on('value', function(snapshot2){
				$('#client_company').text(snapshot2.val().name);
				$('#client_name').text(snapshot.val().clientName);
				$('#client_department').text(snapshot.val().clientDepartment);
				$('#client_job').text(snapshot.val().clientPosition);
				
				$('#workPhone').children().remove();
				$('#mobilePhone').children().remove();
				$('#fax').children().remove();
				$('#email').children().remove();
				
				$('#workPhone').append('<i class="fa fa-phone"> </i><span style="margin-left: 1em" >' + snapshot.val().clientWorkPhone + '</span>');
				$('#mobilePhone').append('<i class="fa fa-mobile-phone"> </i><span style="margin-left: 1em" >' + snapshot.val().clientPhone + '</span>');
				$('#fax').append('<i class="fa fa-fax"> </i><span style="margin-left: 1em" >' + snapshot.val().clientFax + '</span>');
				$('#email').append('<i class="fa fa-envelope"> </i><span style="margin-left: 1em" >' + snapshot.val().clientEmail + '</span>');
	
				$('#client_address').children().remove();
				$('#client_address').text('');
				firebase.database().ref('company/').orderByChild('name').equalTo($('#client_company').text()).on('child_added', function(snapshot1){
					$('#client_address').append('<i class="fa fa-map-marker"></i>' + snapshot1.val().addr);
				})
			})
		})
		
	})
})

$(document).on('click', '#infoModify', function(){
	location.hash = '#/customer?no=' + $(this).attr('value');
})

$(document).ready(function(){
	$('#search_client').click(function(){
		$('#client_user').children('.clientList').remove();
		firebase.database().ref("clients/").on("child_added", function(snapshot){
			clientLi(snapshot);
		});
	});
	typeSelect();

	$('#input_client').hideseek({
		  hidden_mode: true,
	});
	
	$('#search_select').change(function(){
		$('.client_searchUl li').remove();
		typeSelect();
	})
});

	$('.client_searchUl').hide();

	$('.client_searchUl li').remove();
	$('#input_client').focus(function(){
		typeSelect();
	})
	
function typeSelect() {
	if($('#search_select option:selected').val() == 'clientName'){
		firebase.database().ref('clients/').on('child_added', function(snapshot){
			firebase.database().ref('clients/' + snapshot.key).on('child_added', function(snapshot1){
				$('.client_searchUl').append('<li>' + snapshot1.val().clientName + '</li>');
			})
		})
	} else if ($('#search_select option:selected').val() == 'company') {
		firebase.database().ref('company/').on('child_added', function (snapshot) {
			$('.client_searchUl').append('<li value="' + snapshot.key + '">' + snapshot.val().name + '</li>');
		})
	} 
	
	var searchInput = '';
	$('#search_client').click(function () {
		$('#client_user').children('.clientList').remove();
		searchInput1 = '';
		searchInput = '';
		var searchType = $('#search_select option:selected').val();
		if ($('#input_client').val() != '') {
//			if ($('.client_searchUl').children().not($('.hideLi')).length > 0 && searchType == 'clientName') {
//				for (var i = 0; i <= $('.client_searchUl').children().not($('.hideLi')).length; i++) {
//					searchInput.push($('.client_searchUl').children().not($('.hideLi')).eq(i).text());
//				}
//			} else if($('.client_searchUl').children().not($('.hideLi')).length > 0 && searchType == 'company') {
//				for (var i = 0; i <= $('.client_searchUl').children().not($('.hideLi')).length; i++) {
//					searchInput1.push($('.client_searchUl').children().not($('.hideLi')).eq(i).attr('value'));
//				}
//			}
			$('#client_user').children('.clientList').remove();
				switch (searchType) {
					case 'clientName':
							firebase.database().ref('clients/').on('child_added', function (snapshot) {
								for (var i=0; i<=  $('.client_searchUl').children().not($('.hideLi')).length; i++) {
									searchInput = $('.client_searchUl').children().not($('.hideLi')).eq(i).text();
									console.log(searchInput);
									if (searchInput != undefined || searchInput != null) {
										firebase.database().ref('clients/' + snapshot.key).orderByChild('clientName').equalTo(searchInput).on('child_added', function(snapshot1){
											firebase.database().ref('company/' + snapshot1.val().company).on('value', function(snapshot2){
												$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
														'<td>' + snapshot1.val().clientName + '</td>' +
														'<td>' + snapshot2.val().name + '</td>' +
														'<td>' + snapshot1.val().clientDepartment + '</td>' +
														'<td>' + snapshot1.val().clientPosition + '</td>' +
												'</tr>');
												
												//pagination
												$('#client_nav a').remove();
												var rowsShown = 9;
												var rowsTotal = $('#client_user').children('.clientList').size();
												var numPages = Math.ceil(rowsTotal/rowsShown);
												for(i = 0;i < numPages;i++) {
													var pageNum = i + 1;
													$('#client_nav').append('<li><a rel="'+i+'">'+pageNum+'</a></li>');
												}
												$('#client_user').children('.clientList').hide();
												$('#client_user').children('.clientList').slice(0, rowsShown).show();
												$('#client_nav a:first').addClass('active');
												$('#client_nav a').bind('click', function(){
													
													$('#client_nav a').removeClass('active');
													$(this).addClass('active');
													var currPage = $(this).attr('rel');
													var startItem = currPage * rowsShown;
													var endItem = startItem + rowsShown;
													$('#client_user').children('.clientList').css('opacity','0.0').hide().slice(startItem, endItem).
													css('display','table-row').animate({opacity:1}, 300);
												});
											})
										})
									}
								}
							})
						break;
					case 'company':
						console.log(searchInput1);
						$('#client_user').children('.clientList').remove();
						for (var i = 0; i <= searchInput1.length; i++) {
							if (searchInput1[i] != undefined || searchInput1[i] != null) {
								console.log(searchInput1[i]);
								firebase.database().ref('clients/').orderByChild('company').equalTo(searchInput1[i]).on('child_added', function(snapshot){
									console.log(snapshot.key);
									clientLi(snapshot);
								})
							}
						}
						break;
				}
		} else {
			$('#client_user').children('.clientList').remove();
			firebase.database().ref("clients/").on("child_added", function(snapshot){
				clientLi(snapshot);
			})
		}
	});
}
