<?php
// Set the recipient email address
$recipient_email = "hadi.moukamal@gmail.com";

// Collect form data
$name = $_POST['Name'];
$email = $_POST['Email'];
$phone = $_POST['Phone'];
$position = $_POST['Position'];
$coverLetter = $_POST['CoverLetter'];

// File upload handling
$upload_dir = "uploads/";
$filename = $_FILES['Resume']['name'];
$tmp_name = $_FILES['Resume']['tmp_name'];
$filesize = $_FILES['Resume']['size'];
$filetype = $_FILES['Resume']['type'];
$file_path = $upload_dir . $filename;

// Move the uploaded file to the uploads directory
move_uploaded_file($tmp_name, $file_path);

// Compose email message
$subject = "Job Application: $position";
$message = "Name: $name\n";
$message .= "Email: $email\n";
$message .= "Phone: $phone\n";
$message .= "Position: $position\n";
$message .= "Cover Letter:\n$coverLetter\n";
$message .= "Resume: $filename\n";

// Send the email
$headers = "From: $email";
mail($recipient_email, $subject, $message, $headers);

// Redirect back to the careers page after submission
header("Location: careers.html");
exit();
?>
