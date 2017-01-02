

function pagestart() {
	window.setTimeout("pagereload()", 6000000);
}

function pagereload() {
	location.reload();
}

$(document).ready(function(){
	pagestart();
	firebase.database().ref('timePosts/' + new Date().getDate()-1).remove();
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('value', function(snapshot1){
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('value', function(snapshot2){
			firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('value', function(snapshot3){
				var chartResolve = snapshot1.numChildren();
				var chartDefer = snapshot3.numChildren();
				var chartAccept = snapshot2.numChildren();
				
			    var dataSource = [
			        { status: '해결', value: chartResolve },
			        { status: '보류', value: chartDefer },
			        { status: '접수', value: chartAccept },
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
			            clickedPoint.isSelected() ? '': location.hash = '#/index/call_list?type=' + name;
			        },
			        "export": {
			            enabled: true
			        }
			        
			    });
			})
		})
	})
	
	var dataSource = [];
	for(var j=0; j<=new Date().getHours(); j++){
		firebase.database().ref('timePosts/' + new Date().getDate() + '/' + j).on('value', function(snapshot){
			firebase.database().ref('timePosts/' + (new Date().getDate() - 1)).remove();
			var chartValue;
			if(snapshot.val() == undefined){
//				chartValue="0";
			} else {
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

			})
		})
	})
	
	var taxLaw = [];
	var system = [];
	var etc = [];
	var management = [];
	
	var taxLaw1 = [];
	var system1 = [];
	var etc1 = [];
	var management1 = [];
	
	var taxLaw2 = [];
	var system2 = [];
	var etc2 = [];
	var management2 = [];
	
	for(var i=1; i<=3; i++){
		$('#taxLaw' + i).click(function(){
			location.hash = '#/index/call_list?type=' + $(this).prev().text() + '&status=' + $(this).parent().prev().children().text();
		})
		
		$('#system' + i).click(function(){
			location.hash = '#/index/call_list?type=' + $(this).prev().text() + '&status=' + $(this).parent().prev().children().text();
		})
		
		$('#management' + i).click(function(){
			location.hash = '#/index/call_list?type=' + $(this).prev().text() + '&status=' + $(this).parent().prev().children().text();
		})
		
		$('#etc' + i).click(function(){
			location.hash = '#/index/call_list?type=' + $(this).prev().text() + '&status=' + $(this).parent().prev().children().text();
		})
	}
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw.push(snapshot1.key);
			if(taxLaw != null){
				$('#taxLaw3').text(taxLaw.length);
			}
		} else if (snapshot1.val().postType == '운용'){
			management.push(snapshot1.key);
			if(management != null){
				$('#management3').text(management.length);
			}
		} else if (snapshot1.val().postType == '기타'){
			etc.push(snapshot1.key);
			if(etc != null){
				$('#etc3').text(etc.length);
			}
		} else {
			system.push(snapshot1.key);
			if(system != null){
				$('#system3').text(system.length);
			}
		}
	})
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw1.push(snapshot1.key);
			if(taxLaw1 != null){
				$('#taxLaw1').text(taxLaw1.length);
			}
		} else if (snapshot1.val().postType == '운용'){
			management1.push(snapshot1.key);
			if(management1 != null){
				$('#management1').text(management1.length);
			}
		} else if (snapshot1.val().postType == '기타'){
			etc1.push(snapshot1.key);
			if(etc1 != null){
				$('#etc1').text(etc1.length);
			}
		} else {
			system1.push(snapshot1.key);
			if(system1 != null){
				$('#system1').text(system1.length);
			}
		}
	})

	firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw2.push(snapshot1.key);
			if(taxLaw2 != null){
				$('#taxLaw2').text(taxLaw2.length);
			}
		} else if (snapshot1.val().postType == '운용'){
			management2.push(snapshot1.key);
			if(management2 != null){
				$('#management2').text(management2.length);
			}
		} else if (snapshot1.val().postType == '기타'){
			etc2.push(snapshot1.key);
			if(etc2 != null){
				$('#etc2').text(etc2.length);
			}
		} else {
			system2.push(snapshot1.key);
			if(system2 != null){
				$('#system2').text(system2.length);
			}
		}
	})
	MonthPosts();
	
	$('#monthSelect').change(function(){
		MonthPosts();
	})
})


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
	for(var k=0; k<=31; k++){
		firebase.database().ref('monthPosts/' + new Date().getFullYear() + '/' + month + '/' + k).orderByKey().on('value', function(snapshot){
			firebase.database().ref('monthPosts/' + (new Date().getFullYear() - 1)).remove();
			var chartValue1;
			if(snapshot.val() == undefined){
//				chartValue1="";
			} else {
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
