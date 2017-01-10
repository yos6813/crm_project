<?php
$name = $_POST['form_name'];
$email = $_POST['form_mail'];
$message = $_POST['form_message'];

$to = 'jina@happypay.co.kr';
$subject = 'test1234567890';
$message = 'FROM: '.$name.' Email: '.$email.'Message: '.$message;
$headers = 'From: jina@happypay.co.kr' . "\r\n";

// if (filter_var($email, FILTER_VALIDATE_EMAIL)) { // this line checks that we have a valid email address
	mail($to, $subject, $message, $headers); //This method sends the mail.
	echo "Your email was sent!"; // success message
// }else{
// 	echo "Invalid Email, please provide an correct email.";
// }
?>