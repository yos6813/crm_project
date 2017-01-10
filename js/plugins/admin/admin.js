/* add Admin */

function addDepartment(department) {
	var departData = {
		department: department
	};

	var newDepartmentKey = firebase.database().ref().child('departments').push().key;

	var updates = {};
	updates['/departments/' + newDepartmentKey] = departData;

	return firebase.database().ref().update(updates);
}

function addJob(job) {
	var jobData = {
		job: job
	};

	var newJobKey = firebase.database().ref().child('jobs').push().key;

	var updates = {};
	updates['/jobs/' + newJobKey] = jobData;

	return firebase.database().ref().update(updates);
}

function addType(type) {
	var typeData = {
		type: type
	};

	var newtypeKey = firebase.database().ref().child('types').push().key;

	var updates = {};
	updates['/types/' + newtypeKey] = typeData;

	return firebase.database().ref().update(updates);
}

function depart() {
	addDepartment($('#departmentInput').val());
	$('#departmentInput').val('');
	location.reload();
};

$('#typeInputBtn').click(function(){
	addType($('#typeInput').val());
	$('#typeInput').val('');
	location.reload();
})

function job() {
	addJob($("#jobInput").val());
	$("#jobInput").val('');
	location.reload();
};

$(document).ready(function () {
	firebase.database().ref('clients/' + firebase.auth().currentUser.uid).on('child_added',function(snapshot){
		if(snapshot.val().grade == '0'){
			window.location.hash = '#/clientLogin';
		}
	})
	
	$('.departmentli').remove();
	$('.departmentA').remove();
	$('.jobli').remove();
	$('.jobA').remove();
	$('.typeli').remove();
	$('.typeA').remove();

	/* 부서 리스트 */
	firebase.database().ref("departments/").orderByKey().endAt("department").on("child_added", function (snapshot) {
		var key = snapshot.key;
		snapshot.forEach(function (data) {
			$('#departmentList1').append('<tr>' + '<td class="firstTd">' + data.val() + '</td>' +
				'<td class="text-right">' +
				'<div class="btn-group">' +
				'<button class="modifyDepartmentA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
				'<button class="delDepartmentA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
				'</div>' +
				'</td></tr>');
		})
	})

	/* 직책 리스트  */
	firebase.database().ref("jobs/").orderByKey().endAt("job").on("child_added", function (snapshot) {
		snapshot.forEach(function (data) {
			$('#jobList1').append('<tr>' + '<td class="firstTd">' + data.val() + '</td>' +
				'<td class="text-right">' +
				'<div class="btn-group">' +
				'<button class="modifyJobA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
				'<button class="delJobA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
				'</div>' +
				'</td></tr>');
		})
	})


	/* 유형 리스트 */
	firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function (snapshot) {
		snapshot.forEach(function (data) {
			$('#typeList1').append('<tr>' + '<td class="firstTd">' + data.val() + '</td>' +
				'<td class="text-right">' +
				'<div class="btn-group">' +
				'<button class="modifyTypeA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
				'<button class="delTypeA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
				'</div>' +
				'</td></tr>');
		})
	})


	/* 회원 리스트 */
	firebase.database().ref('user-infos/').orderByKey().endAt('username').on('child_added', function (snapshot) {
		snapshot.forEach(function (data) {
			$('#userList').append('<tr><td><img class="img-circle adminUser" src="' + data.val().picture + '"></td>' +
				'<td>' + data.val().username + '</td>' +
				'<td>' + data.val().department + '</td>' +
				'<td>' + data.val().job + '</td>' +
				'<td>' + data.val().phone + '</td>' +
				'<td>' + data.val().extension + '</td>' +
				'<td class="text-right">' +
				'<div class="btn-group">' +
				'<button class="modifyUserA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
				'<button class="delUserA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
				'</div>' +
				'</td></tr>');
		})
	})
})

/* 부서 리스트 삭제 */

$(document).on('click', '.delDepartmentA', function () {
	firebase.database().ref('departments/' + $(this).val()).remove();
	location.reload();
})

/* 부서 리스트 수정 */
$(document).on('click', '.modifyDepartmentA', function(){
	$(this).addClass('modifyDepartmentB');
	$(this).removeClass('modifyDepartmentA');
	$(this).text('확인');
	$(this).parents('td').prev('.firstTd').text('');
	$(this).parents('td').prev('.firstTd').append('<input type="text" class="modifyInputdepartB input-sm form-control" value="">');
})

$(document).on('click', '.modifyDepartmentB', function(){
	firebase.database().ref('departments/' + $(this).val()).set({
		department: $('.modifyInputdepartB').val()
	})
	location.reload();
})

/* 직책 리스트 삭제 */
$(document).on('click', '.delJobA', function () {
	firebase.database().ref('jobs/' + $(this).val()).remove();
	location.reload();
})

/* 직책 리스트 수정 */
$(document).on('click', '.modifyJobA', function(){
	$(this).addClass('modifyJobB');
	$(this).removeClass('modifyJobA');
	$(this).text('확인');
	$(this).parents('td').prev('.firstTd').text('');
	$(this).parents('td').prev('.firstTd').append('<input type="text" class="modifyInputjobB input-sm form-control" value="">');
})

$(document).on('click', '.modifyJobB', function(){
	firebase.database().ref('jobs/' + $(this).val()).set({
		department: $('.modifyInputjobB').val()
	})
	location.reload();
})

/* 글 유형 리스트 삭제 */
$(document).on('click', '.delTypeA', function () {
	firebase.database().ref('types/' + $(this).val()).remove();
	location.reload();
})

$(document).on('click', '.modifyTypeA', function(){
	$(this).addClass('modifyTypeB');
	$(this).removeClass('modifyTypeA');
	$(this).text('확인');
	$(this).parents('td').prev('.firstTd').text('');
	$(this).parents('td').prev('.firstTd').append('<input type="text" class="modifyInputTypeB input-sm form-control" value="">');
})

$(document).on('click', '.modifyTypeB', function(){
	firebase.database().ref('types/' + $(this).val()).set({
		department: $('.modifyInputTypeB').val()
	})
	location.reload();
})

/* 회원 리스트 수정 */
$(document).on('click', '.modifyUserA', function(){
	window.location.hash = '#/registerModify?no=' + $(this).val();
})

/* 회원 리스트 삭제 */
$(document).on('click', '.delUserA', function(){
	firebase.database().ref('user-infos/' + $(this).val()).remove();
	firebase.database().ref('users/' + $(this).val()).remove();
	location.reload();
})