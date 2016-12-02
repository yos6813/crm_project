function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var viewPageno = getParameterByName('no');


$('#viewYeta').hide();
$('#viewAcademy').hide();
$('#viewConsulting').hide();

$(document).ready(function(){
	firebase.database().ref('posts/' + viewPageno).on('value', function(snapshot){
		$('#viewCompany').text(snapshot.val().postCompany);
		$('#viewTitle').text(snapshot.val().title);
		$('#viewCustomer').text(snapshot.val().postCustomer);
		$('#viewCall').text(snapshot.val().postCusPhone);
		
		var client = [];
		var comClient = $('#viewCompany').text();
		firebase.database().ref("company/").orderByChild('name').equalTo(comClient).on('child_added', function(snapshot){
			firebase.database().ref("company/" + snapshot.key + "/client").on('value', function(snapshot1){
				client.push(snapshot1.val());
				for(var i=0; i<=client[0].length; i++){
					if(client[0][i] == 'yeta'){
						$('#viewYeta').show();
					}
					else if(client[0][i] == 'academy'){
						$('#viewAcademy').show();
					}
					else if(client[0][i] == 'consulting'){
						$('#viewConsulting').show();
					} 
				}
			})
		})
	})
})