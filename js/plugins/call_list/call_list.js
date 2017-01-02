function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var pageType = getParameterByName('type');
var status = getParameterByName('status')

firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

function postList(key){
	firebase.database().ref('posts/' + key).on('value', function(snapshot1){
		firebase.database().ref('reply/' + key).on('value', function(snapshot2){
		var old = snapshot2.val().replyDate;
		if(old != ''){
			var replyDate1 = old.split(' ');
			var replyDate = replyDate1[0].split('.');
			var replyDate2 = replyDate1[1].split(':');
			var replyDate3 = new Date(replyDate[0], replyDate[1]-1, replyDate[2]).getTime() / 1000;
			
			var now = snapshot1.val().postDate;
			var postDate = now.split(' ');
			var postDate1 = postDate[0].split('.');
			var postDate2 = postDate[1].split(':');
			var postDate3 = new Date(postDate1[0], postDate1[1]-1, postDate1[2]).getTime() / 1000;
			
			var gap = replyDate3 - postDate3;
			var gap2 = gap / 1000;
			
			var hour = gap / 3600;
			var hourgap = replyDate2[0] - postDate2[0];
			var minutegap = replyDate2[1] - postDate2[1];
			var daygap = hour / 24;
			
			if(hourgap<0){
				hourgap += 24;
				daygap -= 1;
			}
			if(minutegap < 0){
				minutegap += 60;
				hourgap -= 1;
			}
			
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
								'<td onload="setTimeout()" class="project-title ' + key + '">' +
								'</td>' +
								'</tr>');
			/* 실시간 시간차 */
			var now = snapshot1.val().postDate;
	    	var postDate = now.split(' ');
	    	var postDate1 = postDate[0].split('.');
	    	var postDate2 = postDate[1].split(':');
	    	var postDate3 = new Date(postDate1[0], postDate1[1]-1, postDate1[2], postDate2[0], postDate2[1]).getTime() / 1000;
	    	
	    	
	    	var gap = new Date().getTime() / 1000;
	    	var gap2 = gap - postDate3;
	    	
	    	var hour = parseInt(gap2/3600);
	    	var min =	parseInt((gap2%3600)/60);
	    	var sec = gap2%60;
	    	
	    	if(snapshot1.val().postState == '접수' || snapshot1.val().postState == '보류'){
		    	$('.' + key).children().remove();
		    	$('.' + key).append('<h4>' + hour + '시간' + min + '분' + '</h4>');
	    		$('.' + key).css('color', 'red');
	    		myFunction(snapshot1, key);
			} else {
				var old = snapshot2.val().replyDate;
				var replyDate1 = old.split(' ');
				var replyDate = replyDate1[0].split('.');
				var replyDate2 = replyDate1[1].split(':');
				var replyDate3 = new Date(replyDate[0], replyDate[1]-1, replyDate[2], replyDate2[0], replyDate2[1]).getTime() / 1000;

				var replygap2 = replyDate3 - postDate3;

				var hour1 = parseInt(replygap2/3600);
				var min1 =	parseInt((replygap2%3600)/60);
				
				$('.' + key).children().remove();
				$('.' + key).append('<h4>' + hour1 + '시간' + min1 + '분' + '</h4>')
				$('.' + key).css('color', 'grey');
			}
			
			
	    	/* 회사 고객 타입 */
			for(var i=0; i<=comType[0].length; i++){
				if(comType[0][i] == 'yeta'){
					$('#' + key).append('<span class="badge badge-success yeta"> Y </span>&nbsp;');
				} else if(comType[0][i] == 'academy'){
					$('#' + key).append('<span class="badge badge-info academy"> A </span>&nbsp;');
				} else if(comType[0][i] == 'consulting'){
					$('#' + key).append('<span class="badge badge-warning consulting"> C </span>&nbsp;');
				}
			}
		})
		
		
		/* pagination */
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
})}

/* 실시간 시간차 */
function myFunction(snapshot1, key) {
    setInterval(function(){ 
    	var now = snapshot1.val().postDate;
    	var postDate = now.split(' ');
    	var postDate1 = postDate[0].split('.');
    	var postDate2 = postDate[1].split(':');
    	var postDate3 = new Date(postDate1[0], postDate1[1]-1, postDate1[2], postDate2[0], postDate2[1]).getTime() / 1000;
    	
    	var gap = new Date().getTime() / 1000;
    	var gap2 = gap - postDate3;
    	
    	var hour = parseInt(gap2/3600);
    	var min = parseInt((gap2%3600)/60);
    	var sec = gap2%60;		
    	
    	if(snapshot1.val().postState == '접수' || snapshot1.val().postState == '보류'){
    		$('.' + key).children().remove();
	    	$('.' + key).append('<h4>' + hour + '시간' + min + '분' + '</h4>');
    		$('.' + key).css('color', 'red');
    	}

    }, 3000);
}

$(document).ready(function(){
	$('#sizeSel').change(function(){
		$('#postList').children('.call_list').remove();
		
		/* 전체 리스트 */
		firebase.database().ref("posts/").orderByKey().on("child_added", function(snapshot){
			postList(snapshot.key);
		});
	})
	
	$(document).ready(function(){
		if(pageType != '' && status == ''){
			$('#postList').children('.call_list').remove();
			firebase.database().ref('posts/').orderByChild('postState').equalTo(pageType).on('child_added', function(snapshot){
				postList(snapshot.key);
			});
		} else if(status != '' && pageType != ''){
			$('#postList').children('.call_list').remove();
			firebase.database().ref('posts/').orderByChild('postState').equalTo(pageType ).on('child_added', function(snapshot){
				if(snapshot.val().postType == status){
					postList(snapshot.key);
				}
			});
		} else{
			/* 전체 리스트 */
			firebase.database().ref("posts/").on("child_added", function(snapshot){
				postList(snapshot.key);
			});
		}
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