function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var pageType = getParameterByName('type');
var status = getParameterByName('status');

/* 글 유형 드롭다운 리스트  */
firebase.database().ref("types/").orderByKey().endAt("type").on("child_added", function (snapshot) {
	var typeSel;
	snapshot.forEach(function (data) {
		typeSel += '<option value="' + data.val() + '">' + data.val() +
		'</option>';
	})
	$('#typeSelect').append(typeSel);
})

/* List Function */
$parent = $('#postList');
function postList(snapshot1) {
	var tr;
	if(snapshot1.val().division == 'call'){
		firebase.database().ref('user-infos/' + snapshot1.val().officer).on('child_added', function(snapshot2){
			firebase.database().ref('reply/' + snapshot1.key).on('value', function(snapshot3){
				firebase.database().ref('users/' + snapshot1.val().writeUser).on('value', function(snapshot4){
					firebase.database().ref('comment/').orderByChild('post').equalTo(snapshot1.key).on('value', function(snapshot5){
						$parent.each(function () {
							var state;
							switch(snapshot1.val().status){
							case '해결':
									state = 'label-default';
								break;
							case '보류':
									state = 'label-warning';
								break;
							case '등록':
									state = 'label-success';
								break;
							case '검토중':
								state = 'label-info';
							break;
								default:
									state = 'label-primary';
								break;
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
								  '<td class="project-title">' + snapshot4.val().username +
								  '</td>' +
								  '<td class="project-title"><h3 class="text-success">' + snapshot5.numChildren() +
								  '</h3></td>' +
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
							if(numPages >= 10){
								$('#addList').show();
							}
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
		})
	}
}

/* 클릭 시 viewPage로 이동 */
$(document).on('click', '.call_list', function () {
	 if ( window._childwin )        // 새창이 띄워져 있을때
	    {
	        window._childwin.focus();
	    }
	 	window._childwin = window.open('#/index/view_call_record?no=' + $(this).attr('value'), "all", 'height=' + screen.height + ',width=' + screen.width + 'fullscreen=yes');
		return false;
	})

$(document).ready(function () {
	$('#addList').hide();
	/* client 아이디로 로그인 시 client 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			firebase.database().ref('clients/' + user.uid).on('child_added', function (snapshot) {
				if (snapshot.val().grade == '0') {
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	/* 리스트 구성 */
	if (pageType != '' && status == '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('type').equalTo(pageType).on('child_added', function (snapshot1) {
			if(snapshot1.val().status != '해결'){
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType == '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).limitToFirst(100).on('child_added', function (snapshot1) {
			if (snapshot1.val().status == status) {
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType != '') {
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).limitToFirst(100).on('child_added', function (snapshot1) {
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
	/* 리스트 열 개수 선택 */
	$('#sizeSel').change(function () {
		$('#addList').hide();
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
	
	/* 글 유형 필터 */
	$(document).on('change', '#typeSelect', function () {
		$('#addList').hide();
		$parent.children('.call_list').remove();
		var select =  $(this).children("option:selected").text();
		if (select == '전체') {
			pageType = '';
			firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
				if(status == ''){
					location.hash = '#/index/callQnAlist'
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
			$('#addList').hide();
			pageType = select;
			firebase.database().ref("qnaWrite/").orderByChild('type').equalTo(select).on('child_added', function (snapshot1) {
				if(status == ''){
					location.hash = '#/index/callQnAlist?type=' + select;
					if(snapshot1.val().status != '해결'){
						postList(snapshot1);
					}
				} else {
					location.hash = '#/index/callQnAlist?status=' + status + '&type=' + select;
					if(snapshot1.val().status == status){
						postList(snapshot1);
					}
				}
			})
		}
	})

	/* 글 상태 필터 */
	$("#radio1").click(function () {
		$('#addList').hide();
		status = '';
		$parent.children('.call_list').remove();
		firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
			if(pageType == ''){
				if(snapshot1.val().status != '해결'){
					location.hash = '#/index/callQnAlist';
					postList(snapshot1);
				}
			} else {
				location.hash = '#/index/callQnAlist?type=' + pageType;
				if(snapshot1.val().status != '해결' && snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		});
	})

	$('#radio2').click(function () {
		$('#addList').hide();
		status = '접수'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('접수').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=접수';
				postList(snapshot1);
			} else {
				location.hash = '#/index/callQnAlist?status=접수&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		});
	})
	var datanum = 100;
	$('#radio3').click(function () {
		$('#addList').show();
		status = '해결'
		$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('해결').limitToFirst(datanum).on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=해결';
				postList(snapshot1);
			} else {
				location.hash = '#/index/callQnAlist?status=해결&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})
	$('#addList').click(function(){ //리스트 더보기 버튼 클릭
		console.log($('.call_list').last().children('.title1').text());
		datanum = datanum + 50;
		firebase.database().ref('qnaWrite/').startAt(null, $('.call_list').last().attr('value')).limitToFirst(datanum).on('child_added', function(snapshot1){
			console.log('click');
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=해결';
				if(snapshot1.val().status == '해결'){
					postList(snapshot1);
				}
			} else {
				location.hash = '#/index/callQnAlist?status=해결&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
			
		})
	})
	$('#radio4').click(function () {
		$('#addList').hide();
		status = '보류'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('보류').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=보류';
				postList(snapshot1);
			} else {
				location.hash = '#/index/callQnAlist?status=보류&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio5').click(function () {
		$('#addList').hide();
		status = '등록'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('등록').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=등록';
				postList(snapshot1);
			} else {
				location.hash = '#/index/callQnAlist?status=등록&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio6').click(function () {
		$('#addList').hide();
		status = '검토중'
			$parent.children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('검토중').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/callQnAlist?status=검토중';
				postList(snapshot1);
			} else {
				location.hash = '#/index/callQnAlist?status=검토중&type=' + pageType;
				if(snapshot1.val().type == pageType){
					postList(snapshot1);
				}
			}
		})
	})

})

/* 검색 */
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
	$('#addList').hide();
	switch($('#searchSelect option:selected').val()){
	case 'title':
		$('.searchUl li').remove();
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
		break;
	case 'text':
		$('.searchUl li').remove();
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
		break;
	case 'username':
		$('.searchUl li').remove();
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
		break;
	case 'company':
		$('.searchUl li').remove();
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
		break;
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