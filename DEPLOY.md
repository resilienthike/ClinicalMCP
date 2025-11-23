# Deployment & Submission Guide

## Push to GitHub

```bash
cd /home/ec2-user/ClinicalMCP

# Configure git
git config --global user.name "resilienthike"
git config --global user.email "hek2128@columbia.edu"

# Create GitHub Personal Access Token at: https://github.com/settings/tokens
# Then use it for authentication:
git push -u origin main
# When prompted for password, paste your GitHub token

# Or use SSH:
git remote set-url origin git@github.com:resilienthike/ClinicalMCP.git
git push -u origin main
```

## Project Structure

```
ClinicalMCP/
├── agent.js              # 3-agent swarm orchestration
├── server.js             # Express backend
├── index.html            # Professional clinical UI
├── package.json          # Dependencies
├── .env.example          # Environment template
├── README.md             # Full documentation
└── setup.sh              # Quick setup script
```

## Quick Start

```bash
npm install
cp .env.example .env
# Add your API keys to .env
PORT=3001 node server.js
# Open http://localhost:3001
```

## Hackathon Submission Checklist

- [x] E2B Sandbox integration with 10-minute timeout
- [x] MCP tools (Exa + GitHub) from Docker Hub
- [x] Groq LLM for all agent reasoning
- [x] 3-agent swarm architecture
- [x] Professional clinical UI
- [x] FHIR JSON interoperability
- [x] eCRF compliance table
- [x] Trial metadata extraction
- [x] Error handling and logging
- [x] Production-ready code

## Demo Script (2 minutes)

1. Click "Severe Cardiac" scenario (15s)
2. Watch agents analyze in E2B sandbox (30s)
3. Show FHIR JSON toggle and protocol reasoning (30s)
4. Click "Sign and Submit to EDC" (30s)
5. Highlight regulatory impact (15s)
