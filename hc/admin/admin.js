class AdminDashboard {
    constructor() {
        this.analyticsData = null;
        this.questionsData = null;
        this.init();
    }

    async init() {
        // Check authentication first
        const authenticated = await this.checkAuth();
        if (!authenticated) {
            window.location.href = 'login.html';
            return;
        }

        this.bindEvents();
        this.loadData();
    }

    async checkAuth() {
        try {
            const response = await fetch('auth-check.php');
            const result = await response.json();
            return result.authenticated;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    bindEvents() {
        document.getElementById('refresh-btn').addEventListener('click', () => this.loadData());
        document.getElementById('export-btn').addEventListener('click', () => this.exportCSV());
        document.getElementById('cleanup-btn').addEventListener('click', () => this.cleanupOldVotes());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
    }

    async logout() {
        try {
            const response = await fetch('auth-logout.php');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = 'login.html';
        }
    }

    async loadData() {
        this.showLoading(true);
        
        try {
            const [analyticsResponse, questionsResponse] = await Promise.all([
                fetch('get-analytics.php'),
                fetch('/../../data/questions.json')
            ]);

            if (!analyticsResponse.ok || !questionsResponse.ok) {
                throw new Error('Failed to load data');
            }

            this.analyticsData = await analyticsResponse.json();
            this.questionsData = await questionsResponse.json();
            
            this.renderDashboard();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading analytics data. Please check the console.');
        } finally {
            this.showLoading(false);
        }
    }

    renderDashboard() {
        this.renderStats();
        this.renderTopArticles();
        this.renderRecentVotes();
        this.renderSuspiciousActivity();
    }

    renderStats() {
        const stats = this.analyticsData.stats;
        
        document.getElementById('total-likes').textContent = stats.totalLikes.toLocaleString();
        document.getElementById('total-dislikes').textContent = stats.totalDislikes.toLocaleString();
        document.getElementById('unique-voters').textContent = stats.uniqueVoters.toLocaleString();
        document.getElementById('total-articles').textContent = stats.articlesWithVotes.toLocaleString();
    }

    renderTopArticles() {
        const tbody = document.getElementById('top-articles-body');
        tbody.innerHTML = '';

        this.analyticsData.topArticles.forEach(article => {
            const helpfulness = ((article.likes / (article.likes + article.dislikes)) * 100).toFixed(1);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${article.title}</strong><br>
                    <small style="color: #7f8c8d;">ID: ${article.id}</small>
                </td>
                <td>${article.likes}</td>
                <td>${article.dislikes}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="flex: 1; background: #ecf0f1; border-radius: 10px; overflow: hidden;">
                            <div style="width: ${helpfulness}%; background: #27ae60; height: 8px;"></div>
                        </div>
                        <span>${helpfulness}%</span>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderRecentVotes() {
        const tbody = document.getElementById('recent-votes-body');
        tbody.innerHTML = '';

        this.analyticsData.recentVotes.forEach(vote => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(vote.timestamp * 1000).toLocaleString()}</td>
                <td>${vote.articleTitle}</td>
                <td>
                    <span class="vote-${vote.action}">
                        <i class="fas fa-thumbs-${vote.action === 'like' ? 'up' : 'down'}"></i>
                        ${vote.action === 'like' ? 'Like' : 'Dislike'}
                    </span>
                </td>
                <td>${vote.ip}</td>
            `;
            tbody.appendChild(row);
        });
    }

    renderSuspiciousActivity() {
        const tbody = document.getElementById('suspicious-body');
        tbody.innerHTML = '';

        this.analyticsData.suspiciousActivity.forEach(activity => {
            const row = document.createElement('tr');
            row.className = activity.voteCount > 20 ? 'suspicious-critical' : 
                           activity.voteCount > 10 ? 'suspicious-high' : '';
            
            row.innerHTML = `
                <td>${activity.ip}</td>
                <td>${activity.voteCount}</td>
                <td>${new Date(activity.lastActivity * 1000).toLocaleString()}</td>
                <td>
                    ${activity.voteCount > 20 ? 
                        '<span style="color: #c0392b;"><i class="fas fa-exclamation-triangle"></i> Critical</span>' :
                      activity.voteCount > 10 ?
                        '<span style="color: #e67e22;"><i class="fas fa-exclamation-circle"></i> High</span>' :
                        '<span style="color: #27ae60;"><i class="fas fa-check-circle"></i> Normal</span>'
                    }
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async exportCSV() {
        try {
            const response = await fetch('export-csv.php');
            if (!response.ok) throw new Error('Export failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vote-analytics-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting data. Please check the console.');
        }
    }

    async cleanupOldVotes() {
        if (!confirm('Clean up votes older than 30 days? This action cannot be undone.')) {
            return;
        }

        this.showLoading(true);
        
        try {
            const response = await fetch('cleanup-votes.php');
            const result = await response.json();
            
            if (result.success) {
                alert(`Successfully cleaned up ${result.cleanedCount} old votes.`);
                this.loadData(); // Refresh the dashboard
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Cleanup error:', error);
            alert('Error during cleanup. Please check the console.');
        } finally {
            this.showLoading(false);
        }
    }

    showLoading(show) {
        document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});