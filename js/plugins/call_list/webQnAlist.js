function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var pageType = getParameterByName('type');
var status = getParameterByName('status');
var name = getParameterByName('%3F');
var title = getParameterByName('title');
var uid = getParameterByName('uid');

firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function (snapshot) {
	var typeSel;
	snapshot.forEach(function (data) {
		typeSel += '<option value="' + data.val() + '">' + data.val() +
		'</option>';
	})
	$('#typeSelect').append(typeSel);
})

$parent = $('#postList');

function postList(snapshot1) {
	var tr;
	if(snapshot1.val().division == 'client'){
		firebase.database().ref('user-infos/' + snapshot1.val().officer).on('child_added', function(snapshot2){
			firebase.database().ref('reply/' + snapshot1.key).on('value', function(snapshot3){
					firebase.database().ref('comment/').orderByChild('post').equalTo(snapshot1.key).on('value', function(snapshot5){
						$parent.each(function () {
							var state;
							if (snapshot1.val().status == '해결') {
								state = 'label-default';
							} else if (snapshot1.val().status == '보류') {
								state = 'label-warning';
							} else if(snapshot1.val().status == '등록'){
								state = 'label-info';
							} else{
								state = 'label-primary';
							}
							
							var warn = '';
							if(snapshot1.val().warn != undefined){
								warn = '긴급';
							}
							
							var check = '';
							if(snapshot3.val().replyText != ''){
								check = '<i class="text-success fa fa-check"></i>';
							}
							
							tr += '<tr class="call_list" value="' + snapshot1.key + '">' +
												  '<td class="project-status">' +
												  '<span class="label ' + state + '">' + snapshot1.val().status + '</span>' +
												  '<br/><br/>' +
												  '<label class="warn label label-danger">' + warn + '</label>' +
												  '</td>' +
												  '<td class="project-category">' +
												  '<span>' + snapshot1.val().type + '</span>' +
												  '</td>' +
												  '<td class="title project-title">' + 
												  '<h5>' + snapshot1.val().company + 
												  ' / <small>' + snapshot1.val().userName + '</small></h5><h4>' + check + snapshot1.val().title +
												  '</h4>' +
												  '<small>접수: ' + snapshot1.val().date + '</small>' +
												  '</td>' +
												  '<td class="project-clientcategory" id="' + snapshot1.key + '">' +
												  '</td>' +
												  '<td class="project-title">' + snapshot2.val().username +
												  '</td>' +
												  '<td class="project-title">' + snapshot1.val().userName +
												  '</td>' +
												  '<td class="project-title"><span class="badge badge-info">' + snapshot5.numChildren() +
												  '</span></td>' +
												  '</tr>';
							})
							
							$parent.append(tr);
						
							/* 회사 고객 타입 */
							firebase.database().ref('company/').orderByChild('name').equalTo(snapshot1.val().company).on('child_added', function (snapshot4) {
								if (snapshot4.val().sap == '1') {
									$('#' + snapshot1.key).append('<span class="badge badge-info sap"> SAP </span>');
								}
								if (snapshot4.val().cloud == '1') {
									$('#' + snapshot1.key).append('<span class="badge badge-primary cloud"> CLD </span>');
								}
								if (snapshot4.val().onpremises == '1') {
									$('#' + snapshot1.key).append('<span class="badge badge-danger onpremises"> ONP </span>');
								}
							})
							/* pagination */
							var rowsShown = parseInt($('#sizeSel option:selected').val());
							var rowsTotal = $parent.children('.call_list').size();
							var numPages = Math.ceil(rowsTotal / rowsShown);
							
							$parent.children('.call_list').hide();
							$parent.children('.call_list').slice(0, rowsShown).show();
							$('#pagination').bootpag({
								   total: numPages,
								   maxVisible: 10
								}).on('page', function(event, num){
									var startItem = (num-1) * rowsShown;
									var endItem = startItem + rowsShown;
									$parent.children('.call_list').css('opacity', '0.0').hide().slice(startItem, endItem).
									css('display', 'table-row').animate({
										opacity: 1
									}, 300);
								});
					})
				})
		})
	}
}

$(document).on('click', '.call_list', function () {
	location.hash = '#/index/view_call_record?no=' + $(this).attr('value');
})

$(document).ready(function () {
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + user.uid).on('child_added', function (snapshot) {
				if (snapshot.val().grade == '0') {
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	if (pageType != '' && status == '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('type').equalTo(pageType).on('child_added', function (snapshot1) {
			if(snapshot1.val().status != '해결'){
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType == '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).on('child_added', function (snapshot1) {
			if (snapshot1.val().status == status) {
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType != '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).on('child_added', function (snapshot1) {
			if (snapshot1.val().type == pageType) {
				postList(snapshot1);
			}
		});
	} else if(name != '' && title != ''){
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').on('child_added', function (snapshot1) {
			if (snapshot1.val().title == title && snapshot1.val().userName == name) {
				if(snapshot1.val().status != '해결'){
					postList(snapshot1);
				}
			}
		});
	} else {
		/* 전체 리스트 */
		firebase.database().ref("qnaWrite/").on("child_added", function (snapshot1) {
			if(snapshot1.val().status != '해결'){
				postList(snapshot1);
			}
		});
	}
	
	
})

$(document).ready(function () {
	$('#sizeSel').change(function () {
		$parent.children('.call_list').remove();
		/* 전체 리스트 */
		firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
			if(status == '' && pageType == ''){
				if(snapshot1.val().status != '해결'){
					postList(snapshot1);
				}
			} else if(pageType == '' && status != ''){
				if(snapshot1.val().status == status){
					postList(snapshot1);
				}
			} else if(pageType != '' && status == ''){
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			} else {
				if(snapshot1.val().status == status && snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		});
	})

	$(document).on('change', '#typeSelect', function () {
		$parent.children('.call_list').remove();
		var select =  $(this).children("option:selected").text();
		if (select == '전체') {
			firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
				pageType = '';
				if(status == ''){
					location.hash = '#/index/webQnAlist'
					if(snapshot1.val().status != '해결'){
						postList(snapshot1);
					}
				} else {
					if(snapshot1.val().status == status){
						postList(snapshot1);
					}
				}
			});
		} else {
			pageType = select;
			firebase.database().ref("qnaWrite/").orderByChild('type').equalTo(select).on('child_added', function (snapshot1) {
				if(status == ''){
					location.hash = '#/index/webQnAlist?type=' + select;
					if(snapshot1.val().status != '해결'){
						postList(snapshot1);
					}
				} else {
					location.hash = '#/index/webQnAlist?status=' + status + '&type=' + select;
					if(snapshot1.val().status == status){
						postList(snapshot1);
					}
				}
			})
		}
	})

	$("#radio1").click(function () {
		status = '';
		$parent.children('.call_list').remove();
		firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
			if(pageType == ''){
				if(snapshot1.val().status != '해결'){
					location.hash = '#/index/webQnAlist';
					postList(snapshot1);
				}
			} else {
				location.hash = '#/index/webQnAlist?type=' + pageType;
				if(snapshot1.val().status != '해결' && snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		});
	})

	$('#radio2').click(function () {
		status = '접수'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('접수').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=접수';
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=접수&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		});
	})
	
	$('#radio3').click(function () {
		status = '해결'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('해결').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=해결';
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=해결&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio4').click(function () {
		status = '보류'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('보류').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=보류';
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=보류&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio5').click(function () {
		status = '등록'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('등록').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=등록';
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=등록&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})

})

// 검색
$(document).ready(function () {
	typeSelect();

	$('#searchInput').hideseek({
		hidden_mode: true,
	});

	$('#searchSelect').change(function () {
		$('.searchUl li').remove();
		$('#searchInput').val('');
		typeSelect();
	})
});

$('.searchUl').hide();

function typeSelect() {
	switch($('#searchSelect option:selected').val()){
	case 'title':
		firebase.database().ref('qnaWrite/').orderByChild('date').on('child_added', function (snapshot1) {
			if(status == '' && pageType == ''){
				if(snapshot1.val().status != '해결'){
					$('.searchUl').append('<li>' + snapshot1.val().title + '</li>');
				}
			} else if(pageType == '' && status != ''){
				if(snapshot1.val().status == status){
					$('.searchUl').append('<li>' + snapshot1.val().title + '</li>');
				}
			} else if(pageType != '' && status == ''){
				if(snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().title + '</li>');
				}
			} else {
				if(snapshot1.val().status == status && snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().title + '</li>');
				}
			}
		})
	case 'text':
		firebase.database().ref('qnaWrite/').orderByChild('date').on('child_added', function (snapshot1) {
			if(status == '' && pageType == ''){
				if(snapshot1.val().status != '해결'){
					$('.searchUl').append('<li>' + snapshot1.val().text + '</li>');
				}
			} else if(pageType == '' && status != ''){
				if(snapshot1.val().status == status){
					$('.searchUl').append('<li>' + snapshot1.val().text + '</li>');
				}
			} else if(pageType != '' && status == ''){
				if(snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().text + '</li>');
				}
			} else {
				if(snapshot1.val().status == status && snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().text + '</li>');
				}
			}
		})
	case 'username':
		firebase.database().ref('qnaWrite/').orderByChild('officer').on('child_added', function (snapshot) {
			firebase.database().ref('users/' + snapshot.val().officer).on('value', function(snapshot1){
				if(status == '' && pageType == ''){
					if(snapshot.val().status != '해결'){
						$('.searchUl').append('<li>' + snapshot1.val().username + '</li>');
					}
				} else if(pageType == '' && status != ''){
					if(snapshot.val().status == status){
						$('.searchUl').append('<li>' + snapshot1.val().username + '</li>');
					}
				} else if(pageType != '' && status == ''){
					if(snapshot.val().type == pageType){
						$('.searchUl').append('<li>' + snapshot1.val().username + '</li>');
					}
				} else {
					if(snapshot.val().status == status && snapshot.val().type == pageType){
						$('.searchUl').append('<li>' + snapshot1.val().username + '</li>');
					}
				}
			})
		})
	case 'company':
		firebase.database().ref('qnaWrite/').orderByChild('date').on('child_added', function (snapshot1) {
			if(status == '' && pageType == ''){
				if(snapshot1.val().status != '해결'){
					$('.searchUl').append('<li>' + snapshot1.val().company + '</li>');
				}
			} else if(pageType == '' && status != ''){
				if(snapshot1.val().status == status){
					$('.searchUl').append('<li>' + snapshot1.val().company + '</li>');
				}
			} else if(pageType != '' && status == ''){
				if(snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().company + '</li>');
				}
			} else {
				if(snapshot1.val().status == status && snapshot1.val().type == pageType){
					$('.searchUl').append('<li>' + snapshot1.val().company + '</li>');
				}
			}
		})
	}

	var searchInput = [];
	var searchInput1 = [];
	$('#searchBtn').click(function () {
		$parent.children('tr .call_list').remove();
		searchInput = [];
		searchInput1 = [];
		var searchType = $('#searchSelect option:selected').val();
		if ($('#searchInput').val() != '') {
			if ($('.searchUl').children().not($('.hideLi')).length > 0) {
				for (var i = 0; i <= $('.searchUl').children().length; i++) {
					searchInput.push($('.searchUl').children().not($('.hideLi')).eq(i).text());
					searchInput1.push($('.searchUl').children().not($('.hideLi')).eq(i).html());
				}
			}
			switch (searchType) {
				case 'text':
					$parent.children('.call_list').remove();
					for (var i = 0; i <= $('.searchUl').children().not($('.hideLi')).length; i++) {
						var j = i-1;
						if (searchInput1[i] != undefined || searchInput1[i] != null) {
							firebase.database().ref('qnaWrite/').orderByChild(searchType).equalTo(searchInput1[i]).on('child_added', function (snapshot1) {
								if(status == '' && pageType == ''){
									if(snapshot1.val().status != '해결' && searchInput[i] != searchInput1[j]){
										postList(snapshot1);
									}
								} else if(pageType == '' && status != ''){
									if(snapshot1.val().status == status && searchInput[i] != searchInput1[j]){
										postList(snapshot1);
									}
								} else if(pageType != '' && status == ''){
									if(snapshot1.val().type == pageType && searchInput[i] != searchInput1[j]){
										postList(snapshot1);
									}
								} else {
									if(snapshot1.val().status == status && snapshot1.val().type == pageType && searchInput[i] != searchInput1[j]){
										postList(snapshot1);
									}
								}
							})
						}
					}
					break;
				case 'company':
					$parent.children('.call_list').remove();
					for (var i = 0; i <= $('.searchUl').children().not($('.hideLi')).length; i++) {
						var j = i-1;
						if (searchInput[i] != '') {
							firebase.database().ref('qnaWrite/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot1) {
								if(status == '' && pageType == ''){
									if(snapshot1.val().status != '해결' && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else if(pageType == '' && status != ''){
									if(snapshot1.val().status == status && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else if(pageType != '' && status == ''){
									if(snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else {
									if(snapshot1.val().status == status && snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								}
							})
						}
					};
					break;
				case 'username':
					$parent.children('.call_list').remove();
					for (var i = 0; i <= $('.searchUl').children().not($('.hideLi')).length; i++) {
						var j = i-1;
						if (searchInput[i] != undefined || searchInput[i] != '') {
							firebase.database().ref('users/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot) {
								firebase.database().ref('qnaWrite/').orderByChild('officer').equalTo(snapshot.key).on('child_added', function (snapshot1) {
									if(status == '' && pageType == ''){
										if(snapshot1.val().status != '해결' && searchInput[i] != searchInput[j]){
											postList(snapshot1);
										}
									} else if(pageType == '' && status != ''){
										if(snapshot1.val().status == status && searchInput[i] != searchInput[j]){
											postList(snapshot1);
										}
									} else if(pageType != '' && status == ''){
										if(snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
											postList(snapshot1);
										}
									} else {
										if(snapshot1.val().status == status && snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
											postList(snapshot1);
										}
									}
								})
							})
						}
					};
					break;
				default:
					$parent.children('.call_list').remove();
					for (var i = 0; i <= $('.searchUl').children().not($('.hideLi')).length; i++) {
						var j = i-1;
						if (searchInput[i] != undefined || searchInput[i] != null) {
							firebase.database().ref('qnaWrite/').orderByChild(searchType).equalTo(searchInput[i]).on('child_added', function (snapshot1) {
								if(status == '' && pageType == ''){
									if(snapshot1.val().status != '해결' && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else if(pageType == '' && status != ''){
									if(snapshot1.val().status == status && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else if(pageType != '' && status == ''){
									if(snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								} else {
									if(snapshot1.val().status == status && snapshot1.val().type == pageType && searchInput[i] != searchInput[j]){
										postList(snapshot1);
									}
								}
							})
						}
					}
					break;
			}
		} else {
			$parent.children('.call_list').remove();
			firebase.database().ref("qnaWrite/").on("child_added", function (snapshot1) {
				if(status == '' && pageType == ''){
					if(snapshot1.val().status != '해결'){
						postList(snapshot1);
					}
				} else if(pageType == '' && status != ''){
					if(snapshot1.val().status == status){
						postList(snapshot1);
					}
				} else if(pageType != '' && status == ''){
					if(snapshot1.val().type == pageType){
						postList(snapshot1);
					}
				} else {
					if(snapshot1.val().status == status && snapshot1.val().type == pageType){
						postList(snapshot1);
					}
				}
			});
		}
	});
}