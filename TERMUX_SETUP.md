# 🚀 ZIVPN-ZA Setup Guide for Termux on Android Phone

## Complete Step-by-Step Instructions

### **Phase 1: Install Termux & Required Packages**

#### Step 1: Install Termux
1. Open Google Play Store on your Android phone
2. Search for "Termux"
3. Install from "Fredrik Fornwall"
4. Open Termux

#### Step 2: Update and Install Dependencies
Copy and paste each command in Termux:

```bash
# Update package manager
pkg update && pkg upgrade -y

# Install Node.js and Python
pkg install nodejs python -y

# Install additional tools
pkg install git curl wget nano vim -y

# Install build tools
pkg install build-essential clang -y
```

---

### **Phase 2: Get Your IP Address**

Run this command to find your phone's IP address:

```bash
ifconfig
```

**Look for:**
- Under `wlan0` or `eth0`
- Find line starting with `inet`
- Your IP looks like: `192.168.x.x` or `10.0.x.x`

**Example:** `192.168.1.100`

---

### **Phase 3: Clone and Setup ZIVPN-ZA**

```bash
# Clone the repository
git clone https://github.com/nilengibongiseninzima-dotcom/Vps.git
cd Vps

# Switch to the infrastructure branch
git checkout zivpn-za-infrastructure

# Go to frontend folder
cd frontend
```

---

### **Phase 4: Start the Web Server**

#### Option A: Using Python (Recommended)

```bash
python -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000
```

#### Option B: Using Node.js HTTP Server

```bash
npx http-server -p 8000
```

**Keep this terminal window open!**

---

### **Phase 5: Access Dashboard on Your Phone**

#### In Your Browser:

**Replace `192.168.1.100` with your actual IP from Step 2**

```
http://192.168.1.100:8000
```

**Example full URL:** `http://192.168.1.100:8000`

---

### **Phase 6: Generate Your WireGuard Config**

#### Step 1: Create Config Directory

Open a **NEW Termux terminal** (don't close the web server):

```bash
# Generate WireGuard private key
wg genkey > ~/wg_private.key

# Generate corresponding public key
wg pubkey < ~/wg_private.key > ~/wg_public.key

# Display your keys
echo "=== YOUR PRIVATE KEY ==="
cat ~/wg_private.key
echo ""
echo "=== YOUR PUBLIC KEY ==="
cat ~/wg_public.key
```

#### Step 2: Create WireGuard Config File

```bash
# Create config directory
mkdir -p ~/.wireguard

# Create config file
nano ~/.wireguard/wg0.conf
```

**Paste this into the editor:**

```ini
[Interface]
PrivateKey = PASTE_YOUR_PRIVATE_KEY_HERE
Address = 10.0.0.2/24
DNS = 8.8.8.8, 1.1.1.1, 9.9.9.9
ListenPort = 51820

[Peer]
PublicKey = HIgo9xNzJMu7lXgV3xlaW7DJ4vJ8zq6IVapisQHnSXc=
Endpoint = 41.185.23.105:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

**Save and exit:**
1. Press `Ctrl + X`
2. Press `Y`
3. Press `Enter`

#### Step 3: Display Config in QR Code Format

```bash
# Install qrencode
pkg install qrencode -y

# Generate QR code
qrencode -t UTF8 < ~/.wireguard/wg0.conf
```

---

### **Phase 7: Export Config to Dashboard**

#### Download the Config File:

```bash
# Copy to web accessible location
cp ~/.wireguard/wg0.conf ~/Vps/frontend/

# Start simple server to download
cd ~/Vps/frontend
python -m http.server 9000
```

Then access: `http://192.168.1.100:9000/wg0.conf`

---

### **Phase 8: Install WireGuard on Your Phone**

1. Open Google Play Store
2. Search "WireGuard"
3. Install official WireGuard app
4. Open WireGuard app
5. Tap `+` to add new configuration
6. Choose "Create from file"
7. Select your `wg0.conf` file
8. Toggle to connect!

---

## 🎯 **Complete Terminal Commands (Copy & Paste)**

### Terminal 1 - Web Server:
```bash
pkg update && pkg upgrade -y
pkg install nodejs python git -y
git clone https://github.com/nilengibongiseninzima-dotcom/Vps.git
cd Vps && git checkout zivpn-za-infrastructure
cd frontend
python -m http.server 8000
```

### Terminal 2 - Generate Keys:
```bash
cd ~/Vps
wg genkey > ~/wg_private.key
wg pubkey < ~/wg_private.key > ~/wg_public.key
cat ~/wg_private.key
cat ~/wg_public.key
```

### Terminal 3 - Create Config:
```bash
mkdir -p ~/.wireguard
nano ~/.wireguard/wg0.conf
# (Paste config above, save with Ctrl+X, Y, Enter)
cat ~/.wireguard/wg0.conf
```

---

## 📱 **Access URLs**

| Service | URL |
|---------|-----|
| Dashboard | `http://192.168.1.100:8000` |
| Download Config | `http://192.168.1.100:9000/wg0.conf` |
| Config Display | View in Terminal |

---

## ✅ **Troubleshooting**

### "No Such File or Directory"
```bash
# Make sure you're in right folder
pwd  # Shows current directory
ls   # List files
```

### "Port Already in Use"
```bash
# Use different port
python -m http.server 8080  # Instead of 8000
```

### "Network Not Accessible"
```bash
# Check IP address
ifconfig

# Check if on same WiFi as computer
ping 192.168.1.1  # Try your router
```

### "WireGuard Connection Fails"
```bash
# Verify config syntax
cat ~/.wireguard/wg0.conf

# Check firewall
iptables -L
```

---

## 🔐 **Security Tips**

1. ✅ Keep your private key secret
2. ✅ Never share `.conf` files publicly
3. ✅ Use strong passwords
4. ✅ Keep WireGuard app updated
5. ✅ Enable auto-backup in dashboard

---

## 📞 **Quick Reference**

```bash
# View logs
cat ~/.local/share/wireguard/wg0.log

# Test connection
ping 8.8.8.8

# Show active connections
wg show

# Restart WireGuard
wg-quick down wg0
wg-quick up wg0
```

---

## ✨ **You're All Set!**

Your ZIVPN-ZA VPN is now:
- ✅ Running on your Android phone
- ✅ Configured with WireGuard
- ✅ Ready to use FREE for 1 month
- ✅ 50GB/month bandwidth
- ✅ ⚡ Fast servers

**Enjoy your South African VPN!** 🚀🇿🇦
