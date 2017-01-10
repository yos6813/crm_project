function addbigGroup(type, bGroup) {
	var bGroupData = {
		bGroup: bGroup
	};

	var newgroupKey = firebase.database().ref().child('bigGroup').push().key;

	var updates = {};
	updates['/bigGroup/' + type + '/' + newgroupKey] = bGroupData;

	return firebase.database().ref().update(updates);
}

function addsmallGroup(type, sGroup, bigGroup) {
	var sGroupData = {
		sGroup: sGroup
	};

	var newgroupKey = firebase.database().ref().child('smallGroup').push().key;

	var updates = {};
	updates['/smallGroup/' + type + '/' + bigGroup + '/' + newgroupKey] = sGroupData;

	return firebase.database().ref().update(updates);
}

/* 대분류 리스트 추가 */
$('#addBigGroup').click(function(){
	var bGroup = $('#biggroupInput').val();
	var type = $('#typeSelect').val();
	
	addbigGroup(type, bGroup);
	
	$('#biggroupInput').val('');
})

/* 소분류 리스트 추가 */
$('#addSmallGroup').click(function(){
	var sGroup = $('#smallgroupInput').val();
	var bigGroup = $('#bigGroup2').text();
	var type = $('#typeSelect').val();
	
	if(bigGroup == ''){
		$('#bigGroup2').text('대분류를 선택해주세요.');
		$('#bigGroup2').css('color', 'red');
	} else {
		addsmallGroup(type, sGroup, bigGroup);
		$('#smallgroupInput').val('');
	}

})

$(document).ready(function(){
	firebase.database().ref('clients/' + firebase.auth().currentUser.uid).on('child_added',function(snapshot){
		if(snapshot.val().grade == '0'){
			window.location.hash = '#/clientLogin';
		}
	})
	
	var type = $('#typeSelect').val();
	firebase.database().ref('bigGroup/' + type).on('child_added', function(snapshot){
		snapshot.forEach(function(data){
			$('#bigGroup').append('<tr class="bigGroupList">' + '<td class="firstTd">' + data.val() + '</td>' +
					'<td class="text-right">' +
					'<div class="btn-group">' +
					'<button class="modifybGroupA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
					'<button class="delbGroupA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
					'</div>' +
					'</td></tr>');
		})
	})
})

/* 대분류 선택 */
$(document).on('click', '.bigGroupList', function(){
	$('#bigGroup2').text($(this).children('.firstTd').text());
	$('#smallGroup').children().remove();
	var type = $('#typeSelect').val();
	firebase.database().ref('smallGroup/' + type + '/' + $('#bigGroup2').text()).on('child_added', function(snapshot){
		snapshot.forEach(function(data){
			if(data.val() != undefined){
				$('#smallGroup').append('<tr class="smallGroupList">' + '<td class="firstTd">' + data.val() + '</td>' +
						'<td class="text-right">' +
						'<div class="btn-group">' +
						'<button class="modifysGroupA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
						'<button class="delsGroupA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
						'</div>' +
				'</td></tr>')
			} else {
				$('#smallGroup').append('<tr><td>NO DATA</td></tr>');
			}
		})
	})
})

/* 소분류 리스트 삭제 */
$(document).on('click', '.delsGroupA', function () {
	var type = $('#typeSelect').val();
	firebase.database().ref('smallGroup/' + type + '/' + $(this).val()).remove();
	location.reload();
})

/* 소분류 리스트 수정 */
$(document).on('click', '.modifysGroupA', function(){
	$(this).addClass('modifysGroupB');
	$(this).removeClass('modifysGroupA');
	$(this).text('확인');
	$(this).parents('td').prev('.firstTd').text('');
	$(this).parents('td').prev('.firstTd').append('<input type="text" class="modifyInputsGroupB input-sm form-control" value="">');
})

$(document).on('click', '.modifysGroupB', function(){
	var type = $('#typeSelect').val();
	firebase.database().ref('smallGroup/' + type + '/' + $(this).val()).set({
		department: $('.modifyInputsGroupB').val()
	})
	location.reload();
})


/* 대분류 리스트 삭제 */
$(document).on('click', '.delbGroupA', function () {
	var type = $('#typeSelect').val();
	firebase.database().ref('bigGroup/' + type + '/' + $(this).val()).remove();
	location.reload();
})

/* 대분류 리스트 수정 */
$(document).on('click', '.modifybGroupA', function(){
	$(this).addClass('modifybGroupB');
	$(this).removeClass('modifybGroupA');
	$(this).text('확인');
	$(this).parents('td').prev('.firstTd').text('');
	$(this).parents('td').prev('.firstTd').append('<input type="text" class="modifyInputbGroupB input-sm form-control" value="">');
})

$(document).on('click', '.modifybGroupB', function(){
	var type = $('#typeSelect').val();
	firebase.database().ref('bigGroup/' + type + '/' + $(this).val()).set({
		department: $('.modifyInputbGroupB').val()
	})
	location.reload();
})

$('#typeSelect').change(function(){
	$('#bigGroup').children().remove();
	$('#smallGroup').children().remove();
	$('#bigGroup2').text('');
	var type = $('#typeSelect').val();
	firebase.database().ref('bigGroup/' + type).on('child_added', function(snapshot){
		snapshot.forEach(function(data){
			$('#bigGroup').append('<tr class="bigGroupList">' + '<td class="firstTd">' + data.val() + '</td>' +
					'<td class="text-right">' +
					'<div class="btn-group">' +
					'<button class="modifybGroupA btn btn-white btn-sm" value="' + snapshot.key + '"><i class="fa fa-pencil"></i>수정 </button>' +
					'<button class="delbGroupA btn-white btn btn-sm" value="' + snapshot.key + '"><i class="fa fa-eraser"></i>삭제</button>' +
					'</div>' +
					'</td></tr>');
		})
	})
})