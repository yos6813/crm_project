function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var cType = getParameterByName('no');

function notifyList(snapshot){
	/* 리스트 생성 */
	$('#notifyList').append('<tr class="notify_list">' +
			'<td class="project-category">' +
			'<span>' + snapshot.val().notifyType + '</span>' +
			'</td>' +
			'<td class="title project-title">' +
			'<a href="#/index/view_notify?no1=1&no='+ snapshot.key +'">' +
			snapshot.val().title + '</a>' +
			'</td>' +
			'<td class="title project-title">' + snapshot.val().date +
			'</td>');

	/* 페이지 */
	$('#nav a').remove();
	var rowsShown = 10;
	var rowsTotal = $('#notifyList').children('.notify_list').size();
	var numPages = Math.ceil(rowsTotal/rowsShown);
	for(i = 0;i < numPages;i++) {
	var pageNum = i + 1;
	$('#nav').append('<li><a rel="'+i+'">'+pageNum+'</a></li>');
	}
	$('#notifyList').children('.notify_list').hide();
	$('#notifyList').children('.notify_list').slice(0, rowsShown).show();
	$('#nav a:first').addClass('active');
	$('#nav a').bind('click', function(){
	
	$('#nav a').removeClass('active');
	$(this).addClass('active');
	var currPage = $(this).attr('rel');
	var startItem = currPage * rowsShown;
	var endItem = startItem + rowsShown;
	$('#notifyList').children('.notify_list').css('opacity','0.0').hide().slice(startItem, endItem).
	css('display','table-row').animate({opacity:1}, 300);
	});
}

$(document).ready(function(){
	$('#writebtn').hide();
	
	if(cType != ''){
		$('#writebtn').show();
	}
	
	firebase.database().ref('notify/').on('child_added', function(snapshot){
		notifyList(snapshot);
	})
})