// ZIVPN Application
const API_BASE = 'http://192.168.1.100:8000';
let selectedServer = null;
let selectedProtocol = 'openvpn';
let userAccount = {
    username: 'User123',
    email: 'user@zivpn.com',
    plan: 'FREE',
    dataUsed: '2.3',
    dataLimit: '50',
    daysLeft: 30,
    apiToken: 'zivpn_sk_test_xxxxxxxxxxxx'
};

const SERVERS = [
    {
        id: 'jnb-1',
        name: 'Johannesburg 1',
        emoji: '🏢',
        location: 'Johannesburg, Gauteng',
        ip: '41.185.23.105',
        port: 1194,
        type: 'FREE',
        users: 12,
        speed: '500 Mbps',
        protocol: 'openvpn'
    },
    {
        id: 'cpt-1',
        name: 'Cape Town 1',
        emoji: '🏖️',
        location: 'Cape Town, Western Cape',
        ip: '197.84.12.45',
        port: 1194,
        type: 'PRO',
        users: 8,
        speed: '1000 Mbps',
        protocol: 'v2ray'
    },
    {
        id: 'dur-1',
        name: 'Durban 1',
        emoji: '🌊',
        location: 'Durban, KwaZulu-Natal',
        ip: '102.165.34.78',
        port: 1194,
        type: 'FREE',
        users: 5,
        speed: '500 Mbps',
        protocol: 'openvpn'
    },
    {
        id: 'prt-1',
        name: 'Pretoria 1',
        emoji: '🏛️',
        location: 'Pretoria, Gauteng',
        ip: '41.186.45.12',
        port: 1194,
        type: 'PRO',
        users: 6,
        speed: '750 Mbps',
        protocol: 'ssh'
    },
    {
        id: 'blm-1',
        name: 'Bloemfontein 1',
        emoji: '🌾',
        location: 'Bloemfontein, Free State',
        ip: '197.82.56.89',
        port: 1194,
        type: 'BASIC',
        users: 3,
        speed: '400 Mbps',
        protocol: 'openvpn'
    },
    {
        id: 'ped-1',
        name: 'Port Elizabeth 1',
        emoji: '🐘',
        location: 'Port Elizabeth, Eastern Cape',
        ip: '102.165.123.45',
        port: 1194,
        type: 'FREE',
        users: 4,
        speed: '500 Mbps',
        protocol: 'openvpn'
    },
    {
        id: 'iso-1',
        name: 'Isando 1',
        emoji: '🏭',
        location: 'Isando, Johannesburg',
        ip: '41.185.98.34',
        port: 1194,
        type: 'PREMIUM',
        users: 15,
        speed: '2000 Mbps',
        protocol: 'v2ray'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadServers();
    setupEventListeners();
    checkConnection();
});

// Load servers
function loadServers() {
    const container = document.getElementById('servers-container');
    container.innerHTML = '';

    SERVERS.forEach(server => {
        const card = document.createElement('div');
        card.className = 'server-card';
        card.innerHTML = `
            <div class="server-header">
                <div class="server-name">${server.emoji} ${server.name}</div>
                <span class="server-badge ${server.type.toLowerCase()}">${server.type}</span>
            </div>
            <div class="server-info">
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${server.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Speed:</span>
                    <span class="info-value">⚡ ${server.speed}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Users:</span>
                    <span class="info-value">${server.users}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Protocol:</span>
                    <span class="info-value">${server.protocol.toUpperCase()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="server-status">● Online</span>
                </div>
            </div>
            <div class="server-actions">
                <button class="btn btn-primary" onclick="selectServer('${server.id}')">Select</button>
                <button class="btn btn-secondary" onclick="viewConfig('${server.id}')">Config</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Select server
function selectServer(serverId) {
    selectedServer = SERVERS.find(s => s.id === serverId);
    if (!selectedServer) return;

    // Update UI
    document.querySelectorAll('.server-card').forEach(card => card.classList.remove('selected'));
    event.target.closest('.server-card').classList.add('selected');

    showNotification(`✓ ${selectedServer.name} selected!`, 'success');
    updateSelectedServerDisplay();
}

// View config
function viewConfig(serverId) {
    selectServer(serverId);
    navigateTo('config');
}

// Generate config based on protocol
function generateConfig() {
    if (!selectedServer) {
        showNotification('Please select a server first', 'error');
        return '';
    }

    const protocol = document.querySelector('input[name="protocol"]:checked')?.value || 'openvpn';

    switch (protocol) {
        case 'openvpn':
            return generateOpenVPNConfig();
        case 'v2ray':
            return generateV2RayConfig();
        case 'ssh':
            return generateSSHConfig();
        default:
            return 'Invalid protocol';
    }
}

function generateOpenVPNConfig() {
    return `# ZIVPN OpenVPN UDP Configuration
# Server: ${selectedServer.name}
# Location: ${selectedServer.location}
# Generated: ${new Date().toLocaleString()}

remote ${selectedServer.ip} ${selectedServer.port} udp
proto udp

dev tun
resolv-retry infinite
noexec
ubind
user nobody
group nogroup

ca ca.crt
cert client.crt
key client.key
tls-auth ta.key 1

cipher AES-256-CBC
auth SHA256
compression lz4

verb 3
mute 20

persist-key
persist-tun
status openvpn-status.log
log-append openvpn.log

# ZIVPN FREE TIER
# Bandwidth: 50GB/month
# Speed: ${selectedServer.speed}
# Expires: ${userAccount.daysLeft} days
`;
}

function generateV2RayConfig() {
    const configObj = {
        inbounds: [{
            port: 10808,
            protocol: 'socks',
            sniffing: { enabled: true, destOverride: ['http', 'tls'] },
            settings: { auth: 'noauth' }
        }],
        outbounds: [{
            protocol: 'vmess',
            settings: {
                vnodes: [{
                    address: selectedServer.ip,
                    port: selectedServer.port,
                    id: 'zivpn-' + Math.random().toString(36).substr(2, 9),
                    alterId: 64,
                    security: 'auto'
                }]
            },
            streamSettings: {
                network: 'udp',
                udpSettings: { connectionReuse: true }
            }
        }],
        dns: { servers: ['8.8.8.8', '1.1.1.1', '9.9.9.9'] },
        routing: { rules: [{ type: 'field', outbound: 'proxy', ip: ['geoip:private'], invert: true }] }
    };
    return JSON.stringify(configObj, null, 2);
}

function generateSSHConfig() {
    return `#!/bin/bash
# ZIVPN SSH Tunnel Configuration
# Server: ${selectedServer.name}
# Location: ${selectedServer.location}

# SSH Connection Parameters
SSH_HOST="${selectedServer.ip}"
SSH_PORT="22"
SSH_USER="vpnuser"
SSH_PASS="zivpn-password"
SSH_TUNNEL_PORT="9999"

# Local SOCKS5 Proxy
LOCAL_PORT="1080"

# Connect to VPN via SSH tunnel
echo "Connecting to ZIVPN SSH Tunnel..."

ssh -D $LOCAL_PORT \
    -p $SSH_PORT \
    -N -f \
    -o ConnectTimeout=30 \
    -o ServerAliveInterval=60 \
    -o ServerAliveCountMax=3 \
    -o StrictHostKeyChecking=no \
    $SSH_USER@$SSH_HOST

echo "✓ SSH Tunnel established on localhost:$LOCAL_PORT"
echo "Configure your apps to use SOCKS5 proxy: 127.0.0.1:$LOCAL_PORT"

# Disconnect
# pkill -f "ssh -D $LOCAL_PORT"
`;
}

// Copy config
function copyConfig() {
    const config = generateConfig();
    if (!config) return;

    navigator.clipboard.writeText(config).then(() => {
        showNotification('✓ Config copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy config', 'error');
    });
}

// Download config
function downloadConfig() {
    const config = generateConfig();
    if (!config) return;

    const filename = `zivpn-${selectedServer.id}-${selectedProtocol}.conf`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(config));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showNotification(`✓ Config downloaded: ${filename}`, 'success');
}

// Generate QR code
function generateQR() {
    if (!selectedServer) {
        showNotification('Please select a server first', 'error');
        return;
    }

    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = '';
    qrContainer.style.display = 'block';

    const qrText = `zivpn://server=${selectedServer.id}&protocol=${selectedProtocol}&ip=${selectedServer.ip}&port=${selectedServer.port}`;
    
    new QRCode(qrContainer, {
        text: qrText,
        width: 256,
        height: 256,
        colorDark: '#2563eb',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    showNotification('✓ QR Code generated!', 'success');
}

// Update display
function updateSelectedServerDisplay() {
    if (!selectedServer) {
        document.getElementById('selected-server').innerHTML = 'No server selected';
        document.getElementById('config-display').value = '';
        return;
    }

    document.getElementById('selected-server').innerHTML = `
        <strong>${selectedServer.emoji} ${selectedServer.name}</strong><br>
        ${selectedServer.location}<br>
        IP: ${selectedServer.ip} | Port: ${selectedServer.port}
    `;

    // Update config display
    document.getElementById('config-display').value = generateConfig();
}

// Handle create server
function handleCreateServer(event) {
    event.preventDefault();

    const name = document.getElementById('form-name').value;
    const location = document.getElementById('form-location').value;
    const vpnType = document.getElementById('form-vpn-type').value;
    const plan = document.getElementById('form-plan').value;
    const port = document.getElementById('form-port').value;

    if (!name || !location || !vpnType || !plan) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    showNotification(`✓ Server "${name}" created successfully!`, 'success');
    document.getElementById('create-form').reset();
    setTimeout(() => navigateTo('servers'), 1500);
}

// Account functions
function copyToken() {
    navigator.clipboard.writeText(userAccount.apiToken).then(() => {
        showNotification('✓ API token copied!', 'success');
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'warning');
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function deleteAccount() {
    if (confirm('WARNING: This will permanently delete your account and all data. Continue?')) {
        if (confirm('Are you absolutely sure? This cannot be undone!')) {
            showNotification('Account deleted. Goodbye!', 'warning');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }
}

// Navigation
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event?.target?.classList.add('active');

    // Scroll to top
    document.querySelector('.app-content').scrollTop = 0;
}

function toggleMenu() {
    const nav = document.getElementById('app-nav');
    nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
}

// Setup event listeners
function setupEventListeners() {
    const protocolInputs = document.querySelectorAll('input[name="protocol"]');
    protocolInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            selectedProtocol = e.target.value;
            updateSelectedServerDisplay();
        });
    });
}

// Connection check
function checkConnection() {
    const status = document.getElementById('connection-status');
    if (navigator.onLine) {
        status.textContent = '● Online';
        status.classList.add('online');
    } else {
        status.textContent = '● Offline';
        status.classList.remove('online');
    }
}

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Add initial config
window.addEventListener('load', () => {
    updateSelectedServerDisplay();
});
