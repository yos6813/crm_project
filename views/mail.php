<?php
$name = $_POST['form_name'];
$email = $_POST['form_mail'];
$message = $_POST['form_message'];

$to = 'jina@happypay.co.kr';
$subject = 'test1234567890';
$message = 'FROM: '.$name.' Email: '.$email.'Message: '.$message;
$headers = 'From: jina@happypay.co.kr' . "\r\n";

mail($to, $subject, $message, $headers); //This method sends the mail.
echo "Your email was sent!"; // success message
?>