$(document).ready(function(){
	firebase.database().ref('company/').on('child_added', function(snapshot){
		$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '">' +
								 '<td>' + snapshot.val().name + '</td>' +
								 '<td>' + snapshot.val().corporate + '</td>' +
								 '<td>' + snapshot.val().license + '</td>' +
								 '<td id="' + snapshot.key + '"></td>' +
								 '</tr>');
		
		var comType = snapshot.val().client;
		
		for(var i=0; i<=comType.length; i++){
			if(comType[i] == 'yeta'){
				$('#' + snapshot.key).append('<span class="badge badge-success yeta"> YETA </span>');
			} else if(comType[i] == 'academy'){
				$('#' + snapshot.key).append('<span class="badge badge-info academy"> ACADEMY </span>');
			} else if(comType[i] == 'consulting'){
				$('#' + snapshot.key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
			}
		}
		
		//pagination
		$('#company_nav a').remove();
		var rowsShown = 9;
		var rowsTotal = $('#company_list').children('.company_list1').size();
		var numPages = Math.ceil(rowsTotal/rowsShown);
		for(i = 0;i<numPages;i++) {
			var pageNum = i + 1;
			$('#client_nav').append('<li><a rel="'+i+'">'+pageNum+'</a></li>');
		}
		$('#company_list').children('.company_list1').hide();
		$('#company_list').children('.company_list1').slice(0, rowsShown).show();
		$('#company_nav a:first').addClass('active');
		$('#company_nav a').bind('click', function(){
			
			$('#company_nav a').removeClass('active');
			$(this).addClass('active');
			var currPage = $(this).attr('rel');
			var startItem = currPage * rowsShown;
			var endItem = startItem + rowsShown;
			$('#company_list').children('.company_list1').css('opacity','0.0').hide().slice(startItem, endItem).
			css('display','table-row').animate({opacity:1}, 300);
		});
	})
	$(document).on('click', '.company_list1', function(){
		var comType;
		$('#company_Type').children().remove();
		firebase.database().ref('company/' + $(this).attr('value')).on('value', function(snapshot){
			$('#company_Name').text(snapshot.val().name);
			$('#company_Coporate').text('사업자: ' + snapshot.val().corporate);
			$('#company_license').text('법인: ' + snapshot.val().license);
			
			if(snapshot.val().client != undefined){
				comType = snapshot.val().client;
			}
			for(var i=0; i<comType.length; i++){
				if(comType[i] == 'yeta'){
					$('#company_Type').append('<span class="badge badge-success yeta"> YETA </span>');
					
				} else if(comType[i] == 'academy'){
					$('#company_Type').append('<span class="badge badge-info academy"> ACADEMY </span>');
				} else if(comType[i] == 'consulting'){
					$('#company_Type').append('<span class="badge badge-warning consulting"> CONSULTING </span>');
				}
			}
			$('#company_addr').children().remove();
			$('#company_addr').text('');
			$('#company_addr').append('<i class="fa fa-map-marker"></i>' + snapshot.val().addr);
		})
	})
})

$(document).ready(function(){
	$('#search_company').click(function(){
		$('#company_list').children('.company_list1').remove();
		firebase.database().ref("company/").on("child_added", function(snapshot){
			$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '">' +
					 '<td>' + snapshot.val().name + '</td>' +
					 '<td>' + snapshot.val().corporate + '</td>' +
					 '<td>' + snapshot.val().license + '</td>' +
					 '<td id="' + snapshot.key + '"></td>' +
					 '</tr>');

			var comType = snapshot.val().client;
			
			for(var i=0; i<=comType.length; i++){
				if(comType[i] == 'yeta'){
					$('#' + snapshot.key).append('<span class="badge badge-success yeta"> YETA </span>');
				} else if(comType[i] == 'academy'){
					$('#' + snapshot.key).append('<span class="badge badge-info academy"> ACADEMY </span>');
				} else if(comType[i] == 'consulting'){
					$('#' + snapshot.key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
				}
			}
		});
	});
	typeSelect();

	$('#input_company').hideseek({
		  hidden_mode: true,
	});
	
	$('#input_company').change(function(){
		$('.company_searchUl li').remove();
		typeSelect();
	})
});

	$('.company_searchUl').hide();

	$('#input_company').focus(function(){
		$('.company_searchUl li').remove();
		if($('#search_company option:selected').val() == 'name'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().name + '</li>');
			})
		} else if($('#search_company option:selected').val() == 'corporate'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().corporate + '</li>');
			})
		} else if($('#search_company option:selected').val() == 'license'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().license + '</li>');
			})
		}
	})
	
function typeSelect(){
		$('.company_searchUl li').remove();
		if($('#search_company option:selected').val() == 'name'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().name + '</li>');
			})
		} else if($('#search_company option:selected').val() == 'corporate'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().corporate + '</li>');
			})
		} else if($('#search_company option:selected').val() == 'license'){
			firebase.database().ref('company/').on('child_added', function(snapshot){
				$('.company_searchUl').append('<li>' + snapshot.val().license + '</li>');
			})
		}
	
	var searchInput = []; 
	$('#search_company').click(function(){
		$('#company_list').children('.company_list1').remove();
		searchInput =[];
		var searchType = $('#search_company option:selected').val();
		if($('#input_company').val() != ''){
			if($('.company_searchUl').children().not($('.hideLi')).length > 1){
				searchInput.push($('.company_searchUl').children().not($('.hideLi')).eq(0).text());
				for(var i=0; i<=$('.company_searchUl').children().not($('.hideLi')).length; i ++){
					for(var j=1; j<=i; j++){
						if($('.company_searchUl').children().not($('.hideLi')).eq(i).remove() != $('.company_searchUl').children().not($('.hideLi')).eq(j).text()){
							searchInput.push($('.company_searchUl').children().not($('.hideLi')).eq(i).text());
						} else {
							$('.company_searchUl').children().not($('.hideLi')).eq(i).remove();
							searchInput.push($('.company_searchUl').children().not($('.hideLi')).eq(j).text());
						}
					}
				}
				console.log(searchInput);
			} else {
				for(var i=0; i<=$('.company_searchUl').children().not($('.hideLi')).length; i++){
					searchInput.push($('.company_searchUl').children().not($('.hideLi')).eq(i).text());
				}
			}
			$('#company_list').children('.company_list1').remove();
			for(var i=0; i<=searchInput.length; i++){
				if(searchInput[i] != undefined || searchInput[i] != null){
					firebase.database().ref('company/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function(snapshot){
						$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '">' +
								 '<td>' + snapshot.val().name + '</td>' +
								 '<td>' + snapshot.val().corporate + '</td>' +
								 '<td>' + snapshot.val().license + '</td>' +
								 '<td id="' + snapshot.key + '"></td>' +
								 '</tr>');

						var comType = snapshot.val().client;
						
						for(var i=0; i<=comType.length; i++){
							if(comType[i] == 'yeta'){
								$('#' + snapshot.key).append('<span class="badge badge-success yeta"> YETA </span>');
							} else if(comType[i] == 'academy'){
								$('#' + snapshot.key).append('<span class="badge badge-info academy"> ACADEMY </span>');
							} else if(comType[i] == 'consulting'){
								$('#' + snapshot.key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
							}
						}
					})
				}
			}	
		} else {
			$('#company_list').children('.company_list1').remove();
			firebase.database().ref("company/").on("child_added", function(snapshot){
				$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '">' +
						 '<td>' + snapshot.val().name + '</td>' +
						 '<td>' + snapshot.val().corporate + '</td>' +
						 '<td>' + snapshot.val().license + '</td>' +
						 '<td id="' + snapshot.key + '"></td>' +
						 '</tr>');

				var comType = snapshot.val().client;
				
				for(var i=0; i<=comType.length; i++){
					if(comType[i] == 'yeta'){
						$('#' + snapshot.key).append('<span class="badge badge-success yeta"> YETA </span>');
					} else if(comType[i] == 'academy'){
						$('#' + snapshot.key).append('<span class="badge badge-info academy"> ACADEMY </span>');
					} else if(comType[i] == 'consulting'){
						$('#' + snapshot.key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
					}
				}
			});
		}
	});
}
