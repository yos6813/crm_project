function clientPost(snapshot){
		$('#client_posts_user_box').show();
		$('#client_posts_user').children().remove();
		firebase.database().ref('posts/').orderByChild('cusKey').equalTo(snapshot.key).on('child_added', function(snapshot1){
			$('#client_posts_user').each(function(){
			var state;
			if(snapshot1.val().postState == '해결'){
				state = 'label-default';
			} else if(snapshot1.val().postState == '접수'){
				state = 'label-primary';
			} else if(snapshot1.val().postState == '보류'){
				state = 'label-warning';
			}
			$('#client_posts_user').append('<tr class="client_List" value="' + snapshot1.key + '">' +
										   '<td><span class="label ' + state + '">' + snapshot1.val().postState + '</span></td>' +
										   '<td>' + snapshot1.val().title + '</td>' +
										   '<td>' + snapshot1.val().postDate + '</td>' +
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

$(document).on('click', '.client_List', function(){
	location.hash = '#/index/view_call_record?no=' + $(this).attr('value');
})

$(document).ready(function(){
	$('#client_posts_user_box').hide();
	$('#client_posts_load').hide();
	firebase.database().ref('customer/').on('child_added', function(snapshot){
		$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
								 '<td>' + snapshot.val().cusName + '</td>' +
								 '<td>' + snapshot.val().cusCompany + '</td>' +
								 '<td>' + snapshot.val().cusDepartment + '</td>' +
								 '<td>' + snapshot.val().cusPosition + '</td>' +
								 '<td>' + snapshot.val().cusJob + '</td>' +
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
	
	$(document).on('click', '.clientList', function(){
		firebase.database().ref('customer/' + $(this).attr('value')).on('value', function(snapshot){
			$('#client_company').text(snapshot.val().cusCompany);
			$('#client_name').text(snapshot.val().cusName);
			$('#client_department').text(snapshot.val().cusDepartment);
			$('#client_job').text(snapshot.val().cusJob + '/' + snapshot.val().cusPosition);
			
			$('#workPhone').children().remove();
			$('#mobilePhone').children().remove();
			$('#fax').children().remove();
			$('#email').children().remove();
			
			$('#workPhone').append('<i class="fa fa-phone"> </i><span style="margin-left: 1em" >' + snapshot.val().workPhone + '</span>');
			$('#mobilePhone').append('<i class="fa fa-mobile-phone"> </i><span style="margin-left: 1em" >' + snapshot.val().mobilePhone + '</span>');
			$('#fax').append('<i class="fa fa-fax"> </i><span style="margin-left: 1em" >' + snapshot.val().fax + '</span>');
			$('#email').append('<i class="fa fa-envelope"> </i><span style="margin-left: 1em" >' + snapshot.val().email + '</span>');

			$('#infoModify').remove();
			$('#userInfoBox').prepend('<button class="btn btn-default pull-right" style="color:gray" id="infoModify" value="' + snapshot.key + 
			'">수정</button>');
			
			$('#client_address').children().remove();
			$('#client_address').text('');
			firebase.database().ref('company/').orderByChild('name').equalTo($('#client_company').text()).on('child_added', function(snapshot1){
				$('#client_address').append('<i class="fa fa-map-marker"></i>' + snapshot1.val().addr);
			})
			clientPost(snapshot);
		})
		
	})
})

$(document).on('click', '#infoModify', function(){
	location.hash = '#/customer?no=' + $(this).attr('value');
})

$(document).ready(function(){
	$('#search_client').click(function(){
		$('#client_user').children('.clientList').remove();
		firebase.database().ref("customer/").on("child_added", function(snapshot){
			$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
					 '<td>' + snapshot.val().cusName + '</td>' +
					 '<td>' + snapshot.val().cusCompany + '</td>' +
					 '<td>' + snapshot.val().cusDepartment + '</td>' +
					 '<td>' + snapshot.val().cusPosition + '</td>' +
					 '<td>' + snapshot.val().cusJob + '</td>' +
					 '</tr>');
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

	$('#input_client').focus(function(){
		$('.client_searchUl li').remove();
		if($('#search_select option:selected').val() == 'cusName'){
			firebase.database().ref('customer/').on('child_added', function(snapshot){
				$('.client_searchUl').append('<li>' + snapshot.val().cusName + '</li>');
			})
		} else if($('#search_select option:selected').val() == 'cusCompany'){
			firebase.database().ref('customer/').on('child_added', function(snapshot){
				$('.client_searchUl').append('<li>' + snapshot.val().cusCompany + '</li>');
			})
		}
	})
	
function typeSelect(){
	if($('#search_select option:selected').val() == 'cusName'){
		firebase.database().ref('customer/').on('child_added', function(snapshot){
			$('.client_searchUl').append('<li>' + snapshot.val().cusName + '</li>');
		})
	} else if($('#search_select option:selected').val() == 'cusCompany'){
		firebase.database().ref('customer/').on('child_added', function(snapshot){
			$('.client_searchUl').append('<li>' + snapshot.val().cusCompany + '</li>');
		})
	}
	
	var searchInput = []; 
	$('#search_client').click(function(){
		$('#client_user').children('.clientList').remove();
		searchInput =[];
		var searchType = $('#search_select option:selected').val();
		if($('#input_client').val() != ''){
			if($('.client_searchUl').children().not($('.hideLi')).length > 1){
				searchInput.push($('.client_searchUl').children().not($('.hideLi')).eq(0).text());
				for(var i=0; i<=$('.client_searchUl').children().not($('.hideLi')).length; i ++){
					for(var j=1; j<=i; j++){
						if($('.client_searchUl').children().not($('.hideLi')).eq(i).remove() != $('.client_searchUl').children().not($('.hideLi')).eq(j).text()){
							searchInput.push($('.client_searchUl').children().not($('.hideLi')).eq(i).text());
						} else {
							$('.client_searchUl').children().not($('.hideLi')).eq(i).remove();
							searchInput.push($('.client_searchUl').children().not($('.hideLi')).eq(j).text());
						}
					}
				}
				console.log(searchInput);
			} else {
				for(var i=0; i<=$('.client_searchUl').children().not($('.hideLi')).length; i++){
					searchInput.push($('.client_searchUl').children().not($('.hideLi')).eq(i).text());
				}
			}
			$('#client_user').children('.clientList').remove();
			for(var i=0; i<=searchInput.length; i++){
				if(searchInput[i] != undefined || searchInput[i] != null){
					firebase.database().ref('customer/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function(snapshot){
						$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
			 					 '<td>' + snapshot.val().cusName + '</td>' +
								 '<td>' + snapshot.val().cusCompany + '</td>' +
								 '<td>' + snapshot.val().cusDepartment + '</td>' +
								 '<td>' + snapshot.val().cusPosition + '</td>' +
								 '<td>' + snapshot.val().cusJob + '</td>' +
								 '</tr>');
					})
				}
			}	
		} else {
			$('#client_user').children('.clientList').remove();
			firebase.database().ref("customer/").on("child_added", function(snapshot){
				$('#client_user').append('<tr class="clientList"  value="' + snapshot.key + '">' +
						 '<td>' + snapshot.val().cusName + '</td>' +
						 '<td>' + snapshot.val().cusCompany + '</td>' +
						 '<td>' + snapshot.val().cusDepartment + '</td>' +
						 '<td>' + snapshot.val().cusPosition + '</td>' +
						 '<td>' + snapshot.val().cusJob + '</td>' +
						 '</tr>');
			});
		}
	});
}
