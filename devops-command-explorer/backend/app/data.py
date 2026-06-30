from typing import List, Dict, Set
from .models import Command

INITIAL_COMMANDS = [
    # Linux
    {
        "id": 1,
        "command": "ls -la",
        "category": "Linux",
        "description": "Lists all directory contents, including hidden files, in long format with details like permissions, ownership, and size.",
        "use_case": "Used to inspect files in the current directory and verify file metadata or hidden config files.",
        "example_output": "total 16\ndrwxr-xr-x  3 admin admin 4096 Jun 30 12:00 .\ndrwxr-xr-x 20 admin admin 4096 Jun 30 11:00 ..\n-rw-r--r--  1 admin admin  220 Jun 30 12:00 .bash_logout\n-rw-r--r--  1 admin admin 3771 Jun 30 12:00 .bashrc",
        "difficulty": "Beginner"
    },
    {
        "id": 2,
        "command": "chmod +x script.sh",
        "category": "Linux",
        "description": "Adds execute permissions to the file, allowing it to be run as an executable script or program.",
        "use_case": "Developers use this to make newly created shell scripts executable before running them in a pipeline.",
        "example_output": "(No output on success)",
        "difficulty": "Beginner"
    },
    {
        "id": 3,
        "command": "systemctl status nginx",
        "category": "Linux",
        "description": "Displays detailed runtime status information about the nginx systemd service.",
        "use_case": "Checking if the web server is active and running during troubleshooting of website downtime.",
        "example_output": "● nginx.service - A high performance web server\n     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n     Active: active (running) since Tue 2026-06-30 10:00:00 UTC; 2h ago\n   Main PID: 1234 (nginx)",
        "difficulty": "Beginner"
    },
    {
        "id": 4,
        "command": "df -h",
        "category": "Linux",
        "description": "Shows disk space usage of all mounted filesystems in human-readable format (GB, MB).",
        "use_case": "Checking disk space to diagnose disk exhaustion on application or database servers.",
        "example_output": "Filesystem      Size  Used Avail Use% Mounted on\n/dev/xvda1       20G   14G  6.0G  70% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm",
        "difficulty": "Beginner"
    },
    
    # Git
    {
        "id": 5,
        "command": "git pull origin main",
        "category": "Git",
        "description": "Fetches and merges changes from the remote repository's main branch into your current branch.",
        "use_case": "Developers use this before starting daily work to stay synchronized with the latest remote code.",
        "example_output": "Updating 2f3d4ab..9c1f22e\nFast-forward\n src/main.js | 4 +++-\n 1 file changed, 3 insertions(+), 1 deletion(-)",
        "difficulty": "Beginner"
    },
    {
        "id": 6,
        "command": "git checkout -b feature/login",
        "category": "Git",
        "description": "Creates a new branch named feature/login and immediately switches your workspace to it.",
        "use_case": "Starting a new feature development isolate from the main branch.",
        "example_output": "Switched to a new branch 'feature/login'",
        "difficulty": "Beginner"
    },
    {
        "id": 7,
        "command": "git commit -m \"feat: add authentication login UI\"",
        "category": "Git",
        "description": "Records staged changes into the local git repository history with a descriptive commit message.",
        "use_case": "Saving a milestone of progress to the local git history.",
        "example_output": "[feature/login 3b4a2c1] feat: add authentication login UI\n 3 files changed, 45 insertions(+), 2 deletions(-)",
        "difficulty": "Beginner"
    },

    # Docker
    {
        "id": 8,
        "command": "docker ps -a",
        "category": "Docker",
        "description": "Lists all containers, including running, exited, and stopped ones, showing container IDs and status.",
        "use_case": "Locating a stopped container to inspect its logs or restart it.",
        "example_output": "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS                     PORTS                NAMES\na1b2c3d4e5f6   nginx:alpine   \"/docker-entrypoint.…\"   5 minutes ago   Exited (0) 2 minutes ago                        web-server\n7f8e9d0c1b2a   redis:latest   \"docker-entrypoint.s…\"   1 hour ago      Up 1 hour                  6379/tcp             cache-db",
        "difficulty": "Intermediate"
    },
    {
        "id": 9,
        "command": "docker run -d -p 80:80 --name web nginx:latest",
        "category": "Docker",
        "description": "Runs an Nginx container in detached (background) mode, mapping host port 80 to container port 80.",
        "use_case": "Quickly spinning up a local web server to verify web config or start a service.",
        "example_output": "d82084df9a4608c02a76f25be2f2b3e81119b45618cdb419f7e8a946b2b7194d",
        "difficulty": "Intermediate"
    },
    {
        "id": 10,
        "command": "docker build -t my-app:v1.0 .",
        "category": "Docker",
        "description": "Builds a Docker image using the Dockerfile in the current directory and tags it as my-app:v1.0.",
        "use_case": "Creating custom container images for deployments during local testing or CI/CD pipelines.",
        "example_output": "DEPRECATED: The legacy builder is deprecated...\nSending build context to Docker daemon  45.3MB\nStep 1/5 : FROM node:20-alpine\n ---> c7f09315579f\n...\nSuccessfully tagged my-app:v1.0",
        "difficulty": "Intermediate"
    },

    # Kubernetes
    {
        "id": 11,
        "command": "kubectl get pods -n kube-system",
        "category": "Kubernetes",
        "description": "Lists all active Kubernetes pods in the system namespace 'kube-system' with their running status.",
        "use_case": "Checking if cluster core components like CoreDNS or kube-proxy are running properly.",
        "example_output": "NAME                               READY   STATUS    RESTARTS   AGE\ncoredns-5d78c9869d-abcd1           1/1     Running   0          5d12h\nkube-proxy-x9y8z                   1/1     Running   1          5d12h",
        "difficulty": "Intermediate"
    },
    {
        "id": 12,
        "command": "kubectl logs -f deployment/api-server -n production",
        "category": "Kubernetes",
        "description": "Streams output logs of all pods associated with the deployment 'api-server' in real time.",
        "use_case": "Monitoring application output logs live while reproducing a bug in the production environment.",
        "example_output": "[INFO] 2026-06-30 10:15:00 - Request received /healthz\n[ERROR] 2026-06-30 10:15:02 - Database connection timed out.",
        "difficulty": "Intermediate"
    },
    {
        "id": 13,
        "command": "kubectl apply -f deployment.yaml",
        "category": "Kubernetes",
        "description": "Creates or updates cluster resources defined in the deployment.yaml configuration file.",
        "use_case": "Deploying a new application version or updating service settings in the Kubernetes cluster.",
        "example_output": "deployment.apps/frontend-app created\nservice/frontend-svc configured",
        "difficulty": "Intermediate"
    },

    # Terraform
    {
        "id": 14,
        "command": "terraform init",
        "category": "Terraform",
        "description": "Initializes the local Terraform working directory by downloading provider plugins and configuring modules.",
        "use_case": "Run this first when checking out infrastructure-as-code configuration or setting up pipelines.",
        "example_output": "Initializing the backend...\nInitializing provider plugins...\n- Finding hashicorp/aws versions matching \"~> 5.0\"...\nTerraform has been successfully initialized!",
        "difficulty": "Intermediate"
    },
    {
        "id": 15,
        "command": "terraform plan -out=tfplan",
        "category": "Terraform",
        "description": "Generates a speculative execution plan, outlining resources to create, modify, or destroy, and saves it to 'tfplan'.",
        "use_case": "Verifying infrastructure modifications before applying them to prevent accidental resources deletion.",
        "example_output": "Terraform will perform the following actions:\n  # aws_instance.web will be created\n  + resource \"aws_instance\" \"web\" {\n      + ami                          = \"ami-0c55b159cbfafe1f0\"\n      ...\nPlan: 1 to add, 0 to change, 0 to destroy.",
        "difficulty": "Advanced"
    },
    {
        "id": 16,
        "command": "terraform apply tfplan",
        "category": "Terraform",
        "description": "Executes the changes proposed in the saved execution plan ('tfplan') to provision infrastructure.",
        "use_case": "Applying approved infrastructure configuration changes directly into production or staging environments.",
        "example_output": "aws_instance.web: Creating...\naws_instance.web: Still creating... (10s elapsed)\naws_instance.web: Creation complete [id=i-0a1b2c3d4e5f6g7h8]\n\nApply complete! Resources: 1 added, 0 changed, 0 destroyed.",
        "difficulty": "Advanced"
    },

    # AWS CLI
    {
        "id": 17,
        "command": "aws s3 ls",
        "category": "AWS CLI",
        "description": "Lists all Amazon S3 buckets associated with the authenticated AWS account and credentials.",
        "use_case": "Checking bucket availability or listing objects inside buckets during cloud setups.",
        "example_output": "2026-06-01 12:00:00 devops-logs-bucket\n2026-06-15 15:30:00 static-assets-production",
        "difficulty": "Beginner"
    },
    {
        "id": 18,
        "command": "aws sts get-caller-identity",
        "category": "AWS CLI",
        "description": "Returns IAM details, account ID, and IAM role or user credentials currently being used.",
        "use_case": "Verifying which AWS credentials or environment variables are active on a terminal or local workstation.",
        "example_output": "{\n    \"UserId\": \"AROAABCDEFGHIJKLMNOP:session-name\",\n    \"Account\": \"123456789012\",\n    \"Arn\": \"arn:aws:sts::123456789012:assumed-role/DeveloperAccess/session-name\"\n}",
        "difficulty": "Intermediate"
    },

    # Jenkins
    {
        "id": 19,
        "command": "curl -X POST -u admin:token http://jenkins.local:8080/job/deploy-app/build",
        "category": "Jenkins",
        "description": "Sends an authenticated HTTP POST request to Jenkins API to trigger a build of the job 'deploy-app'.",
        "use_case": "Triggering Jenkins builds programmatically from external scripts, git hooks, or separate orchestration portals.",
        "example_output": "(HTTP/1.1 201 Created status header, building starts)",
        "difficulty": "Advanced"
    }
]

# Database lists
commands_db: List[Command] = [Command(**cmd) for cmd in INITIAL_COMMANDS]
favorites_db: Set[int] = set()
next_id: int = max([cmd["id"] for cmd in INITIAL_COMMANDS]) + 1
