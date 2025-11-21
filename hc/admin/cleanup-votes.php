<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Check authentication
if (!isset($_SESSION['admin_authenticated']) || $_SESSION['admin_authenticated'] !== true) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized - Please login']);
    exit;
}

try {
    $analyticsFile = __DIR__ . '/../../data/vote_analytics.json';
    $rateLimitsFile = __DIR__ . '/../../data/rate_limits.json';

    if (!file_exists($analyticsFile)) {
        throw new Exception('Analytics file not found');
    }

    $analytics = json_decode(file_get_contents($analyticsFile), true) ?? [];
    $rateLimits = file_exists($rateLimitsFile) ? json_decode(file_get_contents($rateLimitsFile), true) ?? [] : [];

    $thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
    $initialCount = count($analytics);

    // Cleanup analytics (keep only last 30 days)
    $analytics = array_filter($analytics, function($vote) use ($thirtyDaysAgo) {
        return $vote['timestamp'] > $thirtyDaysAgo;
    });

    // Cleanup rate limits (keep only active limits)
    $rateLimits = array_filter($rateLimits, function($timestamp) use ($thirtyDaysAgo) {
        return $timestamp > $thirtyDaysAgo;
    });

    // Save cleaned data
    file_put_contents($analyticsFile, json_encode($analytics, JSON_PRETTY_PRINT));
    file_put_contents($rateLimitsFile, json_encode($rateLimits, JSON_PRETTY_PRINT));

    $cleanedCount = $initialCount - count($analytics);

    echo json_encode([
        'success' => true,
        'cleanedCount' => $cleanedCount,
        'remainingVotes' => count($analytics)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>