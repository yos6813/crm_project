//call list
	
firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

function postList(snapshot){ 
	firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			firebase.database().ref('reply/' + snapshot.key + '/' + snapshot.key).on('value', function(snapshot2){
				console.log(snapshot1.numChildren());
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
			pagination(pageSize);
			var comType = snapshot1.val().companyType;
			$('#postList').each(function(){
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
									'<a><img alt="image" class="img-circle" src="' + snapshot2.val().replyImg + '"></a>' +
									'</td>' +
									'<td class="project-title">' +
									'<small>접수: ' + snapshot1.val().postDate + '</small>' +
									'<br/>' +
									'<small>처리: ' + daygap + '일  ' + hourgap + '시간 ' + minutegap + '분</small>' +
									'</td>' +
									'</tr>');
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

//	function pagination(){
//		var keys = Object.keys(res.data).sort();
//		var pageLength = 2;
//		var pageCount = keys.length / pageLength;
//		var currentPage = 1;
//		var promises = [];
//		var nextKey;
//		var query;
//		
//		for(var i=0; i<pageCount; i++){
//			key = keys[i * pageLength];
//			query = firebase.database().ref('posts/').orderByKey().limitToFirst(pageLength).startAt(key);
//			promises.push(query.once('value'));
//		}
//		promises.all(promises).then(function(snaps){
//			var pages = [];
//			snaps.forEach(function(snap){
//				pages.push(snap.val());
//			});
//			process.exit();
//		})
//	}

var pageSize;


function pagination(pageSize) {
	firebase.database().ref('posts/').orderByKey().on('value', function(snapshot){
		console.log(pageSize);
		
		if(pageSize <= snapshot.numChildren()){
			$('#pagination').show();
			if(snapshot.numChildren() % pageSize >= 1){
				var obj = $('#pagination').twbsPagination({
					totalPages: snapshot.numChildren() / pageSize + 1,
					visiblePages: 5,
					onPageClick: function (event, page) {
						console.info(page);
					}
				});
			} else {
				var obj = $('#pagination').twbsPagination({
					totalPages: snapshot.numChildren() / pageSize,
					visiblePages: 5,
					onPageClick: function (event, page) {
						console.info(page);
					}
				});
			}
			console.info(obj.data());
		} else {
			$('#pagination').hide();
		}
	})
};


$(document).ready(function(){
	$('a .page-link').click(function(){
		alert($(this).val());
	})
	pageSize = 4;
	$('#sizeSel').change(function(){
		pageSize = parseInt($('#sizeSel option:selected').val());
		pagination(pageSize);
	})
	
	firebase.database().ref("posts/").orderByKey().limitToLast(pageSize).on("child_added", function(snapshot){
		postList(snapshot);
	});
	
	$('#typeSelect').change(function(){
		$('#postList').children('.call_list').remove();
		var select = $(this).children("option:selected").text();
		if(select == '전체'){
			firebase.database().ref("posts/").orderByKey().endAt("title").limitToLast(pageSize).on("child_added", function(snapshot){
				console.log(snapshot.numChildren());
				postList(snapshot);
			});
		} else {
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).limitToLast(pageSize).on('child_added', function(snapshot){
				postList(snapshot);
			})
		}
	})
	
	$("#radio1").click(function(){
		$('#postList').children('.call_list').remove();
		firebase.database().ref("posts/").orderByKey().endAt("title").limitToLast(pageSize).on("child_added", function(snapshot){
			postList(snapshot);
		});
	})
	
	$('#radio2').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').limitToLast(pageSize).on('child_added', function(snapshot){
			postList(snapshot);
		});
	})
	$('#radio3').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').limitToLast(pageSize).on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	$('#radio4').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').limitToLast(pageSize).on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	
	// 검색
	$('#searchBtn').click(function(){
		$('#postList').children('.call_list').remove();
		var searchType = $('#searchSelect').children("option:selected").val();
		var searchWord = $('#searchInput').val();
		console.log(searchType, searchWord);
		firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchWord).limitToLast(pageSize).on('child_added', function(snapshot){
			if(snapshot.key == null || snapshot.key == undefined){
				$('#postList').append('<span>NO RESULT</span>');
			} else {
				postList(snapshot);
			}
		})
	})
})
