# ZIVPN - Custom VPN App Configuration Guide

## 🚀 Quick Access URL

```
http://192.168.1.100:8000/?cmd=user&vpnTunnelType=openvpn-udp&userPage=servers-list&type=1&serverType=v2ray&serverTypeProto=udp
```

### URL Parameters Explained:
- `cmd=user` - User command mode
- `vpnTunnelType=openvpn-udp` - Tunnel type (openvpn-udp, v2ray-udp, ssh-tunnel)
- `userPage=servers-list` - Page to load (servers-list, config, create, account)
- `type=1` - User type (1=Free, 2=Premium)
- `serverType=v2ray` - Server type (v2ray, openvpn, ssh)
- `serverTypeProto=udp` - Protocol (udp, tcp)

---

## 📲 Installation & Setup

### Step 1: Start the Application

#### Using Python (Recommended):
```bash
pkg install python -y
cd ~/Vps/frontend
python -m http.server 8000
```

#### Using Node.js:
```bash
npx http-server -p 8000
```

### Step 2: Find Your IP Address

```bash
ifconfig
```

Look for `inet` under `wlan0` or `eth0`

### Step 3: Access the App

Open browser on your phone:
```
http://YOUR_IP:8000
```

Replace `YOUR_IP` with your actual IP (e.g., `192.168.1.100`)

---

## 🎯 Creating UDP Configuration

### Method 1: Using Web Dashboard

1. Visit: `http://192.168.1.100:8000/?cmd=user&vpnTunnelType=openvpn-udp&userPage=servers-list&type=1`
2. Select a server
3. Go to "⚙️ Config" tab
4. Choose protocol:
   - **OpenVPN UDP** - Default, reliable
   - **V2Ray UDP** - Ultra fast
   - **SSH Tunnel** - Most secure
5. Copy or download config

### Method 2: Direct Link to Create Server

```
http://192.168.1.100:8000/?cmd=user&userPage=create&serverType=v2ray&serverTypeProto=udp&type=1
```

Fill in:
- Server Name: `My-VPN-1`
- Location: Any SA city
- VPN Type: V2Ray (for UDP)
- Plan: FREE (1 month trial)
- Port: 1194 (default)

---

## 📋 OpenVPN UDP Config Example

### Generated Config:
```ini
remote 41.185.23.105 1194 udp
proto udp
dev tun
cipher AES-256-CBC
auth SHA256
compression lz4
verb 3
```

### Import Steps:
1. Download `.conf` file from app
2. Install OpenVPN app from Google Play
3. Import the config file
4. Tap "Connect"

---

## 🚀 V2Ray UDP Configuration

### Generated V2Ray Config:
```json
{
  "inbounds": [{
    "port": 10808,
    "protocol": "socks",
    "settings": { "auth": "noauth" }
  }],
  "outbounds": [{
    "protocol": "vmess",
    "streamSettings": {
      "network": "udp",
      "udpSettings": { "connectionReuse": true }
    }
  }]
}
```

### Import in V2RayNG:
1. Install V2RayNG from Play Store
2. Click "+" button
3. Paste config JSON
4. Tap play icon

---

## 🔒 SSH Tunnel Configuration

### Generated SSH Script:
```bash
#!/bin/bash
ssh -D 1080 -p 22 vpnuser@41.185.23.105
```

### Using SSH:
1. Install Termux
2. Install openssh: `pkg install openssh`
3. Create script from config
4. Run: `bash ssh-tunnel.sh`
5. Use SOCKS5: 127.0.0.1:1080

---

## ✨ Available Servers

| Server | Location | IP | Type | Speed |
|--------|----------|----|----|-------|
| JNB-1 | Johannesburg | 41.185.23.105 | FREE | 500 Mbps |
| CPT-1 | Cape Town | 197.84.12.45 | PRO | 1000 Mbps |
| DUR-1 | Durban | 102.165.34.78 | FREE | 500 Mbps |
| PRT-1 | Pretoria | 41.186.45.12 | PRO | 750 Mbps |
| BLM-1 | Bloemfontein | 197.82.56.89 | BASIC | 400 Mbps |
| PED-1 | Port Elizabeth | 102.165.123.45 | FREE | 500 Mbps |
| ISO-1 | Isando | 41.185.98.34 | PREMIUM | 2000 Mbps |

---

## 🐛 Bug Fixes Applied

✅ Fixed: Navigation menu persistence  
✅ Fixed: Config not updating on protocol change  
✅ Fixed: Server selection not persisting  
✅ Fixed: QR code not generating  
✅ Fixed: Download button functionality  
✅ Fixed: Mobile responsiveness issues  
✅ Fixed: Form validation  
✅ Fixed: Notification display timing  
✅ Fixed: Connection status indicator  
✅ Fixed: API token generation  

---

## 🔧 Troubleshooting

### App Won't Load
```bash
# Check if server is running
ps aux | grep "http.server"

# Restart server
python -m http.server 8000
```

### Config Not Generating
- Make sure server is selected first
- Check browser console for errors
- Try different protocol

### Download Not Working
- Use Copy button instead
- Check browser download settings
- Try different browser

### Connection Issues
- Select closer server
- Try different protocol
- Check if port 1194 is open
- Verify VPN app is installed

---

## 📱 Recommended Apps

### OpenVPN
- **App**: OpenVPN Connect
- **Link**: https://play.google.com/store/apps/details?id=net.openvpn.openvpn

### V2Ray
- **App**: V2RayNG
- **Link**: https://play.google.com/store/apps/details?id=com.v2ray.ang

### SSH Tunnel
- **App**: Termux + OpenSSH
- **Link**: https://play.google.com/store/apps/details?id=com.termux

---

## 🎁 FREE Tier Benefits

✅ 1 Month Completely FREE  
✅ 50 GB/month Bandwidth  
✅ All 7 SA Server Locations  
✅ Support for All Protocols  
✅ UDP Fast Speeds  
✅ No Credit Card Required  

---

## 📞 Support

- **Email**: support@zivpn.com
- **GitHub**: https://github.com/nilengibongiseninzima-dotcom/Vps
- **Issues**: Use GitHub Issues for bug reports

---

**ZIVPN - Fast, Secure, South African VPN** 🇿🇦
