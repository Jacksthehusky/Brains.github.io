<?php
session_start();
require_once __DIR__ . '/../config.php';

// Check authentication
if (!isset($_SESSION['authenticated'])) {
    header('Content-Type: application/json');
    http_response_code(403);
    die(json_encode(['success' => false, 'error' => 'Access denied']));
}

// Set JSON header
header('Content-Type: application/json');

// CORRECT PATH to questions.json
$jsonFile = __DIR__ . '/../../data/questions.json';

try {
    // Get existing FAQs
    $faqs = json_decode(file_get_contents($jsonFile), true) ?: [];
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        $data = json_decode($_POST['data'] ?? '[]', true);
        
        if ($action === 'add') {
            // Generate new ID
            $newId = !empty($faqs) ? max(array_column($faqs, 'id')) + 1 : 1;
            
            $newFaq = [
                'id' => $newId,
                'requiresPermission' => $data['requiresPermission'] ?? false,
                'group' => $data['group'] ?? '',
                'abbr' => $data['abbr'] ?? '',
                'tag' => $data['tag'] ?? '',
                'q' => $data['q'] ?? '',
                'answer' => $data['answer'] ?? [],
                'notes' => $data['notes'] ?? '',
                'screenshots' => $data['screenshots'] ?? [],
                'video' => $data['video'] ?? '',
                'modifiedDateTime' => date('Y-m-d\TH:i:s'),
                'helpfulCount' => 0,
                'unhelpfulCount' => 0
            ];
            
            $faqs[] = $newFaq;
        }
        elseif ($action === 'update') {
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
                    break;
                }
            }
        } elseif ($action === 'delete') {
            $faqs = array_filter($faqs, function($faq) use ($data) {
                return $faq['id'] != $data['id'];
            });
            $faqs = array_values($faqs);
        }
        
         // Save back to file
         if (file_put_contents($jsonFile, json_encode($faqs, JSON_PRETTY_PRINT))) {
            echo json_encode([
                'success' => true,
                'message' => 'FAQ saved successfully',
                'data' => $action === 'add' ? end($faqs) : null
            ]);
        } else {
            throw new Exception('Failed to save data');
        }
        exit;
    }
    
    // For GET requests
    echo json_encode($faqs);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTrace()
    ]);
}
?>