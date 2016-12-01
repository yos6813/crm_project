
	$("#writebtn").click(function(){
		$('#bodyPage').load("form_call_record.html");
	});
	
	function readView(){
		$('#bodyPage').load("view_call_record.html");
	}
	
	
	

/* 유형 드롭다운 옵션 추가 */

firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

//넘버링에 필요한 변수
//		var listNumber, n = 0;
//		for(var i=0; i<list.size(); i++) {
//			listNumber = totalcount - (start + n)+1 ;
//			System.out.println("페이지번호:"+listNumber);
//			n++;
//		}

$(document).ready(function(){
//	$('#postList').children().remove();
	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
		firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			$('#postList').each(function(i){
				$('#postList').append('<tr>' +
						'<td class="project-title">' +
//						'<span>' + i + '</span>' +
						'</td>' +
						'<td class="project-status">' +
						'<span class="label label-default">' + snapshot1.val().postState + '</span>' +
						'</td>' +
						'<td class="project-category">' +
						'<span>' + snapshot1.val().postType + '</span>' +
						'</td>' +
						'<td class="title project-title">' +
						'<a onclick="viewPage()" value="' + snapshot.key + '">' + snapshot1.val().title + '</a>' +
						'</td>' +
						'<td class="project-title">' +
						'<a id="titleCom">' + snapshot1.val().postCompany + '</a>' +
						'<br/>' +
						'<small>' + snapshot1.val().username + '</small>' +
						'</td>' +
						'<td class="project-clientcategory">' + 
						'<span class="badge badge-success yeta"> YETA </span>' +
						'<span class="badge badge-info academy"> ACADEMY </span>' +
						'<span class="badge badge-warning consulting"> CONSULTING </span>' +
						'</td>' +
						'<td class="project-people">' +
						'<a><img alt="image" class="img-circle" src="' + snapshot1.val().userImg + '"></a>' +
						'</td>' +
						'<td class="project-people">' +
						'<a><img alt="image" class="img-circle" src=""></a>' +
						'</td>' +
						'<td class="project-title">' +
						'<small>접수: ' + snapshot1.val().postDate + '</small>' +
						'<br/>' +
						'<small>처리: 1일 12시간 32분</small>' +
						'</td>' +
				'</tr>');
				$('.yeta').hide();
				$('.academy').hide();
				$('.consulting').hide();
			})
		});
	});
})
