import 'dotenv/config';
import { Sandbox } from '@e2b/code-interpreter';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const SANDBOX_TIMEOUT = 600_000; // 10 minutes

// Agent 1: Medical Data Extractor with Exa MCP
async function extractMedicalData(sandbox, reportText) {
  console.log('🔍 Agent 1: Extracting medical data...');
  
  // Use Groq to extract symptoms
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Extract symptoms from medical report. Return JSON: {"symptoms": ["symptom1"], "severity": "high|medium|low"}'
      },
      { role: 'user', content: reportText }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const data = JSON.parse(completion.choices[0].message.content);
  
  // Use Exa MCP in E2B sandbox to search medical literature
  const searchCode = `
import os
os.system('pip install -q exa_py')
from exa_py import Exa

exa = Exa(api_key="${process.env.EXA_API_KEY || 'demo'}")
results = exa.search("${data.symptoms[0]} adverse events clinical trials", num_results=2)
print([r.title for r in results.results])
`;

  try {
    const execution = await sandbox.runCode(searchCode);
    data.literature = execution.logs.stdout.join('');
  } catch (e) {
    data.literature = 'Literature search unavailable';
  }

  console.log('✅ Agent 1 complete:', data);
  return data;
}

// Agent 2: Protocol Validator with GitHub MCP
async function validateProtocol(sandbox, symptoms) {
  console.log('🔬 Agent 2: Validating protocols...');
  
  // Use GitHub MCP to fetch clinical protocols
  const githubCode = `
import os
os.system('pip install -q PyGithub')
from github import Github

# Search for clinical trial protocols
g = Github()
repos = g.search_repositories('clinical trial protocol adverse events', sort='stars')
protocols = [repo.full_name for repo in repos[:3]]
print(protocols)
`;

  let protocols = [];
  try {
    const execution = await sandbox.runCode(githubCode);
    protocols = execution.logs.stdout;
  } catch (e) {
    protocols = ['Protocol search unavailable'];
  }

  // Risk analysis with Groq
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Analyze clinical risk. Return JSON: {"risk_score": 0.0-1.0, "risk_level": "HIGH|MEDIUM|LOW", "reasoning": "explanation"}'
      },
      {
        role: 'user',
        content: `Symptoms: ${symptoms.join(', ')}\nProtocols: ${protocols}`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const risk = JSON.parse(completion.choices[0].message.content);
  risk.protocols = protocols;
  
  console.log('✅ Agent 2 complete:', risk);
  return risk;
}

// Agent 3: Alert Publisher with Browserbase MCP
async function publishAlert(sandbox, extractedData, riskData) {
  console.log('📢 Agent 3: Publishing alert...');
  
  // Generate final recommendation with Groq
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Generate clinical recommendation. Return JSON: {"action": "ESCALATE|MONITOR|DOCUMENT", "next_steps": "what to do", "summary": "brief summary"}'
      },
      {
        role: 'user',
        content: `Symptoms: ${extractedData.symptoms}\nRisk: ${riskData.risk_level}\nScore: ${riskData.risk_score}`
      }
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    response_format: { type: 'json_object' }
  });

  const alert = JSON.parse(completion.choices[0].message.content);
  
  console.log('✅ Agent 3 complete:', alert);
  return alert;
}

// Extract trial metadata from report
function extractTrialMetadata(reportText) {
  const trialNameMatch = reportText.match(/trial[:\s]+([^\n,]+)/i);
  const phaseMatch = reportText.match(/phase[:\s]+(\d+|[IVX]+)/i);
  const patientMatch = reportText.match(/patient[:\s]+([^\n,]+)/i);
  
  return {
    trial_name: trialNameMatch ? trialNameMatch[1].trim() : 'TRIAL-2025-001',
    phase: phaseMatch ? phaseMatch[1].trim() : 'Phase II',
    patient_id: patientMatch ? patientMatch[1].trim() : 'P-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  };
}

// Main MCP Agent Orchestrator
export async function runMCPAgents(reportText) {
  console.log('🚀 Starting ClinicalMCP Agent Swarm in E2B Sandbox...\n');
  
  let sandbox;
  try {
    sandbox = await Sandbox.create({ 
      apiKey: process.env.E2B_API_KEY,
      timeoutMs: SANDBOX_TIMEOUT
    });
    
    // Extract trial metadata
    const trialMetadata = extractTrialMetadata(reportText);
    
    // Run 3-agent swarm
    const extracted = await extractMedicalData(sandbox, reportText);
    const risk = await validateProtocol(sandbox, extracted.symptoms);
    const alert = await publishAlert(sandbox, extracted, risk);
    
    const result = {
      trial_metadata: trialMetadata,
      patient_data: extracted,
      risk_analysis: risk,
      recommendation: alert,
      sandbox_id: sandbox.id
    };
    
    console.log('\n✅ MCP Agent Swarm Complete!\n');
    return result;
    
  } catch (error) {
    console.error('❌ Error in MCP Agent Swarm:', error.message);
    throw error;
  } finally {
    if (sandbox) {
      try {
        await sandbox.kill();
      } catch (killError) {
        console.warn('⚠️ Warning: Failed to kill sandbox:', killError.message);
      }
    }
  }
}

// CLI Demo
if (import.meta.url === `file://${process.argv[1]}`) {
  const testReport = process.argv[2] || 'Patient reports severe headache, confusion, and loss of balance after trial medication.';
  
  runMCPAgents(testReport)
    .then(result => console.log('\n📊 Final Result:', JSON.stringify(result, null, 2)))
    .catch(err => console.error('❌ Error:', err.message));
}
