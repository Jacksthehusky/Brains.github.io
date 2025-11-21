<?php
session_start();
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="vote-analytics.csv"');

// Check authentication
if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized - Please login']);
    exit;
}

try {
    $analyticsFile = __DIR__ . '/../../data/vote_analytics.json';
    $questionsFile = __DIR__ . '/../../data/questions.json';

    if (!file_exists($analyticsFile) || !file_exists($questionsFile)) {
        throw new Exception('Data files not found');
    }

    $analytics = json_decode(file_get_contents($analyticsFile), true) ?? [];
    $questions = json_decode(file_get_contents($questionsFile), true) ?? [];

    $output = fopen('php://output', 'w');
    
    // CSV header
    fputcsv($output, ['Timestamp', 'Date', 'Article ID', 'Article Title', 'Vote Type', 'IP Address', 'User Agent']);

    foreach ($analytics as $voteId => $vote) {
        if (!isset($vote['questionId']) || !isset($vote['action'])) continue;

        $question = array_filter($questions, function($q) use ($vote) {
            return $q['id'] == $vote['questionId'];
        });
        $question = reset($question);

        fputcsv($output, [
            $vote['timestamp'],
            date('Y-m-d H:i:s', $vote['timestamp']),
            $vote['questionId'],
            $question['abbr'] ?? 'Unknown Article',
            $vote['action'] === 'like' ? 'Like' : 'Dislike',
            $vote['ip'] ?? 'unknown',
            $vote['userAgent'] ?? 'unknown'
        ]);
    }

    fclose($output);

} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
?>
