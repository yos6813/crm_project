//call list
	
    firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
    	snapshot.forEach(function(data){
    		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
    				+ '</option>');
    	})
    })
    
    $('.yeta').hide();
	$('.academy').hide();
	$('.consulting').hide();
	
	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
		firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			$('#postList').each(function(i){
				$('#postList').append('<tr>' +
						'<td class="project-title">' +
						'</td>' +
						'<td class="project-status">' +
						'<span class="label label-default">' + snapshot1.val().postState + '</span>' +
						'</td>' +
						'<td class="project-category">' +
						'<span>' + snapshot1.val().postType + '</span>' +
						'</td>' +
						'<td class="title project-title">' +
						'<a href="#/index/view_call_record?no='+ snapshot.key +'">' + snapshot1.val().title + '</a>' +
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
