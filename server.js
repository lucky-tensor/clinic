import Keyv from 'keyv';
import KeyvFile from 'keyv-file';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { readFile, writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

// Database setup
const db = new Keyv({
  store: new KeyvFile({ filename: './data/clinic.json' })
});

// Mock responses for testing/demo
const mockResponses = {
  'oracle-agent': 'As the Oracle Agent, I have reviewed your request. This response is clinically appropriate and follows evidence-based practices.',
  'practitioner-supervisor-agent': 'As your clinical supervisor, I recommend focusing on building therapeutic rapport and using cognitive-behavioral interventions.',
  'treatment-plan-agent': 'I will help you create a comprehensive treatment plan. Please provide the client demographics and presenting concerns.',
  'nurse-agent': 'Hello! I understand you are feeling anxious today. That is completely valid and I am here to support you.'
};

// Initialize with default users if database is empty
async function initializeDatabase() {
  const userCount = await db.get('userCount') || 0;
  if (userCount === 0) {
    const defaultUsers = [
      { id: 'principal1', username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'principal' },
      { id: 'practitioner1', username: 'therapist', password: await bcrypt.hash('therapist123', 10), role: 'practitioner' },
      { id: 'client1', username: 'client', password: await bcrypt.hash('client123', 10), role: 'client' }
    ];

    for (const user of defaultUsers) {
      await db.set(`user:${user.id}`, user);
    }
    await db.set('userCount', defaultUsers.length);
  }
}

const server = Bun.serve({
  port: process.env.PORT || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    // Serve static files
    if (path === '/' || path === '/index.html') {
      const html = await readFile('./public/index.html', 'utf-8');
      return new Response(html, { headers: { ...headers, 'Content-Type': 'text/html' } });
    }

    if (path.startsWith('/public/')) {
      try {
        const filePath = '.' + path;
        const file = await readFile(filePath);
        const contentType = path.endsWith('.css') ? 'text/css' :
                           path.endsWith('.js') ? 'application/javascript' : 'text/plain';
        return new Response(file, { headers: { ...headers, 'Content-Type': contentType } });
      } catch {
        return new Response('File not found', { status: 404, headers });
      }
    }

    // API Routes
    if (path.startsWith('/api/')) {
      try {
        if (path === '/api/login' && req.method === 'POST') {
          const { username, password } = await req.json();

          // Find user by username - try all user IDs
          const userIds = ['principal1', 'practitioner1', 'client1'];
          let user = null;
          
          for (const userId of userIds) {
            const userData = await db.get(`user:${userId}`);
            if (userData && userData.username === username) {
              user = userData;
              break;
            }
          }

          if (user && await bcrypt.compare(password, user.password)) {
            const sessionId = randomUUID();
            await db.set(`session:${sessionId}`, { userId: user.id, role: user.role });
            return new Response(JSON.stringify({
              success: true,
              sessionId,
              role: user.role,
              userId: user.id
            }), { headers: { ...headers, 'Content-Type': 'application/json' } });
          }
          return new Response(JSON.stringify({ success: false, error: 'Invalid credentials' }),
            { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } });
        }

        if (path === '/api/chat' && req.method === 'POST') {
          const { message, agentType, sessionId } = await req.json();
          const session = await db.get(`session:${sessionId}`);

          if (!session) {
            return new Response(JSON.stringify({ error: 'Invalid session' }),
              { status: 401, headers: { ...headers, 'Content-Type': 'application/json' } });
          }

          // Get additional context for the agent
          const context = await getAgentContext(session, agentType);
          const response = await callClaudeAgent(agentType, message, session, context);

          // Save conversation to database
          const conversationId = randomUUID();
          await db.set(`conversation:${conversationId}`, {
            sessionId,
            agentType,
            messages: [
              { role: 'user', content: message, timestamp: new Date().toISOString() },
              { role: 'agent', content: response, timestamp: new Date().toISOString() }
            ]
          });

          return new Response(JSON.stringify({ response }),
            { headers: { ...headers, 'Content-Type': 'application/json' } });
        }

        if (path === '/api/clients' && req.method === 'GET') {
          const sessionId = req.headers.get('Authorization')?.replace('Bearer ', '');
          const session = await db.get(`session:${sessionId}`);

          if (!session || (session.role !== 'principal' && session.role !== 'practitioner')) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }),
              { status: 403, headers: { ...headers, 'Content-Type': 'application/json' } });
          }

          // Return mock client data
          const clients = [
            { id: 'client1', name: 'Demo Client', status: 'Active', lastSession: '2024-01-15' }
          ];

          return new Response(JSON.stringify(clients),
            { headers: { ...headers, 'Content-Type': 'application/json' } });
        }

      } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Server error', details: error.message }),
          { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
      }
    }

    return new Response('Not found', { status: 404, headers });
  },
});

async function getAgentContext(session, agentType) {
  const context = { userRole: session.role };

  // Add role-specific context
  if (session.role === 'client') {
    // Get client's treatment plan and recent session notes
    const treatmentPlan = await db.get(`treatment-plan:${session.userId}`);
    if (treatmentPlan) {
      context.treatmentPlan = treatmentPlan;
    }
  } else if (session.role === 'practitioner') {
    // Get practitioner's active clients
    const clients = [];
    // For now, just return empty array - in production this would query the database properly
    context.activeClients = clients;
  }

  return context;
}

// Claude CLI integration functions
async function callClaudeAgent(agentType, message, session, context = {}) {
  // Check if we should use mock mode (for testing/demo)
  const useMockMode = process.env.NODE_ENV === 'test' || process.env.MOCK_CLAUDE === 'true';
  
  if (useMockMode) {
    // Return mock response with slight delay to simulate real API
    await new Promise(resolve => setTimeout(resolve, 100));
    const mockResponse = mockResponses[agentType] || 'This is a mock response from the AI agent.';
    return `${mockResponse} (Mock Mode - User: ${message})`;
  }

  try {
    // Load agent prompt from file
    const agentPrompt = await readFile(`./.claude/agents/${agentType}.md`, 'utf-8');

    // Build context-aware system prompt
    const systemPrompt = `${agentPrompt}\n\nContext: User role is ${session.role}. Additional context: ${JSON.stringify(context)}`;

    // Create temporary files for the conversation
    const tempId = randomUUID().substring(0, 8);
    const promptFile = `temp_prompt_${tempId}.md`;
    const messageFile = `temp_message_${tempId}.txt`;

    await writeFile(promptFile, systemPrompt);
    await writeFile(messageFile, message);

    // Call Claude CLI with the agent prompt and user message
    const claudeResponse = await runClaudeCLI(promptFile, messageFile);

    // Clean up temporary files
    await unlink(promptFile).catch(() => {});
    await unlink(messageFile).catch(() => {});

    return claudeResponse;

  } catch (error) {
    console.error('Claude CLI error:', error);
    return 'I apologize, but I encountered an error. Please try again.';
  }
}

function runClaudeCLI(promptFile, messageFile) {
  return new Promise((resolve, reject) => {
    // Read the files and pass content directly to Claude CLI
    Promise.all([
      readFile(promptFile, 'utf-8'),
      readFile(messageFile, 'utf-8')
    ]).then(([systemPrompt, userMessage]) => {
      // Use Claude CLI with stdin input
      const claude = spawn('claude', [], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Send the combined prompt to stdin
      const combinedPrompt = `System: ${systemPrompt}\n\nHuman: ${userMessage}\n\nAssistant:`;
      claude.stdin.write(combinedPrompt);
      claude.stdin.end();

      let output = '';
      let errorOutput = '';

      claude.stdout.on('data', (data) => {
        output += data.toString();
      });

      claude.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      claude.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          console.error('Claude CLI error:', errorOutput);
          reject(new Error(`Claude CLI exited with code ${code}: ${errorOutput}`));
        }
      });

      claude.on('error', (error) => {
        console.error('Failed to start Claude CLI:', error);
        reject(error);
      });
    }).catch(reject);
  });
}

const port = process.env.PORT || 3000;
console.log(`AI Psychology Clinic server running on http://localhost:${port}`);

// Initialize database
try {
  await initializeDatabase();
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Database initialization error:', error);
}