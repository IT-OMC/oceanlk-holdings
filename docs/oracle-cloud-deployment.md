# 🚀 Oracle Cloud Full-Stack Deployment Guide (Ubuntu)

This guide is simplified to ensure we don't hit the "Timeout" issue again.

## 🤝 How GitHub connects to your Server
GitHub doesn't "permanently" connect. Instead, every time you **push code**:
1.  **GitHub** starts a temporary computer (a "Runner").
2.  The Runner reads your **Secrets** (IP, Key).
3.  The Runner uses **SSH** to "remote control" your Oracle Server.
4.  It sends your code, builds a **Docker image**, and restarts the application.

---

## Phase 1: The "Outer Door" (Oracle Web Console)
**[ACTION REQUIRED IN BROWSER]**
Before doing anything in the terminal, we must open the Oracle datacenter walls.

1.  Log in to **Oracle Cloud Console**.
2.  Go to **Networking** > **Virtual Cloud Networks** > Click your **VCN**.
3.  Click **Security Lists** (left side) > **Default Security List**.
4.  Click **Add Ingress Rules**:
    *   **Source CIDR**: `0.0.0.0/0`
    *   **Protocol**: `TCP`
    *   **Port Range**: `80, 443, 8080`
    *   **Description**: `Allow Web and API Traffic`
5.  Click **Add Ingress Rules**.

---

## Phase 2: The "Inner Door" & Tools (Server Terminal)
**[RUN ON SERVER VIA SSH]**
Run these one by one to prepare the server:

1.  **Clean up Firewall:**
    ```bash
    # Open OS ports
    sudo iptables -I INPUT 6 -p tcp --dport 80 -j ACCEPT
    sudo iptables -I INPUT 6 -p tcp --dport 443 -j ACCEPT
    sudo iptables -I INPUT 6 -p tcp --dport 8080 -j ACCEPT
    sudo netfilter-persistent save
    ```

2.  **Install Docker (Resolved Method):**
    ```bash
    # 1. Remove any conflicting packages
    sudo apt remove -y containerd runc
    
    # 2. Install Docker using the official simple script (more robust)
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # 3. Enable and check
    sudo systemctl enable --now docker
    sudo usermod -aG docker $USER
    ```
    *Important: Log out and SSH back in for the 'docker' group to work.*

3.  **Install Nginx:**
    ```bash
    sudo apt install -y nginx
    ```

---

## Phase 3: The "Connection Manager" (GitHub Secrets)
**[ACTION REQUIRED ON GITHUB WEBSITE]**
This is how GitHub gets permission to talk to your server.

Go to **Settings > Secrets and variables > Actions > New repository secret**:

| Name | Value |
| :--- | :--- |
| `OCI_HOST` | `80.225.206.73` |
| `OCI_USERNAME` | `ubuntu` |
| `OCI_KEY` | **Paste your private RSA key** |
| `ENV_PROD` | Production .env data (Include `CORS_ALLOWED_ORIGINS`) |
| `ENV_DEV` | Development .env data (Include `CORS_ALLOWED_ORIGINS`) |

### Environment Tips
**CORS Allowed Origins:** Ensure your `.env` contains:
`CORS_ALLOWED_ORIGINS=https://ocean.lk,https://www.ocean.lk,https://test.ocean.lk`

---

---

## Phase 5: SSL/TLS (HTTPS)
**[RUN ON SERVER VIA SSH]**
To secure your site with HTTPS:

1.  **Install Certbot:**
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    ```

2.  **Get Certificate:**
    ```bash
    # For production
    sudo certbot --nginx -d oceanlk.com -d www.oceanlk.com
    
    # For development subdomain
    sudo certbot --nginx -d test.ocean.lk
    ```

3.  **Auto-Renewal:**
    Certbot adds a cron job automatically, but you can test it:
    ```bash
    sudo certbot renew --dry-run
    ```
