function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var email = getParameterByName('no');

$(document).ready(function(){
	firebase.database().ref('qnaWrite/').orderByChild('user').equalTo(email).on('child_added', function(snapshot){
		var state;
		if(snapshot.val().status == '해결'){
			state = 'label-default';
		} else if(snapshot.val().status == '보류'){
			state = 'label-warning';
		} else{
			state = 'label-primary';
		}
		$('#qnaList').append('<tr class="call_list">' +
				'<td class="project-status">' +
				'<span class="label ' + state + '">' + snapshot.val().status + '</span>' +
				'</td>' +
				'<td class="project-category">' +
				'<span>' + snapshot.val().type + '</span>' +
				'</td>' +
				'<td class="title project-title">' +
				'<a href="#/cIndex/view_qna?no='+ snapshot.key +'" id="listTitle">' + snapshot.val().title + '</a>' +
				'</td>' +
				'<td class="project-title">' + snapshot.val().date + '</td></tr>');
	})
})