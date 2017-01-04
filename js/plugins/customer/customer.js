function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.hash);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var key = getParameterByName('no');

function addCustomer(cusName, cusDepartment, cusJob, cusPosition, workPhone, mobilePhone, fax, email, cusCompany){
	var customerData = {
		cusName: cusName,
		cusDepartment: cusDepartment,
		cusJob: cusJob,
		cusPosition: cusPosition,
		workPhone: workPhone,
		mobilePhone: mobilePhone,
		fax: fax,
		email: email,
		cusCompany: cusCompany
	};
	
	var newCustomerKey = firebase.database().ref().child('customer').push().key;
	
	var updates = {};
	updates['/customer/' + newCustomerKey] = customerData;
	
	return firebase.database().ref().update(updates);
}


function submitCustomer(){
	var cusName = $('#customerName').val();
	var cusDepartment = $('#customerDepartment').val();
	var cusJob = $('#customerJob').val();
	var cusPosition = $('#customerPosition').val();
	var cusCompany = $('#cusCompany').val();
	var workPhone = $('#workPhoneInput').val();
	var mobilePhone = $('#mobilePhoneInput').val();
	var fax = $('#faxInput').val();
	var email = $('#emailFormInput').val();
	
	if(key != ''){
		firebase.database().ref('customer/' + key).update({
			cusName: cusName,
			cusCompany: cusCompany,
			cusDepartment: cusDepartment,
			cusJob: cusJob,
			cusPosition: cusPosition,
			email: email,
			fax: fax,
			mobilePhone: mobilePhone,
			workPhone: workPhone
		})
	} else {
		addCustomer(cusName, cusDepartment, cusJob, cusPosition, workPhone, mobilePhone, fax, email, cusCompany);
	}
	
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

function phoneSectionInput(){
	$('#phoneSection').append('<select class="phoneDrop input-sm form-control input-s-sm inline">' +
            				  '<option value="직장전화">직장전화</option>' +
            				  '<option value="휴대전화">휴대전화</option>' +
            				  '<option value="팩스">팩스</option>' +
            				  '<option value="이메일">이메일</option>' +
            				  '</select>' +
							  '<input type="text" class="phoneInput form-control" placeholder="-제외" required>');
}

function phoneSectionRemove(){
	$('.phoneInput').last().remove();
	$('.phoneDrop').last().remove();
}

var comName = [];
firebase.database().ref("company/").orderByKey().on("child_added", function(snapshot){
	firebase.database().ref("company/" + snapshot.key + '/name').on('value', function(snapshot1){
		comName.push(snapshot1.val());
		$(".typeahead_2").typeahead({ source: comName});
	});
});

$(document).ready(function(){
	if(key != ''){
		firebase.database().ref('customer/' + key).on('value', function(snapshot){
			$('#cusCompany').val(snapshot.val().cusCompany);
			$('#customerName').val(snapshot.val().cusName);
			$('#customerDepartment').val(snapshot.val().cusDepartment);
			$('#customerJob').val(snapshot.val().cusJob);
			$('#customerPosition').val(snapshot.val().cusPosition);
			
			$('#workPhoneInput').val(snapshot.val().workPhone);
			$('#mobilePhoneInput').val(snapshot.val().mobilePhone);
			$('#faxInput').val(snapshot.val().fax);
			$('#emailFormInput').val(snapshot.val().email);
		})
	}
})