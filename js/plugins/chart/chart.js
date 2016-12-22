

function pagestart() {
	window.setTimeout("pagereload()", 60000);
}

function pagereload() {
	location.reload();
}

$(document).ready(function(){
	pagestart();
	
	firebase.database().ref('posts/').orderByChild('postState').equalTo('해결').on('value', function(snapshot1){
		firebase.database().ref('posts/').orderByChild('postState').equalTo('접수').on('value', function(snapshot2){
			firebase.database().ref('posts/').orderByChild('postState').equalTo('보류').on('value', function(snapshot3){
				var chartResolve = snapshot1.numChildren();
				var chartDefer = snapshot3.numChildren();
				var chartAccept = snapshot2.numChildren();
				
				var data = {
					labels: [
						"해결",
						"보류",
						"접수"
						],
						datasets: [
							{
								data: [chartResolve, chartDefer, chartAccept],
								backgroundColor: [
									"#FF6384",
					                "#36A2EB",
					                "#FFCE56"
								],
								hoverBackgroundColor: [
									"#FF6384",
					                "#36A2EB",
					                "#FFCE56"
								]
							}]
				};
				var ctx = $('#doughnutChart');
				var myDoughnutChart = new Chart(ctx, {
					type: 'doughnut',
					data: data
				});
			})
		})
	})
})

