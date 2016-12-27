

function pagestart() {
	window.setTimeout("pagereload()", 60000);
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
			        "export": {
			            enabled: true
			        }
			        
			    });
			})
		})
	})
	
	for(var j=0; j<=new Date().getHours(); j++){
		var dataSource = [];
		firebase.database().ref('timePosts/' + new Date().getDate() + '/' + j).on('value', function(snapshot){
			firebase.database().ref('timePosts/' + (new Date().getDate() - 1)).remove();
			if(snapshot.val() != undefined){
			var chartValue = [];
			chartValue.push(snapshot.numChildren());
			var	time = new Date().getHours();
			var value = [];
	
				dataSource.push({
					y: chartValue[0],
					x: snapshot.key
				});
			
			var chart = $("#barChart").dxChart({
		        palette: "Soft Pastel",
		        dataSource: dataSource,
		        commonSeriesSettings: {
		            type: "spline",
		            argumentField: "x"
		        },
		        commonAxisSettings: {
		            grid: {
		                visible: true
		            }
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
		            verticalAlignment: "top",
		            horizontalAlignment: "right"
		        },
		        "export": {
		            enabled: true
		        }
		    }).dxChart("instance");
			}
		})
	}
	
	$('#userPostNum').children('.ibox-content').remove();
	firebase.database().ref('users/').orderByKey().on('child_added', function(snapshot){
		firebase.database().ref('accept/').orderByChild('AcceptUserId').equalTo(snapshot.key).on('value', function(snapshot1){
			firebase.database().ref('reply/').orderByChild('userId').equalTo(snapshot.key).on('value', function(snapshot2){
				$('#userPostNum').append('<div class="ibox-content">' +
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
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw.push(snapshot1.key);
			$('#taxLaw3').text(taxLaw.length);
		} else if (snapshot1.val().postType == '운용'){
			management.push(snapshot1.key);
			$('#management3').text(management.length);
		} else if (snapshot1.val().postType == '기타'){
			etc.push(snapshot1.key);
			$('#etc3').text(etc.length);
		} else {
			system.push(snapshot1.key);
			$('#system3').text(system.length);
		}
	})
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw1.push(snapshot1.key);
			$('#taxLaw1').text(taxLaw1.length);
		} else if (snapshot1.val().postType == '운용'){
			management1.push(snapshot1.key);
			$('#management1').text(management1.length);
		} else if (snapshot1.val().postType == '기타'){
			etc1.push(snapshot1.key);
			$('#etc1').text(etc1.length);
		} else {
			system1.push(snapshot1.key);
			$('#system1').text(system1.length);
		}
	})

	firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('child_added', function(snapshot1){
		if(snapshot1.val().postType == '세법'){
			taxLaw2.push(snapshot1.key);
			$('#taxLaw2').text(taxLaw2.length);
		} else if (snapshot1.val().postType == '운용'){
			management2.push(snapshot1.key);
			$('#management2').text(management2.length);
		} else if (snapshot1.val().postType == '기타'){
			etc2.push(snapshot1.key);
			$('#etc2').text(etc2.length);
		} else {
			system2.push(snapshot1.key);
			$('#system2').text(system2.length);
		}
	})
})


