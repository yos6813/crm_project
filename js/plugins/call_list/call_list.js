
	$("#writebtn").click(function(){
		$('#bodyPage').load("form_call_record.html");
	});
	
	function readView(){
		$('#bodyPage').load("view_call_record.html");
	}
	
	
	



$(document).ready(function(){
	/* 유형 드롭다운 옵션 추가 */
	
//	firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
//		snapshot.forEach(function(data){
//			$('#typeSelect').append('<option ng-repeat="title in ctrl.titles" value="{{ title.key }}">' + data.val()
//					+ '</option>');
//		})
//	})
	
	$('.yeta').hide();
	$('.academy').hide();
	$('.consulting').hide();
	
	$('#postList').children().remove();
//	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
//		firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			$('#postList').append('<tr>' +
//						'<td class="project-title">' +
//						'<span>' + i + '</span>' +
//						'</td>' +
					'<td ng-controller="MyCtrl as ctrl" class="project-status">' +
					'<span class="label label-default">{{ ctrl.object.postState }}</span>' +
					'</td>' +
					'<td class="project-category">' +
					'<span>{{ title.postType }}</span>' +
					'</td>' +
					'<td class="title project-title">' +
					'<a onclick="readView()" id="{{ title.key }}">{{ title.title}}</a>' +
					'</td>' +
					'<td class="project-title">' +
					'<a id="titleCom">{{ title.postCompany }}</a>' +
					'<br/>' +
					'<small>{{ title.username }}</small>' +
					'</td>' +
					'<td class="project-clientcategory">' + 
//						'<span class="badge badge-success yeta"> YETA </span>' +
//						'<span class="badge badge-info academy"> ACADEMY </span>' +
//						'<span class="badge badge-warning consulting"> CONSULTING </span>' +
					'</td>' +
					'<td class="project-people">' +
					'<a><img alt="image" class="img-circle" src="{{ title.userImg }}"></a>' +
					'</td>' +
					'<td class="project-people">' +
					'<a><img alt="image" class="img-circle" src=""></a>' +
					'</td>' +
					'<td class="project-title">' +
					'<small>접수: {{ title.postDate }}</small>' +
					'<br/>' +
					'<small>처리: 1일 12시간 32분</small>' +
					'</td>' +
			'</tr>');
		})
//	});
//})
