<?php 

$errors = '';
$myemail = $_POST['recipient'];
$name = $_POST['fullname'];
$email_address = $_POST['emailaddress'];
$telephone = $_POST['telephone'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$redirect = $_POST['redirect'];

if (empty($myemail)) {
	$myemail = 'michel@brains-lb.com';
}

if(empty($name)  ||
   empty($email_address) ||
   empty($telephone) ||
   empty($subject) ||
   empty($message))
{
    $errors .= "\n Error: all fields are required";
}

if (!preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", $email_address))
{
    $errors .= "\n Error: Invalid email address";
}

if(empty($errors))
{
	$message = nl2br($message);
	$email_subject = "[Web] '$subject' from '$name'";
	$email_body = "<p><i>You have received a new message from the Brains website.</i></p>".
	"<b>Full Name:</b> $name<br><b>Email:</b> $email_address<br><b>Telephone:</b> $telephone<br><b>Message:</b><p style=\"margin-left: 1em; padding-left: 0.5em;\">$message</p>"; 

	// Always set content-type when sending HTML email

	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
	$headers .= 'From: '. $name .' <'. $email_address .'>'; 
	$headers .= "Reply-To: $email_address";

	mail($myemail, $email_subject, $email_body, $headers);

	//redirect to the 'thank you' page
	header('Location: ' . $redirect);
}

?>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> 

<html>

<head>

	<title>Contact form handler</title>

</head>



<body>

<!-- This page is displayed only if there is some error -->

<?php

echo nl2br($errors);

?>





</body>

</html>