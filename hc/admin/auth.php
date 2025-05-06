<?php
session_start();
require_once '../config.php';

// Hardcoded admin credentials (in production, use database with password hashing)
$valid_username = "admin";
$valid_password = "Br@ins0000"; 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($username === $valid_username && $password === $valid_password) {
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