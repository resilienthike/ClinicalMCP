import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { runMCPAgents } from './agent.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/api/analyze', async (req, res) => {
  const { report_text } = req.body;
  
  if (!report_text) {
    return res.status(400).json({ error: 'report_text required' });
  }

  try {
    const result = await runMCPAgents(report_text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'ClinicalMCP Agent Ready' });
});

app.get('/', (req, res) => {
  res.sendFile('/home/ec2-user/ClinicalMCP/index.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile('/home/ec2-user/ClinicalMCP/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🛡️ ClinicalMCP Server running on port ${PORT}`);
});
