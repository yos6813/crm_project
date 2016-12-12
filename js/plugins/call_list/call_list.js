firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

var arr = [];

function postList(snapshot){ 
	firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			firebase.database().ref('reply/' + snapshot.key + '/' + snapshot.key).on('value', function(snapshot2){
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
			pagination(snapshot);
			var comType = snapshot1.val().companyType;
			$('#postList').each(function(){
				arr.push(snapshot.key);
				$('#postList').append('<tr class="call_list">' +
									'<td class="project-status">' +
									'<span class="label label-default">' + snapshot1.val().postState + '</span>' +
									'</td>' +
									'<td class="project-category">' +
									'<span>' + snapshot1.val().postType + '</span>' +
									'</td>' +
									'<td class="title project-title">' +
									'<a href="#/index/view_call_record?no='+ snapshot.key +'" id="listTitle">' + snapshot1.val().title + '</a>' +
									'</td>' +
									'<td class="project-title">' +
									'<a id="titleCom">' + snapshot1.val().postCompany + '</a>' +
									'<br/>' +
									'<small>' + snapshot1.val().username + '</small>' +
									'</td>' +
									'<td class="project-clientcategory" id="' + snapshot.key + '">' + 
									'</td>' +
									'<td class="project-people">' +
									'<a><img alt="image" class="img-circle" src="' + snapshot1.val().userImg + '"></a>' +
									'</td>' +
									'<td class="project-people">' +
									'<a><img alt="image" class="replyImgli img-circle" src="' + snapshot2.val().replyImg + '"></a>' +
									'</td>' +
									'<td class="project-title">' +
									'<small>접수: ' + snapshot1.val().postDate + '</small>' +
									'<br/>' +
									'<small>처리: ' + daygap + '일  ' + hourgap + '시간 ' + minutegap + '분</small>' +
									'</td>' +
									'</tr>');
				
				if($('.replyImgli').src == null || $('.replyImgli').src == undefined){
					
				}
				
				for(var i=0; i<=comType[0].length; i++){
					if(comType[0][i] == 'yeta'){
						$('#' + snapshot.key).append('<span class="badge badge-success yeta"> YETA </span>');
					} else if(comType[0][i] == 'academy'){
						$('#' + snapshot.key).append('<span class="badge badge-info academy"> ACADEMY </span>');
					} else if(comType[0][i] == 'consulting'){
						$('#' + snapshot.key).append('<span class="badge badge-warning consulting"> CONSULTING </span>');
					}
				}
				
			})
		});
	});}
var pageSize1 = 0; // startAt
var pageSize2 = 4; // endAt
var pageSize3; // limitToFirst


function pagination(snapshot) {
	console.log(snapshot.numChildren());
	console.log(pageSize3);
	console.log(snapshot.numChildren() % pageSize3);
	if(pageSize3 <= snapshot.numChildren()){
		$('#pagination').show();
		if(snapshot.numChildren() % pageSize3 >= 1){
			var obj = $('#pagination').twbsPagination({
				totalPages: (snapshot.numChildren() % pageSize3) + 1,
				visiblePages: 5,
				onPageClick: function (event, page) {
					for(var i=0; i<=$(this).children().length; i++){
						$(this).children().eq(i).click(function(){
						if($(this).text() == "Previous"){
							pageSize1 = pageSize1 - parseInt($('#sizeSel option:selected').val());
							pageSize2 = pageSize2 - parseInt($('#sizeSel option:selected').val());
							console.log("작아짐");
							console.log(page, $(this).text());
							console.info(pageSize1);
							console.info(pageSize2);
						} else if(page > $(this).text()) {
							pageSize1 = pageSize1 - parseInt($('#sizeSel option:selected').val());
							pageSize2 = pageSize2 - parseInt($('#sizeSel option:selected').val());
							console.log("작아짐");
							console.log(page, $(this).text());
							console.info(pageSize1);
							console.info(pageSize2);
						} else {
							pageSize1 = parseInt($('#sizeSel option:selected').val())  + pageSize1;
							pageSize2 = parseInt($('#sizeSel option:selected').val()) + pageSize2;
							console.log("커짐");
							console.log(page, $(this).text());
							console.info(pageSize1);
							console.info(pageSize2);
						}
						})
					}
				}
			});
		} else {
			var obj = $('#pagination').twbsPagination({
				totalPages: snapshot.numChildren() / pageSize3,
				visiblePages: 5,
				onPageClick: function (event, page) {
					for(var i=0; i<=$(this).children().length; i++){
						$(this).children().eq(i).click(function(){
							if(page > parseInt($(this).text())){
								pageSize1 = pageSize1 - parseInt($('#sizeSel option:selected').val());
								pageSize2 = pageSize2 - parseInt($('#sizeSel option:selected').val());
								console.log("작아짐");
								console.log(page, $(this).text());
								console.info(pageSize1);
								console.info(pageSize2);
							} else {
								pageSize1 = parseInt($('#sizeSel option:selected').val())  + pageSize1;
								pageSize2 = parseInt($('#sizeSel option:selected').val()) + pageSize2;
								console.log("커짐");
								console.log(page, $(this).text());
								console.info(pageSize1);
								console.info(pageSize2);
							}
						})
					}
				}
			});
		}
	} else {
		$('#pagination').hide();
	}
};

var start;
var end;
pageSize3 = parseInt($('#sizeSel option:selected').val()); // limitToFirst
$(document).ready(function(){
	
	$('#sizeSel').change(function(){
		arr = [];
		pageSize3 = parseInt($('#sizeSel option:selected').val()); // limitToFirst
		$('#postList').children('.call_list').remove();
		
		// pagination
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			pagination(snapshot);
			console.log(arr);
		})
		
		// call_list
		firebase.database().ref("posts/").orderByKey().limitToFirst(pageSize2).on("child_added", function(snapshot){
			postList(snapshot);
		});
	})
		
		//전체 리스트
		arr = [];
		firebase.database().ref("posts/").on("value", function(snapshot){
			arr.push(snapshot.key);
			pagination(snapshot);
		})
		
		firebase.database().ref("posts/").orderByKey().limitToFirst(pageSize3).on("child_added", function(snapshot){
			postList(snapshot);
		});
		
	$('#typeSelect').change(function(){
		$('#postList').children('.call_list').remove();
		arr = [];
		var select = $(this).children("option:selected").text();
		if(select == '전체'){
			arr = [];
			firebase.database().ref("posts/").on("value", function(snapshot){
				pagination(snapshot);
			});

			firebase.database().ref("posts/").on("child_added", function(snapshot){
				arr.push(snapshot.key);
			})
			
			start = arr[pageSize1];
			end = arr[pageSize2-1];
			console.log(arr);
			console.log(typeof(end), typeof(start));
			console.log(start, end);
			firebase.database().ref("posts/").orderByKey().startAt(start).limitToFirst(pageSize3).on("child_added", function(snapshot){
				postList(snapshot);
			});
		} else {
			arr = [];
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).on('value', function(snapshot){
				pagination(snapshot);
			})
			
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).on('child_added', function(snapshot){
				arr.push(snapshot.key);
			})
			
			start = arr[pageSize1];
			console.log(arr);
			console.log(typeof(start));
			console.log(start);
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).startAt(start).limitToFirst(pageSize3).on('child_added', function(snapshot){
				postList(snapshot);
			})
		}
	})
	
	$("#radio1").click(function(){
		arr = [];
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			arr.push(snapshot.key);
		})
		start = arr[pageSize1];
		end = arr[pageSize2-1];
		$('#postList').children('.call_list').remove();
		firebase.database().ref("posts/").endAt("title").on("value", function(snapshot){
			pagination(snapshot);
		})
		
		firebase.database().ref("posts/").orderByKey().startAt(start).limitToFirst(pageSize3).on("child_added", function(snapshot){
			postList(snapshot);
		});
	})
	
	$('#radio2').click(function() {
		arr = [];
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('value', function(snapshot){
			pagination(snapshot);
		})
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').limitToLast(pageSize3).on('child_added', function(snapshot){
			postList(snapshot);
		});
	})
	$('#radio3').click(function() {
		arr = [];
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').equalTo('해결').on('child_added', function(snapshot){
			pagination(snapshot);
			console.log(snapshot.numChildren());
		})
		firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').limitToLast(pageSize3).on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	$('#radio4').click(function() {
		arr = [];
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('value', function(snapshot){
			pagination(snapshot);
		})
		firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').limitToLast(pageSize3).on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	
	// 검색
	$('#searchBtn').click(function(){
		$('#postList').children('.call_list').remove();
		var searchType = $('#searchSelect').children("option:selected").val();
		var searchWord = $('#searchInput').val();
//		console.log(searchType, searchWord);
		firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchWord).limitToLast(pageSize2).on('child_added', function(snapshot){
			if(snapshot.key == null || snapshot.key == undefined){
				$('#postList').append('<span>NO RESULT</span>');
			} else {
				postList(snapshot);
			}
		})
	})
})
