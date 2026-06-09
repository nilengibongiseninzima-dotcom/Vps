// ZIVPN-ZA Frontend Application
const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let isLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboard();
    setupPricing();
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            isLoggedIn = true;
            document.getElementById('login-page').classList.remove('active');
            document.getElementById('dashboard').classList.add('active');
            showNotification('Login successful!', 'success');
            loadDashboard();
        } else {
            showNotification('Login failed', 'error');
        }
    })
    .catch(err => {
        console.error(err);
        showNotification('Error logging in', 'error');
    });
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        isLoggedIn = true;
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
    } else {
        document.getElementById('login-page').classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('token');
    isLoggedIn = false;
    currentUser = null;
    location.reload();
}

// Page Navigation
function showPage(pageName) {
    if (!isLoggedIn && pageName !== 'login') return;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.target?.classList.add('active');
}

// Dashboard
function loadDashboard() {
    const statusHTML = `
        <div class="status-item">
            <div class="location-badge">🏢 Johannesburg</div>
            <div class="status">🟢 Online</div>
            <div class="users">12 Users</div>
        </div>
        <div class="status-item">
            <div class="location-badge">🏖️ Cape Town</div>
            <div class="status">🟢 Online</div>
            <div class="users">8 Users</div>
        </div>
        <div class="status-item">
            <div class="location-badge">🌊 Durban</div>
            <div class="status">🟢 Online</div>
            <div class="users">5 Users</div>
        </div>
        <div class="status-item">
            <div class="location-badge">🏛️ Pretoria</div>
            <div class="status">🟢 Online</div>
            <div class="users">6 Users</div>
        </div>
    `;
    document.getElementById('server-status').innerHTML = statusHTML;
    document.getElementById('total-servers').textContent = '4';
    document.getElementById('total-users').textContent = '31';
}

// Create Server
function handleCreateServer(e) {
    e.preventDefault();
    
    const serverData = {
        name: document.getElementById('server-name').value,
        location: document.getElementById('server-location').value,
        type: document.getElementById('server-type').value,
        bandwidth: document.getElementById('bandwidth').value,
        maxConnections: document.getElementById('max-connections').value,
        autoBackup: document.getElementById('auto-backup').checked,
        ddosProtection: document.getElementById('ddos-protection').checked
    };

    // Simulate server creation
    fetch(`${API_URL}/servers/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(serverData)
    })
    .then(res => res.json())
    .then(data => {
        showNotification(`Server "${serverData.name}" created successfully!`, 'success');
        document.getElementById('create-server-form').reset();
        setTimeout(() => showPage('servers'), 2000);
    })
    .catch(err => {
        console.error(err);
        showNotification('Error creating server', 'error');
    });
}

// Pricing
function setupPricing() {
    const pricing = {
        basic: { price: 49, ram: '512MB' },
        standard: { price: 99, ram: '1GB' },
        premium: { price: 199, ram: '2GB' },
        enterprise: { price: 399, ram: '4GB' }
    };

    const select = document.getElementById('server-type');
    select.addEventListener('change', () => {
        updateServerType(select.value);
    });
}

function updateServerType(type) {
    const pricing = {
        basic: 49,
        standard: 99,
        premium: 199,
        enterprise: 399
    };

    if (type) {
        const basePrice = pricing[type] || 0;
        const bandwidth = document.getElementById('bandwidth').value;
        const bandwidthCost = bandwidth === 'unlimited' ? 50 : 0;
        const ddosCost = document.getElementById('ddos-protection').checked ? 50 : 0;
        
        const total = basePrice + bandwidthCost + ddosCost;
        document.getElementById('price-display').textContent = `R${total}.00`;
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Utilities
function copyAPIKey() {
    const apiKey = document.getElementById('api-key').textContent;
    navigator.clipboard.writeText(apiKey);
    showNotification('API Key copied to clipboard!', 'success');
}

function generateNewKey() {
    const newKey = 'sk_test_' + Math.random().toString(36).substr(2, 20).toUpperCase();
    document.getElementById('api-key').textContent = newKey;
    showNotification('New API key generated!', 'success');
}

function saveProfile() {
    showNotification('Profile saved successfully!', 'success');
}

function toggleAuth() {
    // Toggle between login and signup
    const form = document.querySelector('#login-form');
    if (form.querySelector('input[type="password"]:nth-of-type(2)')) {
        // Already in signup mode, switch to login
        document.querySelector('.auth-toggle a').textContent = 'Sign Up';
    } else {
        // In login mode, switch to signup
        document.querySelector('.auth-toggle a').textContent = 'Login';
    }
}
