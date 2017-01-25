/* 1시간에 한번씩 새로고침 */
function pagestart() {
	window.setTimeout("pagereload()", 360000);
}
function pagereload() {
	location.reload();
}

$(document).ready(function(){
	/* client 아이디로 로그인 시 client 페이지로 튕김 */
	firebase.auth().onAuthStateChanged(function(user) {
		if(user){
			firebase.database().ref('clients/' + user.uid).on('child_added',function(snapshot){
				if(snapshot.val().grade == '0'){
					window.location.hash = '#/clientLogin';
				}
			})
		}
	})
	
	pagestart();
	
	/* 지난달 데이터 삭제 */
	var todayMonth = new Date().getMonth() + 1;
	if(todayMonth == '1'){
		firebase.database().ref('timePosts/12').remove();
	} else {
		firebase.database().ref('timePosts/' + todayMonth - 1).remove();
	}
	
	/* 도넛 차트 */
	firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('해결').on('value', function(snapshot1){
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('접수').on('value', function(snapshot2){
			firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('보류').on('value', function(snapshot3){
				firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('등록').on('value', function(snapshot4){
					firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('검토중').on('value', function(snapshot5){
						var chartResolve = snapshot1.numChildren();
						var chartDefer = snapshot3.numChildren();
						var chartAccept = snapshot2.numChildren();
						var chartcheck = snapshot4.numChildren();
						var chart = snapshot5.numChildren();
						
					    var dataSource = [
					        { status: '해결', value: chartResolve },
					        { status: '보류', value: chartDefer },
					        { status: '접수', value: chartAccept },
					        { status: '등록', value: chartcheck },
					        { status: '검토중', value: chart },
					    ];
					     
					    $("#doughnutChart").dxPieChart({
					        dataSource: dataSource,
					        palette: 'Soft Pastel',
					        series: {
					            type: 'doughnut',
					            argumentField: 'status',
					            valueField: 'value',
					            label: {
					                visible: true,
					                connector: {
					                    visible: true
					                }
					            }
					        },
					        tooltip: {
					        	enabled: true,
					        	customizeTooltip: function (arg) {
					                return {
					                    text: arg.argumentText + " - " + arg.valueText
					                };
					            }
					        },
					        onPointClick: function (info) {
					            var clickedPoint = info.target;
					            var name = clickedPoint.argument;
					            var url = '#/index/call_list?status=' + name
					            clickedPoint.isSelected() ? '': window.open(url, "_blank");
					        },
					        "export": {
					            enabled: true
					        }
					        
					    });
					})
				})
			})
		})
	})
	
	/* 일 별 집계 */
	var dataSource = [];
	var todayMonth = new Date().getMonth() + 1;
	for(var j=0; j<=new Date().getHours(); j++){
		firebase.database().ref('timePosts/' + todayMonth + '/' + new Date().getDate() + '/' + j).on('value', function(snapshot){
			if(todayMonth == '1'){
				firebase.database().ref('timePosts/12').remove();
			} else {
				firebase.database().ref('timePosts/' + todayMonth - 1).remove();
			}
			var chartValue;
			if(snapshot.val() != ''){
				chartValue=snapshot.numChildren();
			}
			var	time = new Date().getHours();
			var value = [];
				dataSource.push({
					y: chartValue,
					x: snapshot.key + '시'
				});
			$("#barChart").dxChart({
		        palette: "Soft Pastel",
		        dataSource: dataSource,
		        equalBarWidth: {
                    width: 18
                },
		        commonSeriesSettings: {
		            type: "bar",
		            argumentField: "x"
		        },
		        margin: {
		            bottom: 20
		        },
		        series: [
		            { valueField: "y", name: "포스팅 수" },
		        ],
		        tooltip:{
		            enabled: true
		        },
		        legend: {
		            verticalAlignment: "bottom",
		            horizontalAlignment: "center"
		        },
		        "export": {
		            enabled: true
		        }
		    }).dxChart("instance");
		})
	}
	
	
	
	/* 접수, 해결 현황 인별집계 */
	$('#userPostNum').children('.ibox-content').remove();
	firebase.database().ref('users/').orderByKey().on('child_added', function(snapshot){
		firebase.database().ref('accept/').orderByChild('AcceptUserId').equalTo(snapshot.key).on('value', function(snapshot1){
			firebase.database().ref('reply/').orderByChild('userId').equalTo(snapshot.key).on('value', function(snapshot2){
				
				$('#userPostNum').append('<div class="userList ibox-content">' +
	            						 '<div class="row">' +
										 '<div class="col-xs-4">' +
										 '<a><img alt="image" style="width:36px; height:36px;" class="img-circle" src="' + snapshot.val().profile_picture + '"></a>' +
										 '<br/>' +
										 '<small>' + snapshot.val().username + '</small>' +
										 '<br/>' +
										 '</div>' +
										 '<div class="col-xs-4">' +
										 '<small class="stats-label">접수</small>' +
										 '<h4>' + snapshot1.numChildren() + '</h4>' +
										 '</div>' +
										 '<div class="col-xs-4">' +
										 '<small class="stats-label">해결</small>' +
										 '<h4>'+ snapshot2.numChildren() + '</h4>' +
										 '</div>' +
										 '</div>'+
										 '</div>');
				$('img').error(function(){
					$(this).attr('src', '../../img/photo.png');
				})

			})
		})
	})
	
	var taxLaw = [];
	var system = [];
	var management = [];
	
	var taxLaw1 = [];
	var system1 = [];
	var management1 = [];
	
	var taxLaw2 = [];
	var system2 = [];
	var management2 = [];
	
	var taxLaw4 = [];
	var system4 = [];
	var management4 = [];
	
	var taxLaw5 = [];
	var system5 = [];
	var management5 = [];
	
	/* 글 분류 별 집계 */
	for(var i=1; i<=5; i++){
		$('#taxLaw' + i).click(function(){
			var url = '#/index/call_list?status=' + $(this).prev().text() + '&type=' + $(this).parent().prev().children().text();
			window.open(url, "_blank");
		})
		
		$('#system' + i).click(function(){
			var url = '#/index/call_list?status=' + $(this).prev().text() + '&type=' + $(this).parent().prev().children().text();
			window.open(url, "_blank");
		})
		
		$('#management' + i).click(function(){
			var url = '#/index/call_list?status=' + $(this).prev().text() + '&type=' + $(this).parent().prev().children().text();
			window.open(url, "_blank");
		})
	}
	
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('해결').on('child_added', function(snapshot1){
			if(snapshot1.val().type == '세법'){
				taxLaw.push(snapshot1.key);
				if(taxLaw != null){
					$('#taxLaw3').text(taxLaw.length);
				}
			} else if (snapshot1.val().type == '운용'){
				management.push(snapshot1.key);
				if(management != null){
					$('#management3').text(management.length);
				}
			} else {
				system.push(snapshot1.key);
				if(system != null){
					$('#system3').text(system.length);
				}
			}
		})
	
		firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('접수').on('child_added', function(snapshot1){
			if(snapshot1.val().type == '세법'){
				taxLaw1.push(snapshot1.key);
				if(taxLaw1 != null){
					$('#taxLaw1').text(taxLaw1.length);
				}
			} else if (snapshot1.val().type == '운용'){
				management1.push(snapshot1.key);
				if(management1 != null){
					$('#management1').text(management1.length);
				}
			} else {
				system1.push(snapshot1.key);
				if(system1 != null){
					$('#system1').text(system1.length);
				}
			} 
	})

	firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('보류').on('child_added', function(snapshot1){
		if(snapshot1.val().type == '세법'){
			taxLaw2.push(snapshot1.key);
			if(taxLaw2 != null){
				$('#taxLaw2').text(taxLaw2.length);
			}
		} else if (snapshot1.val().type == '운용'){
			management2.push(snapshot1.key);
			if(management2 != null){
				$('#management2').text(management2.length);
			}
		} else if (snapshot1.val().type == '시스템'){
			system2.push(snapshot1.key);
			if(system2 != null){
				$('#system2').text(system2.length);
			}
		}
	})
	
	firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('등록').on('child_added', function(snapshot1){
		if(snapshot1.val().type == '세법'){
			taxLaw4.push(snapshot1.key);
			if(taxLaw4 != null){
				$('#taxLaw4').text(taxLaw4.length);
			}
		} else if (snapshot1.val().type == '운용'){
			management4.push(snapshot1.key);
			if(management4 != null){
				$('#management4').text(management4.length);
			}
		} else if (snapshot1.val().type == '시스템'){
			system4.push(snapshot1.key);
			if(system4 != null){
				$('#system4').text(system4.length);
			}
		}
	})
	
	firebase.database().ref('qnaWrite/').orderByChild('status').equalTo('검토중').on('child_added', function(snapshot1){
		if(snapshot1.val().type == '세법'){
			taxLaw5.push(snapshot1.key);
			if(taxLaw5 != null){
				$('#taxLaw5').text(taxLaw5.length);
			}
		} else if (snapshot1.val().type == '운용'){
			management5.push(snapshot1.key);
			if(management5 != null){
				$('#management5').text(management5.length);
			}
		} else if (snapshot1.val().type == '시스템'){
			system5.push(snapshot1.key);
			if(system5 != null){
				$('#system5').text(system5.length);
			}
		}
	})
	MonthPosts();
	
	$('#monthSelect').change(function(){
		MonthPosts();
	})
})

/* 달 별 집계 */
function MonthPosts(){
	var todayMonth;
	if(new Date().getMonth() == 12){
		todayMonth = 1;
	} else {
		todayMonth = new Date().getMonth() + 1;
	}
	
	for(var i=todayMonth; i>=1; i--){
		$('#monthSelect').append('<option value="' + i + '">' + i + '월</option>');
	}
	
	var month = $('#monthSelect option:selected').val();
	var dataSource1 = [];
	for(var k=1; k<=new Date().getDate(); k++){
		firebase.database().ref('monthPosts/' + new Date().getFullYear() + '/' + month + '/' + k).orderByKey().on('value', function(snapshot){
			firebase.database().ref('monthPosts/' + (new Date().getFullYear() - 1)).remove();
			var chartValue1;
			if(snapshot.val() != ''){
				chartValue1=snapshot.numChildren();
			}
			var value = [];
				dataSource1.push({
					y: chartValue1,
					x: snapshot.key + '일'
				});
			$("#lineChart").dxChart({
		        palette: "Soft Pastel",
		        dataSource: dataSource1,
		        equalBarWidth: {
                    width: 18
                },
		        commonSeriesSettings: {
		            type: "bar",
		            argumentField: 'x'
		        },
		        margin: {
		            bottom: 20
		        },
		        series: [
		            { valueField: "y", name: "포스팅 수" },
		        ],
		        argumentAxis: {
		            tickInterval: 10
		        },
		        tooltip:{
		            enabled: true
		        },
		        legend: {
		            verticalAlignment: "bottom",
		            horizontalAlignment: "center",
		            itemTextPosition: 'top'
		        },
		        "export": {
		            enabled: true
		        }
		    }).dxChart("instance");
		})
	}
}

