// ZIVPN-ZA Frontend Application
const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let isLoggedIn = false;
let userPlan = 'FREE';
let planExpires = 30;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboard();
    setupPricing();
    loadServers();
});

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Simulate login
    if (email && password) {
        localStorage.setItem('token', 'token_' + Math.random());
        localStorage.setItem('email', email);
        currentUser = { email: email };
        isLoggedIn = true;
        userPlan = 'FREE';
        planExpires = 30;
        
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('dashboard').classList.add('active');
        showNotification('Login successful! Welcome to ZIVPN-ZA', 'success');
        loadDashboard();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        isLoggedIn = true;
        currentUser = { email: localStorage.getItem('email') };
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
    } else {
        document.getElementById('login-page').classList.add('active');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
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
    if (event && event.target) {
        event.target.classList.add('active');
    }
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
    document.getElementById('user-plan').textContent = userPlan;
    document.getElementById('plan-expires').textContent = `Expires in ${planExpires} days`;
}

// Load Servers
function loadServers() {
    const serversHTML = `
        <div class="server-card">
            <div class="server-header">
                <div class="server-name">🏢 Johannesburg Fast</div>
                <div class="server-status status-free">FREE</div>
            </div>
            <div class="server-info">
                <div class="info-row"><span>Location:</span> <span>Johannesburg, Gauteng</span></div>
                <div class="info-row"><span>Speed:</span> <span>⚡ 500 Mbps</span></div>
                <div class="info-row"><span>Users:</span> <span>12/50</span></div>
                <div class="info-row"><span>Bandwidth:</span> <span>50 GB/month</span></div>
                <div class="info-row"><span>Expires:</span> <span>30 days</span></div>
            </div>
            <div class="server-actions">
                <button class="btn btn-success" onclick="connectVPN()">Connect</button>
                <button class="btn btn-primary" onclick="showPage('config')">Config</button>
                <button class="btn btn-danger" onclick="deleteServer('Johannesburg')">Delete</button>
            </div>
        </div>
        <div class="server-card">
            <div class="server-header">
                <div class="server-name">🏖️ Cape Town Premium</div>
                <div class="server-status status-active">ACTIVE</div>
            </div>
            <div class="server-info">
                <div class="info-row"><span>Location:</span> <span>Cape Town, Western Cape</span></div>
                <div class="info-row"><span>Speed:</span> <span>⚡ 1000 Mbps</span></div>
                <div class="info-row"><span>Users:</span> <span>8/100</span></div>
                <div class="info-row"><span>Bandwidth:</span> <span>Unlimited</span></div>
                <div class="info-row"><span>Cost:</span> <span>R199/month</span></div>
            </div>
            <div class="server-actions">
                <button class="btn btn-success" onclick="connectVPN()">Connect</button>
                <button class="btn btn-primary" onclick="showPage('config')">Config</button>
                <button class="btn btn-danger" onclick="deleteServer('Cape Town')">Delete</button>
            </div>
        </div>
    `;
    document.getElementById('servers-list').innerHTML = serversHTML;
}

// Create Server
function handleCreateServer(e) {
    e.preventDefault();
    
    const serverData = {
        name: document.getElementById('server-name').value,
        location: document.getElementById('server-location').value,
        type: document.getElementById('server-type').value,
        bandwidth: document.getElementById('bandwidth').value,
        maxConnections: document.getElementById('max-connections').value
    };

    showNotification(`Server "${serverData.name}" created successfully!\nCheck your email for connection details.`, 'success');
    document.getElementById('create-server-form').reset();
    
    setTimeout(() => {
        showPage('servers');
        loadServers();
    }, 2000);
}

// Pricing
function setupPricing() {
    const pricing = {
        free: { price: 0, name: 'FREE TIER' },
        basic: { price: 49, name: 'Basic' },
        standard: { price: 99, name: 'Standard' },
        premium: { price: 199, name: 'Premium' },
        enterprise: { price: 399, name: 'Enterprise' }
    };

    const select = document.getElementById('server-type');
    select.addEventListener('change', () => {
        updateServerType(select.value);
    });
}

function updateServerType(type) {
    const pricing = {
        free: { base: 0, name: 'FREE (1 Month)' },
        basic: { base: 49, name: 'Basic' },
        standard: { base: 99, name: 'Standard' },
        premium: { base: 199, name: 'Premium' },
        enterprise: { base: 399, name: 'Enterprise' }
    };

    if (type) {
        const basePrice = pricing[type]?.base || 0;
        const bandwidth = document.getElementById('bandwidth').value;
        const ddosCost = document.getElementById('ddos-protection').checked ? 50 : 0;
        
        const total = basePrice + ddosCost;
        
        if (type === 'free') {
            document.getElementById('price-display').textContent = '🎁 FREE FOR 1 MONTH';
            document.querySelector('.price-info').classList.add('free');
            document.getElementById('price-details').textContent = 'After 1 month: R49/month. Cancel anytime.';
        } else {
            document.getElementById('price-display').textContent = `R${total}.00/month`;
            document.querySelector('.price-info').classList.remove('free');
            document.getElementById('price-details').textContent = `${pricing[type].name} - ${bandwidth}GB bandwidth${ddosCost > 0 ? ' + DDoS Protection' : ''}`;
        }
    }
}

// Config Management
function copyConfig() {
    const config = generateWireGuardConfig();
    navigator.clipboard.writeText(config);
    showNotification('Configuration copied to clipboard!', 'success');
}

function downloadConfig() {
    const config = generateWireGuardConfig();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(config));
    element.setAttribute('download', 'zivpn-za.conf');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification('Configuration downloaded!', 'success');
}

function generateWireGuardConfig() {
    return `[Interface]
PrivateKey = WEY7ERt4eCC1jFAQfAjvWmNyM8RyXH8H7lIOe5xd724=
Address = 10.0.0.2/24
DNS = 8.8.8.8, 1.1.1.1, 9.9.9.9

[Peer]
PublicKey = HIgo9xNzJMu7lXgV3xlaW7DJ4vJ8zq6IVapisQHnSXc=
Endpoint = 41.185.23.105:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25`;
}

function openPlayStore() {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.wireguard.android';
}

function connectVPN() {
    showNotification('VPN connection initiated. Check your WireGuard app!', 'success');
}

function deleteServer(name) {
    if (confirm(`Delete server "${name}"?`)) {
        showNotification(`Server "${name}" deleted successfully!`, 'success');
        loadServers();
    }
}

// Settings
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

function toggleAuth(e) {
    e.preventDefault();
    showNotification('Sign up for FREE 1-month trial now!', 'success');
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}
