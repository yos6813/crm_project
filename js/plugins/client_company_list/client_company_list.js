/* 회사 리스트 구성 */
function companyList(snapshot) {
	var username = '';
	firebase.database().ref('users/' + snapshot.val().officer).on('value', function (snapshot1) {
		if(snapshot1.val().username != ''){
			username = snapshot1.val().username;
		} else {
			username = '책임자 없음';
		}
		$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '"><a href="#/index/view_call_record?no=' + snapshot.key + '">' +
			'<td>' + snapshot.val().name + '</td>' +
			'<td>' + snapshot.val().corporate + '</td>' +
			'<td id="' + snapshot.key + '"></td>' +
			'<td>' + username + '</td>' +
			'</a></tr>');
	
		if (snapshot.val().sap == '1') {
			$('#' + snapshot.key).append('<span class="badge badge-info sap"> SAP </span>');
		}
		if (snapshot.val().cloud == '1') {
			$('#' + snapshot.key).append('<span class="badge badge-primary cloud"> Cloud </span>');
		}
		if (snapshot.val().onpremises == '1') {
			$('#' + snapshot.key).append('<span class="badge badge-danger onpremises"> On Premise </span>');
		}
	
		//pagination
		var rowsShown = 10;
		var rowsTotal = $('#company_list').children('.company_list1').size();
		var numPages = Math.ceil(rowsTotal / rowsShown);
		
		$('#company_list').children('.company_list1').hide();
		$('#company_list').children('.company_list1').slice(0, rowsShown).show();
		$('#company_pagination').bootpag({
		   total: numPages,
		   maxVisible: 10
		}).on('page', function(event, num){
			var startItem = (num-1) * rowsShown;
			var endItem = startItem + rowsShown;
			$('#company_list').children('.company_list1').css('opacity', '0.0').hide().slice(startItem, endItem).
			css('display', 'table-row').animate({
				opacity: 1
			}, 300);
		});
	});
}

/* 회사 담당자 리스트 구성 */
function companyClientList(snapshot) {
	$('#company_client_List').children().remove();
	$('#company_client_List_box').show();
	firebase.database().ref('clients/').on('child_added', function (snapshot2) {
		firebase.database().ref('clients/' + snapshot2.key).orderByChild('company').equalTo(snapshot).on('child_added', function (snapshot1) {
			$('#company_client_List').append('<tr value="' + snapshot2.key + '">' + 
											 '<td class="foo-cell">' + snapshot1.val().clientName + '</td>' +
											 '<td>' + snapshot1.val().clientDepartment + '</td>' +
											 '<td>' + snapshot1.val().clientPosition + '</td>' +
											 '</tr>');
			
			var rowsShown = 5;
			var rowsTotal = $('#company_client_List').children('tr').size();
			if (rowsTotal > rowsShown) {
				$('#company_client_load').show();
			}
			var numPages = Math.ceil(rowsTotal / rowsShown);
			$('#company_client_List').children('tr').hide();
			$('#company_client_List').children('tr').slice(0, rowsShown).show();
			$('#company_client_load').bind('click', function () {
				if (rowsTotal < rowsShown) {
					$('#company_client_load').hide();
				}
				rowsShown++;
				rowsShown++;
				rowsShown++;
				rowsShown++;
				rowsShown++;
				var endItem = rowsShown;
				$('#company_client_List').children('tr').css('opacity', '0.0').hide().slice(0, endItem).
				css('display', 'table-row').animate({
					opacity: 1
				}, 300);
			});
		})
	})
}

$(document).ready(function () {
	/* client 아이디로 로그인 시 client 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + firebase.auth().currentUser.uid).on('child_added', function (snapshot) {
				if (snapshot.val().grade == '0') {
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	$('#company_client_List_box').hide();
	$('#company_client_load').hide();
	
	/* company list load */
	firebase.database().ref('company/').on('child_added', function (snapshot) {
		companyList(snapshot);
	})
	
	/* 회사 리스트 클릭 이벤트 */
	$(document).on('click', '.company_list1', function () {
		var comType;
		$('#company_Type').children().remove();
		firebase.database().ref('company/' + $(this).attr('value')).on('value', function (snapshot) {
			firebase.database().ref('users/' + snapshot.val().officer).on('value', function (snapshot1) {
				companyClientList(snapshot.key);
				$('#company_Name').text(snapshot.val().name);
				$('#company_Coporate').text('사업자: ' + snapshot.val().corporate);
				$('#company_license').text('책임자: ' + snapshot1.val().username);
	
				if (snapshot.val().sap == '1') {
					$('#company_Type').append('<span class="badge badge-info sap"> SAP </span>');
				}
				if (snapshot.val().cloud == '1') {
					$('#company_Type').append('<span class="badge badge-primary cloud"> CLOUD </span>');
				}
				if (snapshot.val().onpremises == '1') {
					$('#company_Type').append('<span class="badge badge-danger onpremises"> ONPREMISES </span>');
				}
				
				$('#csIncharge').remove();
				$('#inchargeBox').append('<div class="pull-right" id="csIncharge"><button id="inchargeBtn" class="btn btn-default btn-xs" data-toggle="modal" data-target="#myModal6">책임자 선택</button></div>');
	
				$('#companyUser').remove();
				$('#companyBox').append('<div class="pull-right" id="companyUser"><button class="btn btn-default btn-xs" id="companyModify">고객사 정보 수정</button></div>');
	
				$('#company_addr').children().remove();
				$('#company_addr').text('');
				$('#company_addr').append('<i class="fa fa-map-marker"></i>' + snapshot.val().addr);
				
				$('#modalSave').val(snapshot.key);
				$('#companyModify').val(snapshot.key);
				
				$('#offiser').text('');
				firebase.database().ref('users/' + snapshot.val().officer).on('value', function(snapshot1){
					$('#offiser').text(snapshot1.val().username);
				})
			})
		})
	})
	
	$('#list').children().remove();
	/* 책임자 지정 모달 구성 */
	firebase.database().ref('users/').on('child_added', function (snapshot1) {
		firebase.database().ref('accept/').orderByChild('AcceptUserId').equalTo(snapshot1.key).on('value', function(snapshot3){
		$('#list').append('<tr><td><input type="radio" value="' + snapshot1.key + '" name="radioInline" ></td>' +
			'<td><img alt="image" class="img-circle" src="' + snapshot1.val().profile_picture + '"></td>' +
			'<td>' + snapshot1.val().username + '</td><td>' + snapshot3.numChildren() + '</td></tr>');
		})
	})
	$('img').error(function(){
		$(this).attr('src', '../../img/photo.png');
	})
	
	/* 모달 내 저장버튼 클릭 이벤트 */
	$('#modalSave').click(function () {
		firebase.database().ref('company/' + $(this).attr('value')).update({
			officer: $('input[type=radio]:checked').val()
		})
		$('#myModal6').modal('hide');
		location.reload();
	})
})

/* 담당자 리스트 구성 */
$(document).on('click', '#company_client_List tr', function(){
	$('#email').text('');
	$('#extension').text('');
	$('#fax').text('');
	$('#phone').text('');
	$('#workPhone').text('');
	firebase.database().ref('clients/' +  $(this).attr('value')).on('child_added', function(snapshot){
		$('#email').text('이메일: ' +snapshot.val().clientEmail);
		$('#extension').text('내선번호: ' + snapshot.val().clientExtension);
		$('#fax').text('팩스: ' + snapshot.val().clientFax);
		$('#phone').text('휴대전화: ' + snapshot.val().clientPhone);
		$('#workPhone').text('업무전화: ' + snapshot.val().clientWorkPhone);
	})
	$('#myModal').modal();
})

/* 회사 정보 수정 페이지로 이동 */
$(document).on('click', '#companyModify', function(){
	location.hash = '#/company?no=' + $(this).attr('value');
})

$(document).ready(function () {
	/* 회사 검색 */
	$('#search_company').click(function () {
		$('#company_list').children('.company_list1').remove();
		firebase.database().ref("company/").on("child_added", function (snapshot) {
			companyList(snapshot)
		});
	});

	typeSelect();

	$('#input_company').hideseek({
		hidden_mode: true,
	});

	$('#search_company1').change(function () {
		$('.company_searchUl li').remove();
		typeSelect();
	})
});

$('.company_searchUl').hide();

function typeSelect() {
	if ($('#search_company1 option:selected').val() == 'name') {
		firebase.database().ref('company/').on('child_added', function (snapshot) {
			$('.company_searchUl').append('<li>' + snapshot.val().name + '</li>');
		})
	} else if ($('#search_company1 option:selected').val() == 'corporate') {
		firebase.database().ref('company/').on('child_added', function (snapshot) {
			$('.company_searchUl').append('<li>' + snapshot.val().corporate + '</li>');
		})
	} else if ($('#search_company1 option:selected').val() == 'license') {
		firebase.database().ref('company/').on('child_added', function (snapshot) {
			$('.company_searchUl').append('<li>' + snapshot.val().license + '</li>');
		})
	}

	var searchInput = [];
	$('#search_company').click(function () {
		$('#company_list').children('.company_list1').remove();
		searchInput = [];
		var searchType = $('#search_company1 option:selected').val();
		if ($('#input_company').val() != '') {
			if ($('.company_searchUl').children().not($('.hideLi')).length > 0) {
				for (var i = 0; i <= $('.company_searchUl').children().not($('.hideLi')).length; i++) {
					searchInput.push($('.company_searchUl').children().not($('.hideLi')).eq(i).text());
				}
			}
			switch (searchType) {
				case 'name':
					$('#company_list').children('.company_list1').remove();
					for (var i = 0; i <= searchInput.length; i++) {
						if (searchInput[i] != undefined || searchInput[i] != null) {
							firebase.database().ref('company/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot) {
								companyList(snapshot);
							})
						}
					}
					break;
				case 'corporate':
					$('#company_list').children('.company_list1').remove();
					for (var i = 0; i <= searchInput.length; i++) {
						if (searchInput[i] != undefined || searchInput[i] != null) {
							firebase.database().ref('company/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot) {
								companyList(snapshot);
							})
						}
					}
					break;
				default:
					$('#company_list').children('.company_list1').remove();
					for (var i = 0; i <= searchInput.length; i++) {
						if (searchInput[i] != undefined || searchInput[i] != null) {
							firebase.database().ref('company/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot) {
								companyList(snapshot);
							})
						}
					}
					break;
			}
		} else {
			$('#company_list').children('.company_list1').remove();
			firebase.database().ref("company/").on("child_added", function (snapshot) {
				companyList(snapshot);
			});
		}
	});
}