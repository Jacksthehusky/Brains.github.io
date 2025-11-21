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
    $questionsFile = __DIR__ . '/../../data/questions.json';

    if (!file_exists($analyticsFile) || !file_exists($questionsFile)) {
        throw new Exception('Data files not found');
    }

    $analytics = json_decode(file_get_contents($analyticsFile), true) ?? [];
    $rateLimits = file_exists($rateLimitsFile) ? json_decode(file_get_contents($rateLimitsFile), true) ?? [] : [];
    $questions = json_decode(file_get_contents($questionsFile), true) ?? [];

    // Process analytics data
    $articleStats = [];
    $recentVotes = [];
    $ipActivity = [];

    foreach ($analytics as $voteId => $vote) {
        if (!isset($vote['questionId']) || !isset($vote['action'])) continue;

        $questionId = $vote['questionId'];
        $action = $vote['action'];

        // Article statistics
        if (!isset($articleStats[$questionId])) {
            $articleStats[$questionId] = ['likes' => 0, 'dislikes' => 0];
        }

        if ($action === 'like') {
            $articleStats[$questionId]['likes']++;
        } else {
            $articleStats[$questionId]['dislikes']++;
        }

        // Recent votes (last 50)
        $recentVotes[] = [
            'timestamp' => $vote['timestamp'],
            'questionId' => $questionId,
            'action' => $action,
            'ip' => $vote['ip'] ?? 'unknown'
        ];

        // IP activity
        $ip = $vote['ip'] ?? 'unknown';
        if (!isset($ipActivity[$ip])) {
            $ipActivity[$ip] = ['count' => 0, 'lastActivity' => 0];
        }
        $ipActivity[$ip]['count']++;
        $ipActivity[$ip]['lastActivity'] = max($ipActivity[$ip]['lastActivity'], $vote['timestamp']);
    }

    // Sort recent votes by timestamp (newest first)
    usort($recentVotes, function($a, $b) {
        return $b['timestamp'] - $a['timestamp'];
    });
    $recentVotes = array_slice($recentVotes, 0, 50);

    // Prepare top articles
    $topArticles = [];
    foreach ($articleStats as $questionId => $stats) {
        $question = array_filter($questions, function($q) use ($questionId) {
            return $q['id'] == $questionId;
        });
        $question = reset($question);

        if ($question) {
            $topArticles[] = [
                'id' => $questionId,
                'title' => $question['abbr'] ?? 'Unknown Article',
                'likes' => $stats['likes'],
                'dislikes' => $stats['dislikes']
            ];
        }
    }

    // Sort by helpfulness (likes / total votes)
    usort($topArticles, function($a, $b) {
        $aRatio = $a['likes'] / ($a['likes'] + $a['dislikes']);
        $bRatio = $b['likes'] / ($b['likes'] + $b['dislikes']);
        return $bRatio <=> $aRatio;
    });

    // Prepare suspicious activity
    $suspiciousActivity = [];
    foreach ($ipActivity as $ip => $data) {
        if ($data['count'] > 5) { // More than 5 votes from same IP
            $suspiciousActivity[] = [
                'ip' => $ip,
                'voteCount' => $data['count'],
                'lastActivity' => $data['lastActivity']
            ];
        }
    }

    // Sort by vote count (highest first)
    usort($suspiciousActivity, function($a, $b) {
        return $b['voteCount'] <=> $a['voteCount'];
    });

    // Prepare response
    $response = [
        'stats' => [
            'totalLikes' => array_sum(array_column($articleStats, 'likes')),
            'totalDislikes' => array_sum(array_column($articleStats, 'dislikes')),
            'uniqueVoters' => count($ipActivity),
            'articlesWithVotes' => count($articleStats)
        ],
        'topArticles' => array_slice($topArticles, 0, 10),
        'recentVotes' => array_map(function($vote) use ($questions) {
            $question = array_filter($questions, function($q) use ($vote) {
                return $q['id'] == $vote['questionId'];
            });
            $question = reset($question);
            
            return [
                'timestamp' => $vote['timestamp'],
                'articleTitle' => $question['abbr'] ?? 'Unknown Article',
                'action' => $vote['action'],
                'ip' => $vote['ip']
            ];
        }, $recentVotes),
        'suspiciousActivity' => $suspiciousActivity
    ];

    echo json_encode($response, JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>