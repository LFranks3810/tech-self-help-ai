import os
import subprocess
import requests

# -----------------------------
# CONFIGURATION
# -----------------------------
GITHUB_USERNAME = "LFranks3810"
import os
token = os.getenv("GITHUB_TOKEN")
REPO_NAME = "tech-self-help-ai"
LOCAL_DIR = r"C:\Users\Luther\Desktop\tech-self-help-ai"

# -----------------------------
# HELPER FUNCTION
# -----------------------------
def run(cmd, cwd=None):
    print(f"Running: {cmd}")
    subprocess.run(cmd, shell=True, check=True, cwd=cwd)

# -----------------------------
# CREATE GITHUB REPO
# -----------------------------
def create_github_repo():
    url = "https://api.github.com/user/repos"
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
    }
    data = {
        "name": REPO_NAME,
        "private": False,
        "description": "Tech self-help AI app",
    }

    print("Creating GitHub repo...")
    r = requests.post(url, json=data, headers=headers)

    if r.status_code == 201:
        print("Repo created successfully.")
    elif r.status_code == 422:
        print("Repo already exists — continuing...")
    else:
        print("Failed to create repo:", r.status_code, r.text)
        raise SystemExit("Stopping due to GitHub error.")

# -----------------------------
# INITIALIZE + PUSH LOCAL FOLDER
# -----------------------------
def init_and_push_local_repo():
    if not os.path.isdir(LOCAL_DIR):
        raise SystemExit(f"Local directory not found: {LOCAL_DIR}")

    repo_url = f"https://github.com/{GITHUB_USERNAME}/{REPO_NAME}.git"

    run("git init", cwd=LOCAL_DIR)
    run("git add .", cwd=LOCAL_DIR)
    run('git commit -m "Initial commit"', cwd=LOCAL_DIR)

    run(f"git remote add origin {repo_url}", cwd=LOCAL_DIR)
    run("git branch -M main", cwd=LOCAL_DIR)
    run("git push -u origin main", cwd=LOCAL_DIR)

# -----------------------------
# MAIN
# -----------------------------
def main():
    create_github_repo()
    init_and_push_local_repo()
    print("All done. Repo is live on GitHub.")

if __name__ == "__main__":
    main()
