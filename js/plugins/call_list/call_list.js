//call list
	
firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function(snapshot){
	snapshot.forEach(function(data){
		$('#typeSelect').append('<option value="'+ snapshot.key +'">' + data.val()
				+ '</option>');
	})
})

$(document).ready(function(){
	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
		firebase.database().ref('posts/' + snapshot.key).on('value', function(snapshot1){
			var comType = snapshot1.val().companyType;
			$('#postList').each(function(){
				$('#postList').append('<tr>' +
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
//						'<span class="badge badge-success yeta"> YETA </span>' +
//						'<span class="badge badge-info academy"> ACADEMY </span>' +
//						'<span class="badge badge-warning consulting"> CONSULTING </span>' +
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
	});
	
//	firebase.database().ref("posts/").orderByKey().endAt("title").on("child_added", function(snapshot){
//		firebase.database().ref('posts/' + snapshot.key + '/companyType').on('value', function(snapshot1){
//			console.log(comType[0].length);
//			for(var i=0; i<=comType[0].length; i++){
//				if(comType[0].length > $('.project-clientcategory').length){
//					if(comType[0][i] == 'yeta'){
//						$('.project-clientcategory').append('<span class="badge badge-success yeta"> YETA </span>');
//					} else if(comType[0][i] == 'academy'){
//						$('.project-clientcategory').append('<span class="badge badge-info academy"> ACADEMY </span>');
//					} else if(comType[0][i] == 'consulting'){
//						$('.project-clientcategory').append('<span class="badge badge-warning consulting"> CONSULTING </span>');
//					}
//				}
//			}
//		});
//	});
})
