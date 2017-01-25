function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var key = getParameterByName('no');

/* addClient function */
function addClient(clientLicense, company, clientEmail, clientName, clientAddress, clientPosition,
		   clientDepartment, clientWorkPhone, clientPhone, clientExtension, clientFax, grade){
	var clientData = {
		clientLicense: clientLicense,
		company: company,
		clientEmail: clientEmail,
		clientName: clientName,
		clientAddress: clientAddress,
		clientPosition: clientPosition,
		clientDepartment: clientDepartment,
		clientWorkPhone: clientWorkPhone,
		clientPhone: clientPhone,
		clientExtension: clientExtension,
		clientFax: clientFax,
		grade: grade
	};
	
	var newClientKey = firebase.database().ref().child('clients').push().key;
	var newClientKey1 = firebase.database().ref().child('clients').push().key;
	
	var updates = {};
	updates['/clients/' + newClientKey1 + '/' + newClientKey] = clientData;
	
	return firebase.database().ref().update(updates);
}

/* client 저장 */
$('#customerAdd').click(function(){
	var company = '';
	var clientName = $('#customerName').val();
	var clientPosition = $('#customerPosition').val();
	var clientDepartment = $('#customerDepartment').val();
	var clientWorkPhone = $('.workPhone').val();
	var grade = '0';
	var clientExtension = $('#clientExtension').val();
	var clientPhone = $('.mobilePhone').val();
	var clientFax = $('.fax').val();
	var clientEmail = $('.email').val();
	var clientAddress = '';
	
	/* hash에 key가 있을 시 */
	if(key != ''){
		firebase.database().ref('company/').orderByChild('name').equalTo($('#cusCompany').val()).on('child_added', function(snapshot){
			clientLicense = snapshot.val().corporate;
			company = snapshot.key;
		})
		
		firebase.database().ref('clients/' + key).on('child_added', function(snapshot){
			firebase.database().ref('clients/' + key + '/' + snapshot.key).update({
				clientName: clientName,
				company: company,
				clientDepartment: clientDepartment,
				clientPosition: clientPosition,
				clientEmail: clientEmail,
				clientFax: clientFax,
				clientPhone: clientPhone,
				clientWorkPhone: clientWorkPhone
			})
		})
	} else {
		firebase.database().ref('company/').orderByChild('name').equalTo($('#cusCompany').val()).on('child_added', function(snapshot){
			clientLicense = snapshot.val().corporate;
			clientAddress = snapshot.val().addr;
			company = snapshot.key;
		})
		console.log($('#mobilePhoneInput').val());
		addClient(clientLicense, company, clientEmail, clientName, clientAddress, clientPosition,
				   clientDepartment, clientWorkPhone, clientPhone, clientExtension, clientFax, grade)
	}
})

var comName = [];
/* 회사 autocomplete 구성 */
firebase.database().ref("company/").on("child_added", function(snapshot){
	comName.push(snapshot.val().name);
	$(".typeahead_2").typeahead({ source: comName});
});

/* hash에 key가 있을 시 */
$(document).ready(function(){
	if(key != ''){
		firebase.database().ref('clients/' + key).on('child_added', function(snapshot){
			firebase.database().ref('company/' + snapshot.val().company).on('value', function(snapshot1){
				$('#cusCompany').val(snapshot1.val().name);
			})
			$('#customerName').val(snapshot.val().clientName);
			$('#customerDepartment').val(snapshot.val().clientDepartment);
			$('#customerPosition').val(snapshot.val().clientPosition);
			
			$('#workPhoneInput').val(snapshot.val().clientWorkPhone);
			$('#mobilePhoneInput').val(snapshot.val().clientPhone);
			$('#faxInput').val(snapshot.val().clientFax);
			$('#emailFormInput').val(snapshot.val().clientEmail);
		})
	} else {
		$('#cusCompany').val('');
		$('#customerName').val('');
		$('#customerDepartment').val('');
		$('#customerJob').val('');
		$('#customerPosition').val('');

		$('#workPhoneInput').val('');
		$('#mobilePhoneInput').val('');
		$('#faxInput').val('');
		$('#emailFormInput').val('');
	}
})