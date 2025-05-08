<?php
session_start();

// Configuration - CHANGE THESE TO YOUR SECURE CREDENTIALS
$ADMIN_USERNAME = "admin123";         // Change this to your desired username
$ADMIN_PASSWORD = "admin123";     // Change this to a strong password

// Simple authentication
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $ADMIN_USERNAME && $password === $ADMIN_PASSWORD) {
        $_SESSION['authenticated'] = true;
        $_SESSION['username'] = $username;
        header("Location: dashboard.html");
        exit;
    } else {
        header("Location: index.html?error=1");
        exit;
    }
} else {
    header("Location: index.html");
    exit;
}
?>