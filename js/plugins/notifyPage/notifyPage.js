function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var cType = getParameterByName('no');

/* 고객 페이지 공지사항 리스트 생성 */
function cNotifyList(snapshot){
	$('#notifyList').append('<tr class="cnotify_list" value="' + snapshot.key + '">' + 
							'<td class="project-category">' +
							'<span>' + snapshot.val().notifyType + '</span>' +
							'</td>' +
							'<td class="title project-title">' +
							snapshot.val().title +
							'</td>' +
							'<td class="project-title">' + snapshot.val().date +
							'</td></tr>');
	
	var rowsShown = 10;
	var rowsTotal = $('#notifyList').children('.notify_list').size();
	var numPages = Math.ceil(rowsTotal / rowsShown);

	$('#notifyList').children('.notify_list').hide();
	$('#notifyList').children('.notify_list').slice(0, rowsShown).show();
	$('#pagination').bootpag({
	   total: numPages,
	   maxVisible: 10
	}).on('page', function(event, num){
		var startItem = (num-1) * rowsShown;
		var endItem = startItem + rowsShown;
		$('#notifyList').children('.notify_list').css('opacity', '0.0').hide().slice(startItem, endItem).
		css('display', 'table-row').animate({
			opacity: 1
		}, 300);
	});
}

/* 관리자 페이지 공지사항 리스트 생성 */
function notifyList(snapshot){
	$('#notifyList').append('<tr class="notify_list" value="' + snapshot.key + '">' +
			'<td class="project-category">' +
			'<span>' + snapshot.val().notifyType + '</span>' +
			'</td>' +
			'<td class="title project-title">' +
			'<a href="#/index/view_notify?no1=1&no='+ snapshot.key +'">' +
			snapshot.val().title + '</a>' +
			'</td>' +
			'<td class="project-title">' + snapshot.val().date +
			'</td>');

	/* 페이지 */
	var rowsShown = 10;
	var rowsTotal = $('#notifyList').children('.notify_list').size();
	var numPages = Math.ceil(rowsTotal / rowsShown);
	
	$('#notifyList').children('.notify_list').hide();
	$('#notifyList').children('.notify_list').slice(0, rowsShown).show();
	$('#pagination').bootpag({
		   total: numPages,
		   maxVisible: 10
		}).on('page', function(event, num){
			var startItem = (num-1) * rowsShown;
			var endItem = startItem + rowsShown;
			$('#notifyList').children('.notify_list').css('opacity', '0.0').hide().slice(startItem, endItem).
			css('display', 'table-row').animate({
				opacity: 1
			}, 300);
		});
}

/* 뷰페이지 이동(관리자) */
$(document).on('click', '.notify_list', function(){
	location.hash = '#/index/view_notify?no1=' + $(this).attr('value');
})

/* 뷰페이지 이동(고객) */
$(document).on('click', '.cnotify_list', function(){
	location.hash = '#/cIndex/view_notify?no=' + $(this).attr('value');
})

$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if(!user){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('#writebtn').hide();
	$('#notifyList').children('.notify_list').remove();
	
	/* 관리자 */
	if(cType != ''){
		$('#writebtn').show();
		firebase.database().ref('notify/').on('child_added', function(snapshot){
			notifyList(snapshot);
			$('#typeSelect').change(function(){
				$('#notifyList').children('.notify_list').remove();
				var select = $(this).children("option:selected").text();
				if(select == '전체'){
					firebase.database().ref("notify/").on("child_added", function(snapshot){
						notifyList(snapshot);
					});
				} else {
					firebase.database().ref("notify/").orderByChild('notifyType').equalTo(select).on('child_added', function(snapshot){
						notifyList(snapshot);
					})
				}
			})
		})
	} else {
		/* 고객 */
		firebase.database().ref('notify/').on('child_added', function(snapshot){
			cNotifyList(snapshot);
			$('#typeSelect').change(function(){
				$('#notifyList').children('.cnotify_list').remove();
				var select = $(this).children("option:selected").text();
				if(select == '전체'){
					firebase.database().ref("notify/").on("child_added", function(snapshot){
						cNotifyList(snapshot);
					});
				} else {
					firebase.database().ref("notify/").orderByChild('notifyType').equalTo(select).on('child_added', function(snapshot){
						cNotifyList(snapshot);
					})
				}
			})
		})
	}
})