# DevOps Command Explorer

DevOps Command Explorer is a modern learning portal designed for DevOps and Site Reliability Engineers to search, browse, bookmark, and manage commonly used terminal commands for Linux, Git, Docker, Kubernetes, Terraform, AWS CLI, and Jenkins.

The portal features a professional, cloud-themed dark UI with glassmorphic cards, telemetry metrics, inline SVG icons, and a zero-dependency static production server.

---

## Technical Stack
* **Frontend**: React.js, Vite, Axios, React Router, custom CSS
* **Backend**: Python FastAPI, Uvicorn, Pydantic, In-Memory storage
* **DevOps**: GitHub Actions (OIDC IAM auth), Systemd Services, AWS EC2

---

## Local Development Setup

### Prerequisites
* Python 3.12+
* Node.js v20.19.0+ and npm

### 1. Run Backend Locally
Navigate to the `backend/` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python -m venv venv
source venv/bin/activate
```

Install python dependencies:
```bash
pip install -r requirements.txt
```

Launch the FastAPI dev server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
The API Swagger docs will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Run Frontend Locally
Navigate to the `frontend/` directory:
```bash
cd frontend
```

Install node packages:
```bash
npm install
```

Start the Vite React development server:
```bash
npm run dev
```
Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

To test the production build locally:
```bash
npm run build
node server.js
```
The production server will be running on port 3000: [http://localhost:3000](http://localhost:3000)

---

## REST API Documentation

The FastAPI backend exposes the following endpoints:

| Method | Endpoint | Description | Request Body | Response Example |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/commands` | List all commands (supports query filtering by `search`, `category`, and `difficulty`) | None | `[{"id": 1, "command": "ls -la", "category": "Linux", ...}]` |
| **GET** | `/commands/{id}` | Retrieve details of a single command | None | `{"id": 1, "command": "ls -la", ...}` |
| **GET** | `/commands/category/{category}` | Retrieve commands filtered by category | None | `[{"id": 5, "command": "git pull...", ...}]` |
| **POST** | `/commands` | Create a custom command (stores in-memory) | `{"command": "...", "category": "...", "description": "...", "use_case": "...", "example_output": "...", "difficulty": "..."}` | `{"id": 20, "command": "...", ...}` |
| **DELETE** | `/commands/{id}` | Remove a command by ID | None | `{"message": "Command deleted successfully", "id": 1}` |
| **POST** | `/favorites/{id}` | Toggle the favorite bookmark status of a command | None | `{"id": 1, "is_favorite": true}` |
| **GET** | `/favorites` | Get all bookmarked commands | None | `[{"id": 1, "command": "ls -la", ...}]` |

---

## Production Process Control (Systemd)

When deployed on AWS EC2, the application runs under systemd supervision:

### Backend Control
```bash
sudo systemctl status backend
sudo systemctl restart backend
sudo systemctl start backend
sudo systemctl stop backend
```

### Frontend Control
```bash
sudo systemctl status frontend
sudo systemctl restart frontend
sudo systemctl start frontend
sudo systemctl stop frontend
```

---

## CI/CD and AWS Deployment Guide
For detailed instructions on OIDC setup, self-hosted runner configuration, and deploying this project on an AWS EC2 instance using native systemd service managers, refer to the [Deployment Guide](deployment-guide.md).
