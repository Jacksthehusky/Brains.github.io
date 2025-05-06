<?php
session_start();
require_once __DIR__ . '/../config.php';

// Check authentication
if (!isset($_SESSION['authenticated'])) {
    header('Content-Type: application/json');
    http_response_code(403);
    die(json_encode(['success' => false, 'error' => 'Access denied']));
}

// Handle file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    header('Content-Type: application/json');
    
    try {
        $uploadDir = '../../screenshots/';
        $subfolder = isset($_POST['subfolder']) ? preg_replace('/[^a-zA-Z0-9]/', '', $_POST['subfolder']) : 'general';
        $fullDir = $uploadDir . $subfolder . '/';
        $stepNumber = isset($_POST['stepNumber']) ? (int)$_POST['stepNumber'] : 1;
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array(strtolower($extension), $allowedExtensions)) {
    throw new Exception('Invalid file type. Only JPG, PNG, GIF allowed.');
}
        // Create directory if needed
        if (!file_exists($fullDir)) {
            if (!mkdir($fullDir, 0777, true)) {
                throw new Exception('Failed to create directory');
            }
        }
        
        $file = $_FILES['file'];
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        
        // Generate filename with leading zero (01, 02, etc.)
        $filename = sprintf('%02d', $stepNumber) . '.' . $extension;
        $destination = $fullDir . $filename;
        
        // If file exists, delete it first
        if (file_exists($destination)) {
            unlink($destination);
        }
        
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            echo json_encode([
                'success' => true,
                'filename' => $filename,
                'path' => "../../screenshots/$subfolder/$filename"
            ]);
        } else {
            throw new Exception('File upload failed');
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
?>