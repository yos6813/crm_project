firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var start = getParameterByName('startPage');
var end = getParameterByName('endPage');


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
									'<a><img alt="image" class="replyImgli img-circle" src="' + snapshot2.val().replyImg + '"></a>' +
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

var pageSize1;
var pageSize2;

function pagination(snapshot) {
	console.log(snapshot.numChildren());
	console.log(pageSize3);
	console.log(snapshot.numChildren() % pageSize3);
	if(pageSize3 <= snapshot.numChildren()){
		$('#pagination').show();
		if(snapshot.numChildren() % pageSize3 >= 1){
			var obj = $('#pagination').twbsPagination({
				totalPages: Math.ceil(snapshot.numChildren() / pageSize3),
				visiblePages: 5,
				onPageClick: function (event, page) {
					for(var i=0; i<=$(this).children().length; i++){
						$(this).children().eq(i).click(function(){
							alert($(this).text());
						})
					}
				}
			})
		} else {
			var obj = $('#pagination').twbsPagination({
				totalPages: snapshot.numChildren() / pageSize3,
				visiblePages: 5,
				onPageClick: function (event, page) {
					for(var i=0; i<=$(this).children().length; i++){
						$(this).children().eq(i).click(function(){
							
						})
					}
				}
			})
		}
	} else {
		$('#pagination').hide();
	}
};



$(document).ready(function(){
	
//	this.bigTotalItems = 175;
//    this.bigCurrentPage = 1;
//    this.maxSize = 5;
	
    pageSize3 = parseInt($('#sizeSel option:selected').val()); // limitToFirst
	$('#sizeSel').change(function(){
		pageSize3 = parseInt($('#sizeSel option:selected').val()); // limitToFirst
		$('#postList').children('.call_list').remove();
		
		// call_list
		firebase.database().ref("posts/").orderByKey().on("child_added", function(snapshot){
			postList(snapshot);
		});
	})
	//전체 리스트
	firebase.database().ref("posts/").on("child_added", function(snapshot){
		postList(snapshot);
	});
		
	$('#typeSelect').change(function(){
		$('#postList').children('.call_list').remove();
		var select = $(this).children("option:selected").text();
		if(select == '전체'){
			firebase.database().ref("posts/").on("child_added", function(snapshot){
				postList(snapshot);
			});
		} else {
			firebase.database().ref("posts/").orderByChild('postType').equalTo(select).on('child_added', function(snapshot){
				postList(snapshot);
			})
		}
	})
	
	$("#radio1").click(function(){
		$('#postList').children('.call_list').remove();
		firebase.database().ref("posts/").on("child_added", function(snapshot){
			postList(snapshot);
		});
	})
	
	$('#radio2').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('child_added', function(snapshot){
			postList(snapshot);
		});
	})
	$('#radio3').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	$('#radio4').click(function() {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('child_added', function(snapshot){
			postList(snapshot);
		})
	})
	
	// 검색
	$('#searchBtn').click(function(){
		$('#postList').children('.call_list').remove();
		var searchType = $('#searchSelect').children("option:selected").val();
		var searchWord = $('#searchInput').val();
		firebase.database().ref('posts/').orderByChild(searchType).equalTo(searchWord).on('child_added', function(snapshot){
				postList(snapshot);
		})
	})
	
	$('#pagination').after('<div id="nav" class="text-center container"></div>');
	var rowsShown = 5;
	var rowsTotal = $('#postList').children('.call_list').length;
	var numPages = Math.ceil(rowsTotal/rowsShown);
	console.log(rowsShown);
	for(i = 0;i < numPages;i++) {
		var pageNum = i + 1;
		$('#nav').append('<a href="#" rel="'+i+'">'+pageNum+'</a> ');
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
		$('#postList').children('tr').css('opacity','0.0').hide().slice(startItem, endItem).
		css('display','table-row').animate({opacity:1}, 300);
	});
})
