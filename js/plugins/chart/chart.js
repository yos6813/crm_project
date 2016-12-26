

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
			console.log(new Date().getDate()-1);
			if(snapshot.val() != undefined){
			var chartValue = [];
			chartValue.push(snapshot.numChildren());
			var	time = new Date().getHours();
			var value = [];
	
			console.log(chartValue[0]);
				dataSource.push({
					y: chartValue[0],
					x: snapshot.key
				});
			
				console.log(dataSource[0], dataSource[1]);
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
	
	firebase.database().ref('users/').orderByKey().on('child_added', function(snapshot){
		console.log(snapshot.val().username);
	})
})


