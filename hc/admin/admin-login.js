class AdminLogin {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
    }

    bindEvents() {
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    async checkExistingSession() {
        try {
            const response = await fetch('auth-check.php');
            const result = await response.json();
            
            if (result.authenticated) {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            // Not logged in, stay on login page
        }
    }

// In admin-login.js - Alternative approach
async handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    const loginBtn = event.target.querySelector('button');
    const originalText = loginBtn.innerHTML;
    
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    loginBtn.disabled = true;
    
    try {
        const response = await fetch('auth-login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            this.showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            this.showMessage(result.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        this.showMessage('Network error. Please try again.', 'error');
    } finally {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

    showMessage(message, type) {
        const messageEl = document.getElementById('login-message');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize login when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminLogin();
});