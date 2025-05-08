<?php
session_start();
require_once __DIR__ . '/../config.php';

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
        // Validate inputs
        if (!isset($_POST['subfolder'])) {
            throw new Exception('Missing subfolder parameter');
        }

        $subfolder = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['subfolder']);
        if (empty($subfolder)) {
            throw new Exception('Invalid subfolder name');
        }

        $stepNumber = isset($_POST['stepNumber']) ? (int)$_POST['stepNumber'] : 1;
        $uploadDir = realpath(__DIR__ . '/../../screenshots/') . '/';
        
        if ($uploadDir === false) {
            throw new Exception('Cannot resolve screenshots directory');
        }

        $fullDir = $uploadDir . $subfolder . '/';
        
        // Create directory if needed
        if (!file_exists($fullDir)) {
            if (!mkdir($fullDir, 0755, true)) {
                throw new Exception('Failed to create directory: ' . $fullDir);
            }
        }

        // Validate file
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('Upload error: ' . $file['error']);
        }

        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($mime, $allowedTypes)) {
            throw new Exception('Invalid file type. Only JPG, PNG, GIF allowed.');
        }

        // Generate filename with leading zero (01, 02, etc.)
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = sprintf('%02d', $stepNumber) . '.' . $extension;
        $destination = $fullDir . $filename;
        
        // Delete existing file if it exists
        if (file_exists($destination)) {
            if (!unlink($destination)) {
                throw new Exception('Could not replace existing file');
            }
        }

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('File move failed. Check permissions.');
        }

        // Return success with correct path
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'path' => "../../screenshots/$subfolder/$filename"  
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request']);
?>