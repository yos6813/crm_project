firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

window.onpageshow = function(event) {
if (event.persisted) {
    window.location.reload() 
}
};

function postList(key){
	firebase.database().ref('posts/' + key).on('value', function(snapshot1){
		firebase.database().ref('reply/' + key + '/' + key).on('value', function(snapshot2){
		
		var old = snapshot2.val().replyDate;
		if(old != ''){
			var replyDate1 = old.split(' ');
			var replyDate = replyDate1[0].split('.');
			var replyDate2 = replyDate1[1].split(':');
			
			var now = snapshot1.val().postDate;
			var postDate = now.split(' ');
			var postDate1 = postDate[0].split('.');
			var postDate2 = postDate[1].split(':');
			
			var replyminute = replyDate2[0] * 60 + parseInt(replyDate2[1]);
			var postminute = postDate2[0] * 60 + parseInt(postDate2[1]);
			
			var postday = (postDate1[1] * 30) + parseInt(postDate1[2]);
			var replyday = (replyDate[1] * 30) + parseInt(replyDate[2]);
			
			var daygap;
			var minutegap;
			var hourgap;
		
			minutegap = (replyminute - postminute) % 60;
			hourgap = Math.floor((replyminute - postminute) / 60);
			daygap = Math.floor(replyday - postday);
			
		} else {
			daygap = '-';
			minutegap = '-';
			hourgap = '-';
		}
		
		
		var comType = snapshot1.val().companyType;
		$('#postList').each(function(){
			var state;
			if(snapshot1.val().postState == '해결'){
				state = 'label-default';
			} else if(snapshot1.val().postState == '보류'){
				state = 'label-warning';
			} else{
				state = 'label-primary';
			}
			$('#postList').append('<tr class="call_list">' +
								'<td class="project-status">' +
								'<span class="label ' + state + '">' + snapshot1.val().postState + '</span>' +
								'</td>' +
								'<td class="project-category">' +
								'<span>' + snapshot1.val().postType + '</span>' +
								'</td>' +
								'<td class="title project-title">' +
								'<a href="#/index/view_call_record?no='+ key +'" id="listTitle">' + snapshot1.val().title + '</a>' +
								'</td>' +
								'<td class="project-title">' +
								'<a id="titleCom">' + snapshot1.val().postCompany + '</a>' +
								'<br/>' +
								'<small>' + snapshot1.val().postCustomer + '</small>' +
								'</td>' +
								'<td class="project-clientcategory" id="' + key + '">' + 
								'</td>' +
								'<td class="project-people">' +
								'<a><img alt="image" class="img-circle" src="' + snapshot1.val().userImg + '"></a>' +
								'<br/>' +
								'<small>' + snapshot1.val().username + '</small>' +
								'<br/>' +
								'</td>' +
								'<td class="project-people">' +
								'<a><img alt="" class="replyImgli img-circle" src="' + snapshot2.val().replyImg + '"></a>' +
								'<br/>' +
								'<small>' + snapshot2.val().replyName + '</small>' +
								'<br/>' +
								'</td>' +
								'<td class="project-title">' +
								'<small>접수: ' + snapshot1.val().postDate + '</small>' +
								'<br/>' +
								'<small>처리: ' + daygap + '일  ' + hourgap + '시간 ' + minutegap + '분</small>' +
								'</td>' +
								'</tr>');
			
			for(var i=0; i<=comType[0].length; i++){
				if(comType[0][i] == 'yeta'){
					$('#' + key).append('<span class="badge badge-success yeta"> YETA </span>');
				} else if(comType[0][i] == 'academy'){
					$('#' + key).append('<span class="badge badge-info academy"> ACADEMY </span>');
				} else if(comType[0][i] == 'consulting'){
					$('#' + key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
				}
			}
		})
		
		//pagination
		$('#nav a').remove();
		var rowsShown = parseInt($('#sizeSel option:selected').val());
		var rowsTotal = $('#postList').children('.call_list').size();
		var numPages = Math.ceil(rowsTotal/rowsShown);
		for(i = 0;i < numPages;i++) {
			var pageNum = i + 1;
			$('#nav').append('<li><a rel="'+i+'">'+pageNum+'</a></li>');
		}
		$('#postList').children('.call_list').hide();
		$('#postList').children('.call_list').slice(0, rowsShown).show();
		$('#nav a:first').addClass('active');
		$('#nav a').bind('click', function(){
			
			$('#nav a').removeClass('active');
			$(this).addClass('active');
			var currPage = $(this).attr('rel');
			var startItem = currPage * rowsShown;
			var endItem = startItem + rowsShown;
			$('#postList').children('.call_list').css('opacity','0.0').hide().slice(startItem, endItem).
			css('display','table-row').animate({opacity:1}, 300);
		});
	});
});}

$(document).ready(function(){
	$('#sizeSel').change(function(){
		$('#postList').children('.call_list').remove();
		
		// call_list
		firebase.database().ref("posts/").orderByKey().on("child_added", function(snapshot){
			postList(snapshot.key);
		});
	})
	
	$(document).ready(function(){
		//전체 리스트
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			postList(snapshot.key);
		});
	})
	
	$('#typeSelect').change(function(){
		$('#postList').children('.call_list').remove();
		var select = $(this).children("option:selected").text();
		if(select == '전체'){
			firebase.database().ref("posts/").on("child_added", function(snapshot){
				postList(snapshot.key);
			});
		} else {
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).on('child_added', function(snapshot){
				postList(snapshot.key);
			})
		}
	})
	
	$("#radio1").click(function(){
		$('#postList').children('.call_list').remove();
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			postList(snapshot.key);
		});
	})
	
	$('#radio2').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('child_added', function(snapshot){
			postList(snapshot.key);
		});
	})
	$('#radio3').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('child_added', function(snapshot){
			postList(snapshot.key);
		})
	})
	$('#radio4').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('child_added', function(snapshot){
			postList(snapshot.key);
		})
	})
	
})
// 검색
$(document).ready(function(){
	$('#searchBtn').click(function(){
		$('#postList').children('.call_list').remove();
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			postList(snapshot.key);
		});
	});
	typeSelect();

	$('#searchInput').hideseek({
		  hidden_mode: true,
	});
	
	$('#searchSelect').change(function(){
		$('.searchUl li').remove();
		typeSelect();
	})
});

$('.searchUl').hide();

function typeSelect(){
	if($('#searchSelect option:selected').val() == 'title'){
		firebase.database().ref('posts/').on('child_added', function(snapshot){
			$('.searchUl').append('<li>' + snapshot.val().title + '</li>');
		})
	} else if($('#searchSelect option:selected').val() == 'text'){
		firebase.database().ref('posts/').on('child_added', function(snapshot){
			$('.searchUl').append('<li>' + snapshot.val().text + '</li>');
		})
	} else if($('#searchSelect option:selected').val() == 'tags'){
		firebase.database().ref('posts/').on('child_added', function(snapshot){
			if(snapshot.val().tags != undefined){
				$('.searchUl').append('<li>' + snapshot.val().tags + '</li>');
			}
		})
	} else if($('#searchSelect option:selected').val() == 'username'){
		firebase.database().ref('posts/').on('child_added', function(snapshot){
			$('.searchUl').append('<li>' + snapshot.val().username + '</li>');
		})
	}
	
	var searchInput = []; 
	var searchInput1 = [];
	$('#searchBtn').click(function(){
		$('#postList').children('.call_list').remove();
		searchInput =[];
		searchInput1 = [];
		var searchType = $('#searchSelect option:selected').val();
		if($('#searchInput').val() != ''){
			if($('.searchUl').children().not($('.hideLi')).length > 0){
				for(var i=0; i<=$('.searchUl').children().not($('.hideLi')).length; i ++){
					searchInput.push($('.searchUl').children().not($('.hideLi')).eq(i).text());
					searchInput1.push($('.searchUl').children().not($('.hideLi')).eq(i).html());
				}
			}
			switch(searchType){
			case 'text':
				$('#postList').children('.call_list').remove();
				for(var i=0; i<=searchInput1.length; i++){
					if(searchInput1[i] != undefined || searchInput1[i] != null){
						firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchInput1[i]).on('child_added', function(snapshot){
							postList(snapshot.key);
						})
					}
				}
				break;
			case 'tags':
				$('#postList').children('.call_list').remove();
				var tagsIndex = [];
				firebase.database().ref('posts/').on('child_added', function(snapshot){
					if(snapshot.val().tags != undefined){
						for(var i=0; i<=searchInput.length; i++){
							if(searchInput[i] != undefined || searchInput[i] != null || searchInput[i] != " "){
								if(snapshot.val().tags == searchInput[i]){
									postList(snapshot.key);
								}
							}
						}
					} 
				})
				break;
			case 'username':
				$('#postList').children('.call_list').remove();
				$('.searchUl').each(function(i, e){
					if(searchInput[i] != undefined || searchInput[i] != null){
						firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function(snapshot){
							postList(snapshot.key);
						})
					}
				});
				break;
			default:
				$('#postList').children('.call_list').remove();
				for(var i=0; i<=searchInput.length; i++){
					if(searchInput[i] != undefined || searchInput[i] != null){
						firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function(snapshot){
							postList(snapshot.key);
						})
					}
				}
			break;
			}	
		} else {
			$('#postList').children('.call_list').remove();
			firebase.database().ref("posts/").on("child_added", function(snapshot){
				postList(snapshot.key);
			});
		}
	});
}