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
//	$('#typeSelect').children().remove();
	if(pageType == ''){
		$('#typeSelect option[value="0"]').text('전체');
		snapshot.forEach(function (data) {
			$('#typeSelect').append('<option value="' + data.val() + '">' + data.val() +
			'</option>');
		})
	} else {
		$('#typeSelect option[value="0"]').text(pageType);
		snapshot.forEach(function (data) {
			if(data.val() != pageType){
			$('#typeSelect').append('<option value="' + data.val() + '">' + data.val() +
			'</option>');
			}
		})
	}
})



function postList(snapshot1) {
	firebase.database().ref('user-infos/' + snapshot1.val().officer).on('child_added', function(snapshot2){
		if(snapshot1.val().division == 'call'){
			$('#postList').each(function () {
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
				$('#postList').append('<tr class="call_list" value="' + snapshot1.key + '">' +
					'<td class="project-status">' +
					'<span class="label ' + state + '">' + snapshot1.val().status + '</span>' +
					'</td>' +
					'<td class="project-category">' +
					'<span>' + snapshot1.val().type + '</span>' +
					'</td>' +
					'<td class="title project-title">' + snapshot1.val().title +
					'</td>' +
					'<td class="project-title">' +
					'<a id="titleCom">' + snapshot1.val().company + '</a>' +
					'<br/>' +
					'<small>' + snapshot1.val().userName + '</small>' +
					'</td>' +
					'<td class="project-clientcategory" id="' + snapshot1.key + '">' +
					'</td>' +
					'<td class="project-title">' + snapshot2.val().username +
					'</td>' +
					'<td class="project-title">' +
					'<small>접수: ' + snapshot1.val().date + '</small>' +
					'</td>' +
					'<td class="project-title">' +
					'<label class="warn label label-danger">' + warn + '</label>' +
					'</td>' +
					'</tr>');
				})
			
			/* 회사 고객 타입 */
			firebase.database().ref('company/').orderByChild('name').equalTo(snapshot1.val().company).on('child_added', function (snapshot4) {
				if (snapshot4.val().sap == '1') {
					$('#' + snapshot1.key).append('<span class="badge badge-info sap"> SAP </span>');
				}
				if (snapshot4.val().cloud == '1') {
					$('#' + snapshot1.key).append('<span class="badge badge-primary cloud"> Cloud </span>');
				}
				if (snapshot4.val().onpremises == '1') {
					$('#' + snapshot1.key).append('<span class="badge badge-danger onpremises"> On Premise </span>');
				}
			})
			
			/* pagination */
			$('#nav a').remove();
			var rowsShown = parseInt($('#sizeSel option:selected').val());
			var rowsTotal = $('#postList').children('.call_list').size();
			var numPages = Math.ceil(rowsTotal / rowsShown);
			
			for (i = 0; i < numPages; i++) {
				var pageNum = i + 1;
				$('#nav').append('<li><a rel="' + i + '">' + pageNum + '</a></li>');
			}
			$('#postList').children('.call_list').hide();
			$('#postList').children('.call_list').slice(0, rowsShown).show();
			$('#nav a:first').addClass('active');
			$('#nav a').bind('click', function () {
				$('#nav a').removeClass('active');
				$(this).addClass('active');
				var currPage = $(this).attr('rel');
				var startItem = currPage * rowsShown;
				var endItem = startItem + rowsShown;
				$('#postList').children('.call_list').css('opacity', '0.0').hide().slice(startItem, endItem).
				css('display', 'table-row').animate({
					opacity: 1
				}, 300);
			});
		}
	})
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
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('type').equalTo(pageType).on('child_added', function (snapshot1) {
			if(snapshot1.val().status != '해결'){
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType == '') {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).on('child_added', function (snapshot1) {
			if (snapshot1.val().status == status) {
				postList(snapshot1);
			}
		});
	} else if (status != '' && pageType != '') {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo(status).on('child_added', function (snapshot1) {
			if (snapshot1.val().type == pageType) {
				postList(snapshot1);
			}
		});
	} else if(name != '' && title != ''){
		$('#postList').children('.call_list').remove();
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
		$('#postList').children('.call_list').remove();
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
		$('#postList').children('.call_list').remove();
		var select =  $(this).children("option:selected").text();
		if (select == '전체') {
			firebase.database().ref("qnaWrite/").orderByChild('date').on("child_added", function (snapshot1) {
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
			firebase.database().ref("qnaWrite/").orderByChild('type').equalTo(select).on('child_added', function (snapshot1) {
				if(status == ''){
					location.hash = '#/index/webQnAlist?type=' + select;
					pageType = select;
					if(snapshot1.val().status != '해결'){
						postList(snapshot1);
					}
				} else {
					location.hash = '#/index/webQnAlist?status=' + status + '&type=' + select;
					pageType = select;
					if(snapshot1.val().status == status && snapshot1.val().type == select){
						postList(snapshot1);
					}
				}
			})
		}
	})

	$("#radio1").click(function () {
		$('#postList').children('.call_list').remove();
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
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('접수').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=접수';
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=접수&type=' + pageType;
				status = '접수'
				if(snapshot1.val().type == pageType && snapshot1.val().status == '접수'){
					postList(snapshot1);
				}
			}
		});
	})
	
	$('#radio3').click(function () {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('해결').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=해결';
				if(snapshot1.val().status == '해결')
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=해결&type=' + pageType;
				status = '해결'
				if(snapshot1.val().type == pageType && snapshot1.val().status == '해결'){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio4').click(function () {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('보류').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=보류';
				if(snapshot1.val().status == '보류')
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=보류&type=' + pageType;
				status = '보류'
				if(snapshot1.val().type == pageType && snapshot1.val().status == '보류'){
					postList(snapshot1);
				}
			}
		})
	})
	$('#radio5').click(function () {
		$('#postList').children('.call_list').remove();
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('등록').on('child_added', function (snapshot1) {
			if(pageType == ''){
				location.hash = '#/index/webQnAlist?status=등록';
				if(snapshot1.val().status == '등록')
				postList(snapshot1);
			} else {
				location.hash = '#/index/webQnAlist?status=등록&type=' + pageType;
				status = '등록'
				if(snapshot1.val().type == pageType && snapshot1.val().status == '등록'){
					postList(snapshot1);
				}
			}
		})
	})

})

/* hash change */
//$(window).on('hashchange', function() {
//	location.reload();
//});

// 검색
$(document).ready(function () {
	$('#searchBtn').click(function () {
		$('#postList').children('.call_list').remove();
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
	});
	typeSelect();

	$('#searchInput').hideseek({
		hidden_mode: true,
	});

	$('#searchSelect').change(function () {
		$('.searchUl li').remove();
		typeSelect();
	})
});

$('.searchUl').hide();

function typeSelect() {
	if ($('#searchSelect option:selected').val() == 'title') {
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
	} else if ($('#searchSelect option:selected').val() == 'text') {
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
	} else if ($('#searchSelect option:selected').val() == 'username') {
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
	} else if ($('#searchSelect option:selected').val() == 'company') {
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
		$('#postList').children('tr .call_list').remove();
		searchInput = [];
		searchInput1 = [];
		var searchType = $('#searchSelect option:selected').val();
		if ($('#searchInput').val() != '') {
			if ($('.searchUl').children().not($('.hideLi')).length > 0) {
				for (var i = 0; i <= $('.searchUl').children().length; i++) {
					searchInput.push($('.searchUl').children().not($('.hideLi')).eq(i).text());
					searchInput1.push($('.searchUl').children().not($('.hideLi')).eq(i).html());
					
//					return searchInput.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
//					return searchInput1.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
				}
			}
			switch (searchType) {
				case 'text':
					$('#postList').children('.call_list').remove();
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
					$('#postList').children('.call_list').remove();
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
					$('#postList').children('.call_list').remove();
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
					$('#postList').children('.call_list').remove();
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
			$('#postList').children('.call_list').remove();
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