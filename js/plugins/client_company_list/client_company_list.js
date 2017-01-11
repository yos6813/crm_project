function companyList(snapshot) {
	$('#company_list').append('<tr class="company_list1" value="' + snapshot.key + '"><a href="#/index/view_call_record?no=' + snapshot.key + '">' +
		'<td>' + snapshot.val().name + '</td>' +
		'<td>' + snapshot.val().corporate + '</td>' +
		'<td>' + snapshot.val().license + '</td>' +
		'<td id="' + snapshot.key + '"></td>' +
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
	$('#company_nav a').remove();
	var rowsShown = 9;
	var rowsTotal = $('#company_list').children('.company_list1').size();
	var numPages = Math.ceil(rowsTotal / rowsShown);

	for (i = 0; i < numPages; i++) {
		var pageNum = i + 1;
		$('#company_nav').append('<li><a rel="' + i + '">' + pageNum + '</a></li>');
	}

	$('#company_list').children('.company_list1').hide();
	$('#company_list').children('.company_list1').slice(0, rowsShown).show();
	$('#company_nav a:first').addClass('active');
	$('#company_nav a').bind('click', function () {
		$('#company_nav a').removeClass('active');
		$(this).addClass('active');
		var currPage = $(this).attr('rel');
		var startItem = currPage * rowsShown;
		var endItem = startItem + rowsShown;
		$('#company_list').children('.company_list1').css('opacity', '0.0').hide().slice(startItem, endItem).
		css('display', 'table-row').animate({
			opacity: 1
		}, 300);
	});
}

function companyClientList(snapshot) {
	$('#company_client_List').children().remove();
	$('#company_client_List_box').show();
	firebase.database().ref('clients/').on('child_added', function (snapshot2) {
		firebase.database().ref('clients/' + snapshot2.key).orderByChild('companyName').equalTo(snapshot).on('child_added', function (snapshot1) {
			$('#company_client_List').append('<tr class="clientlist"  value="' + snapshot1.key + '">' +
				'<td>' + snapshot1.val().clientName + '</td>' +
				'<td>' + snapshot1.val().clientDepartment + '</td>' +
				'<td>' + snapshot1.val().clientPosition + '</td>' +
				'</tr>');

			var rowsShown = 5;
			var rowsTotal = $('#company_client_List').children('.clientlist').size();
			if (rowsTotal > rowsShown) {
				$('#company_client_load').show();
			}
			var numPages = Math.ceil(rowsTotal / rowsShown);
			$('#company_client_List').children('.clientlist').hide();
			$('#company_client_List').children('.clientlist').slice(0, rowsShown).show();
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
				$('#company_client_List').children('.clientlist').css('opacity', '0.0').hide().slice(0, endItem).
				css('display', 'table-row').animate({
					opacity: 1
				}, 300);
			});
		})
	})
}

$(document).ready(function () {
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
	firebase.database().ref('company/').on('child_added', function (snapshot) {
		companyList(snapshot);
	})
	$(document).on('click', '.company_list1', function () {
		var comType;
		$('#company_Type').children().remove();
		firebase.database().ref('company/' + $(this).attr('value')).on('value', function (snapshot) {
			companyClientList(snapshot.val().name);
			$('#company_Name').text(snapshot.val().name);
			$('#company_Coporate').text('사업자: ' + snapshot.val().corporate);
			$('#company_license').text('법인: ' + snapshot.val().license);

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
			$('#inchargeBox').append('<div class="pull-right" id="csIncharge"><button class="btn btn-default btn-xs" data-toggle="modal" data-target="#myModal6">책임자 선택</button></div>');

			$('#companyUser').remove();
			$('#companyBox').append('<div class="pull-right" id="companyUser"><button class="btn btn-default btn-xs" id="companyModify">고객사 정보 수정</button></div>');

			$('#company_addr').children().remove();
			$('#company_addr').text('');
			$('#company_addr').append('<i class="fa fa-map-marker"></i>' + snapshot.val().addr);

			$('#list').children().remove();
			firebase.database().ref('user-infos/').on('child_added', function (snapshot2) {
				firebase.database().ref('user-infos/' + snapshot2.key).on('child_added', function (snapshot1) {
					$('#list').append('<tr><td><input type="radio" value="' + snapshot2.key + '" name="radioInline" ></td>' +
						'<td><img alt="image" class="img-circle" src="' + snapshot1.val().picture + '"></td>' +
						'<td>' + snapshot1.val().username + '</td><td>1</td></tr>');

					$('#modalSave').val(snapshot.key);
				})
			})

			$('#modalSave').click(function () {
				firebase.database().ref('company/' + $(this).attr('value')).update({
					officer: $('input[type=radio]:checked').val()
				})
			})
		})
	})
})

$(document).ready(function () {
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