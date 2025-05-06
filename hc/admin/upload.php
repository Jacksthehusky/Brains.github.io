<?php
session_start();
require_once '../config.php';

// Check authentication
if (!isset($_SESSION['authenticated'])) {
    header("HTTP/1.1 403 Forbidden");
    exit(json_encode(['success' => false, 'error' => 'Access denied']));
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $uploadDir = '../screenshots/';
    $subfolder = isset($_POST['subfolder']) ? preg_replace('/[^a-zA-Z0-9]/', '', $_POST['subfolder']) : 'general';
    $fullDir = $uploadDir . $subfolder . '/';
    
    // Create directory if needed
    if (!file_exists($fullDir)) {
        mkdir($fullDir, 0777, true);
    }
    
    $file = $_FILES['file'];
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $destination = $fullDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'path' => "../screenshots/$subfolder/$filename"
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'File upload failed']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Invalid request']);
?>