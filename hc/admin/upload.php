<?php
session_start();
require_once '../config.php';

// Check authentication
if (!isset($_SESSION['authenticated'])) {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied");
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = '../../screenshots/';
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    // Create directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $file = $_FILES['file'];
    
    // Validate file type
    if (!in_array($file['type'], $allowedTypes)) {
        echo json_encode(['success' => false, 'error' => 'Invalid file type']);
        exit;
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $destination = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Return relative path
        echo json_encode(['success' => true, 'path' => '../../screenshots/' . $filename]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Upload failed']);
    }
    exit;
}

header("HTTP/1.1 400 Bad Request");
exit("Invalid request");
?>