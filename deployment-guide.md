# AWS EC2 & CI/CD Deployment Guide

This guide describes how to deploy the **DevOps Command Explorer** application on an AWS EC2 instance using a self-hosted GitHub Actions runner with secure IAM OIDC federation.

---

## 1. Provision AWS EC2 Instance

1. **Launch EC2 Instance**:
   * **OS**: Amazon Linux 2023 or Ubuntu 24.04 LTS.
   * **Instance Type**: `t3.micro` (or `t2.micro` free-tier eligible).
   * **Network/Security Groups**:
     * Allow inbound port `22` (SSH) for administration.
     * Allow inbound port `3000` (Frontend) and `8000` (Backend API) to access the application directly, or configure Nginx as a reverse proxy on port `80`.
2. **Assign Elastic IP**: Associate an Elastic IP to the instance to preserve the public IP address across restarts.

---

## 2. Configure AWS OIDC Trust Relationship

To configure OIDC so GitHub Actions can authenticate with AWS without using permanent access keys or secrets:

### Step A: Create the OIDC Identity Provider in AWS IAM
1. Open the **IAM Console** in AWS.
2. Under **Access management**, select **Identity providers** -> **Add provider**.
3. Choose **OpenID Connect**.
4. Set the **Provider URL** to: `https://token.actions.githubusercontent.com`
5. Set the **Audience** to: `sts.amazonaws.com`
6. Click **Get thumbprint** and then **Add provider**.

### Step B: Create the IAM Role for Deployment
1. Go to **Roles** -> **Create role**.
2. Select **Custom trust policy** and paste the following configuration (replace `YOUR_GITHUB_ORG_OR_USER`, `YOUR_REPO_NAME` and `YOUR_AWS_ACCOUNT_ID` with your details):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
         },
         "Action": "sts:AssumeRoleWithWebIdentity",
         "Condition": {
           "StringEquals": {
             "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
           },
           "StringLike": {
             "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_ORG_OR_USER/YOUR_REPO_NAME:ref:refs/heads/main"
           }
         }
       }
     ]
   }
   ```
3. Attach standard permissions required for deployment or server access (e.g. EC2 read permissions or custom deploy policy).
4. Save the role. Copy the **Role ARN** and save it as a GitHub Repository Secret named `AWS_ROLE_ARN`. Also, add your AWS Region as a repository secret named `AWS_REGION` (e.g., `us-east-1`).

---

## 3. Install EC2 Dependencies

Log in to your EC2 instance via SSH:
```bash
ssh -i "your-key.pem" ec2-user@your-ec2-ip
```

Update system and install Python, Git, and Node.js:
```bash
# Update packages
sudo dnf update -y   # (For Amazon Linux 2023)

# Install Python 3.12 and development tools
sudo dnf install python3.12 git -y

# Install Node.js v22 (using NodeSource distribution)
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install nodejs -y
```

---

## 4. Install and Register GitHub Self-Hosted Runner

1. Open your repository on GitHub.
2. Go to **Settings** -> **Actions** -> **Runners** -> **New self-hosted runner**.
3. Select **Linux** and **x64**.
4. Run the download and configuration commands displayed on the screen inside the `/home/ec2-user` directory of the EC2 instance. Example:
   ```bash
   mkdir actions-runner && cd actions-runner
   curl -o actions-runner-linux-x64-2.316.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.316.0/actions-runner-linux-x64-2.316.0.tar.gz
   tar xzf ./actions-runner-linux-x64-2.316.0.tar.gz
   ./config.sh --url https://github.com/YOUR_GITHUB_ORG_OR_USER/YOUR_REPO_NAME --token YOUR_RUNNER_TOKEN
   ```
5. Install the runner as a background systemd service so it runs at boot:
   ```bash
   sudo ./svc.sh install
   sudo ./svc.sh start
   ```

---

## 5. Systemd Services Provisioning

The application will run natively under Systemd. Place the service files in `/etc/systemd/system/` (which the GitHub Actions workflow manages automatically on deployment).

### 1. Backend Service (`/etc/systemd/system/backend.service`)
```ini
[Unit]
Description=DevOps Command Explorer FastAPI Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/devops-command-explorer/backend
ExecStart=/home/ec2-user/devops-command-explorer/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5
Environment=PORT=8000

[Install]
WantedBy=multi-user.target
```

### 2. Frontend Service (`/etc/systemd/system/frontend.service`)
```ini
[Unit]
Description=DevOps Command Explorer React Frontend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/devops-command-explorer/frontend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### 3. Service Commands
Use these commands on the EC2 instance to manage application runtimes:

```bash
# Reload changes made to service definitions
sudo systemctl daemon-reload

# Enable services to launch on OS boot
sudo systemctl enable backend.service
sudo systemctl enable frontend.service

# Check status of services
sudo systemctl status backend.service
sudo systemctl status frontend.service

# Restart services manually
sudo systemctl restart backend.service
sudo systemctl restart frontend.service
```

---

## 6. Triggering Deployments

Once OIDC and the self-hosted runner are configured, push any changes to your `main` branch:
```bash
git add .
git commit -m "feat: setup full-stack portal and systemd services"
git push origin main
```
GitHub Actions will automatically run the CI/CD pipeline on the runner, check out the code, compile the assets, copy them to `/home/ec2-user/devops-command-explorer/`, configure systemd services, and restart the backend/frontend service processes.
