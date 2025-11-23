# ClinicalMCP - Automated Adverse Event Analysis & eCRF Filing

**Production-grade AI system for clinical trial safety that automates adverse event extraction, risk assessment, and regulatory compliance filing.**

## What It Does

ClinicalMCP transforms unstructured clinical notes into structured, compliant adverse event reports. Using a 3-agent swarm running in E2B sandboxes with MCP tools, it:

1. **Extracts clinical data** from narrative reports using Groq LLM + Exa MCP
2. **Validates against protocols** using GitHub MCP to cross-reference trial specifications
3. **Generates eCRF-ready output** with CTCAE grading and auto-populated compliance fields

The system eliminates manual data entry, reduces regulatory risk, and accelerates trial timelines.

## Why It Wins

- **Real Clinical Impact**: Solves the $2B+ annual cost of adverse event processing in pharma
- **Production Architecture**: 3-agent swarm with proper error handling, timeouts, and resource cleanup
- **Full MCP Integration**: Demonstrates E2B + Docker MCP Hub + Groq working together seamlessly
- **Compliance-First Design**: Auto-generates CTCAE-graded eCRF entries ready for submission

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Add your API keys:
# - E2B_API_KEY (get at e2b.dev)
# - GROQ_API_KEY (use promo: MCP_AGENTS_2025)
# - GITHUB_TOKEN (optional, for protocol validation)
```

### 3. Run the System
```bash
# CLI Demo
node agent.js "Patient reports severe headache and confusion"

# Web Server
node server.js
# Then open http://localhost:3001 in browser
```

## Architecture

### 3-Agent Swarm

**Agent 1: Medical Data Extractor**
- Parses clinical narratives with Groq LLM
- Searches medical literature via Exa MCP
- Extracts symptoms, severity, and context

**Agent 2: Protocol Validator**
- Fetches trial protocols via GitHub MCP
- Cross-references FDA guidelines
- Calculates risk scores

**Agent 3: Compliance Generator**
- Maps findings to CTCAE grades
- Generates eCRF-ready output
- Produces actionable recommendations

## Tech Stack

- **E2B Sandbox**: Secure, isolated code execution
- **Docker MCP Hub**: Exa + GitHub MCPs for external data
- **Groq**: llama-3.3-70b-versatile for fast LLM inference
- **Node.js + Express**: Backend orchestration
- **React-inspired UI**: Clean, clinical SaaS design

## Demo Flow

```
Input: "Patient reports severe chest pain, shortness of breath, dizziness"

→ Agent 1: Extracts [chest pain, dyspnea, dizziness] | Severity: HIGH
→ Agent 2: Risk Score 85% | Matches cardiac protocol
→ Agent 3: ESCALATE | Grade 3 (Severe) | Auto-fill eCRF

Output: Compliance table ready for regulatory submission
```

## Hackathon Requirements

✅ **E2B Sandbox**: All agents run in isolated E2B sandboxes with 10-minute timeout  
✅ **MCP Tools**: Uses Exa MCP + GitHub MCP from Docker Hub  
✅ **Groq**: Fast LLM inference for all reasoning  
✅ **Innovation**: First MCP-based clinical compliance system  

## 2-Minute Demo Script

1. **Input** (15s): Click "Severe Cardiac" scenario
2. **Execution** (30s): Watch agents analyze in E2B sandbox
3. **MCP Tools** (30s): Explain Exa literature search + GitHub protocol validation
4. **Output** (30s): Show auto-populated eCRF compliance table
5. **Impact** (15s): Highlight regulatory time savings

---

Built with E2B, Docker MCP Hub, and Groq for the E2B Hackathon 2025.
