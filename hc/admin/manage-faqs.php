<?php
session_start();
require_once '../config.php';

// Check authentication
if (!isset($_SESSION['authenticated']) {
    header("HTTP/1.1 403 Forbidden");
    exit("Access denied");
}

// Set JSON header
header('Content-Type: application/json');

// Get FAQs
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $faqs = json_decode(file_get_contents('../data/questions.json'), true);
    echo json_encode($faqs);
    exit;
}

// Add/Update FAQ
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $data = json_decode($_POST['data'], true);
    
    $faqs = json_decode(file_get_contents('../data/questions.json'), true);
    
    if ($action === 'add') {
        // Generate new ID
        $newId = max(array_column($faqs, 'id')) + 1;
        
        // Create new FAQ
        $newFaq = [
            'id' => $newId,
            'requiresPermission' => $data['requiresPermission'] ?? false,
            'group' => $data['group'],
            'abbr' => $data['abbr'],
            'tag' => $data['tag'],
            'q' => $data['q'],
            'answer' => $data['answer'],
            'notes' => $data['notes'],
            'screenshots' => $data['screenshots'] ?? [],
            'video' => $data['video'] ?? '',
            'modifiedDateTime' => date('Y-m-d\TH:i:s'),
            'helpfulCount' => 0,
            'unhelpfulCount' => 0
        ];
        
        array_push($faqs, $newFaq);
    } elseif ($action === 'update') {
        // Update existing FAQ
        foreach ($faqs as &$faq) {
            if ($faq['id'] == $data['id']) {
                $faq = array_merge($faq, [
                    'requiresPermission' => $data['requiresPermission'] ?? false,
                    'group' => $data['group'],
                    'abbr' => $data['abbr'],
                    'tag' => $data['tag'],
                    'q' => $data['q'],
                    'answer' => $data['answer'],
                    'notes' => $data['notes'],
                    'modifiedDateTime' => date('Y-m-d\TH:i:s')
                ]);
                
                // Handle screenshots and video updates if needed
                break;
            }
        }
    } elseif ($action === 'delete') {
        // Delete FAQ
        $faqs = array_filter($faqs, function($faq) use ($data) {
            return $faq['id'] != $data['id'];
        });
        $faqs = array_values($faqs); // Reindex array
    }
    
    // Save back to file
    if (file_put_contents('../data/questions.json', json_encode($faqs, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save data']);
    }
    exit;
}
?>