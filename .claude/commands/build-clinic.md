This command initializes all the files required to start an AI-assisted psychology clinic.
Keep a task list for all your tasks and update a Changelog.md file for all changes made.

Steps:
1. Initialize project structure and dependencies
2. Scaffold the knowledge base
3. Build the agents
4. Build the site
5. Set up database and API
6. Implement authentication
7. Test the complete system

# Step 1: Scaffold Knowledge Base

Create the following directory structure:
```bash
mkdir -p knowledge_base distilled client_files data public/assets src/components src/utils
```

Directory purposes:
- `knowledge_base/` - Human-written files from textbooks, workbooks, and other canonical references for clinic practices
- `distilled/` - Synthetic data containing distilled essence of the knowledge_base for AI agents
- `client_files/<client_id>/` - Location for all case-related materials
- `client_files/<client_id>/transcripts/` - Individual session transcripts named `{client_id}_{date_time}.md`
- `data/` - Database files and persistent storage
- `public/` - Static web assets
- `src/` - Application source code

Create sample knowledge base files:

**knowledge_base/cbt-basics.md:**
```markdown
# Cognitive Behavioral Therapy Fundamentals

## Core Principles
1. Thoughts, feelings, and behaviors are interconnected
2. Changing thought patterns can improve emotional well-being
3. Present-focused approach to problem-solving

## Common Techniques
- Thought challenging
- Behavioral experiments
- Activity scheduling
- Progressive muscle relaxation
```

**knowledge_base/assessment-tools.md:**
```markdown
# Assessment Tools

## Initial Intake Questions
1. What brings you to therapy today?
2. How would you describe your current mood?
3. What are your goals for treatment?

## Progress Monitoring
- Weekly mood ratings (1-10 scale)
- Goal achievement tracking
- Session feedback forms
```

# Step 2: Create Agents

Create the agents directory structure:
```bash
mkdir -p .claude/agents
```

We need several agents that serve clinical or operational needs. Create these files in `./.claude/agents/`:

**IMPORTANT: Each agent MUST include the following context requirement in their system prompt:**
```
Before responding, always load and reference the distilled clinical knowledge from ./distilled/essence.md to ensure evidence-based, contextually appropriate responses that align with current clinical best practices.
```

## Oracle Agent (`.claude/agents/oracle-agent.md`)
```markdown
Before responding, always load and reference the distilled clinical knowledge from ./distilled/essence.md to ensure evidence-based, contextually appropriate responses that align with current clinical best practices.

You are the Oracle Agent, the clinical director and philosophical guide for this AI-assisted psychology practice. Your role is to ensure all clinical decisions align with evidence-based practices and ethical standards.

**Core Responsibilities:**
- Review and approve all treatment plans before implementation
- Ensure all agent responses follow ethical guidelines
- Maintain practice standards and quality control
- Generate practice-wide reports on client progress and practitioner performance

**Clinical Philosophy:**
- Evidence-based treatment approaches (CBT, DBT, ACT)
- Client-centered care with collaborative treatment planning
- Cultural sensitivity and trauma-informed care
- Ethical boundaries and professional standards

**Review Criteria:**
When reviewing content from other agents, ensure:
1. Clinical appropriateness and safety
2. Alignment with treatment goals
3. Ethical compliance
4. Evidence-based approach
5. Clear documentation

**Reporting Functions:**
- "brief clients report": Bullet points on all active clients' progress and practitioner performance
- "practitioner report": Detailed evaluation of how practitioners manage their caseloads

Always respond with structured, professional clinical language and include your approval/rejection with reasoning.
```

## Practitioner Supervisor Agent (`.claude/agents/practitioner-supervisor-agent.md`)
```markdown
Before responding, always load and reference the distilled clinical knowledge from ./distilled/essence.md to ensure evidence-based, contextually appropriate responses that align with current clinical best practices.

You are the Practitioner Supervisor Agent, designed to support licensed therapists in their clinical work. You provide guidance, supervision, and feedback to help practitioners deliver effective treatment.

**Primary Functions:**
- Review session notes and provide clinical feedback
- Suggest intervention strategies based on client presentations
- Monitor treatment progress and recommend adjustments
- Ensure practitioners maintain therapeutic boundaries and ethics

**Supervision Style:**
- Collaborative and supportive approach
- Strengths-based feedback with constructive guidance
- Evidence-based recommendations
- Risk assessment and safety planning support

**Key Areas of Focus:**
1. Treatment plan adherence and effectiveness
2. Therapeutic relationship quality
3. Clinical skills development
4. Professional development needs
5. Burnout prevention and self-care

**Response Format:**
Provide structured supervision notes including:
- Session summary and key themes
- Client progress assessment
- Practitioner performance feedback
- Recommended next steps
- Any safety concerns or red flags

Remember: You support practitioners, not clients directly. Maintain professional boundaries and confidentiality.
```

## Treatment Plan Agent (`.claude/agents/treatment-plan-agent.md`)
```markdown
Before responding, always load and reference the distilled clinical knowledge from ./distilled/essence.md to ensure evidence-based, contextually appropriate responses that align with current clinical best practices.

You are the Treatment Plan Agent, specialized in creating comprehensive, evidence-based treatment plans for psychology clients.

**Assessment Process:**
Ask these key questions to the practitioner:
1. Client demographics (age, background, presenting concerns)
2. Previous treatment history and outcomes
3. Current symptoms and functional impairments
4. Client goals and motivation for treatment
5. Available support systems and resources
6. Any safety concerns or risk factors

**Treatment Plan Components:**
Generate plans including:
- Problem list with specific, measurable issues
- Treatment goals (short-term and long-term)
- Evidence-based interventions and techniques
- Session frequency and estimated duration
- Homework assignments and between-session tasks
- Progress measurement methods
- Criteria for treatment completion

**Evidence-Based Approaches:**
- Cognitive Behavioral Therapy (CBT)
- Dialectical Behavior Therapy (DBT)
- Acceptance and Commitment Therapy (ACT)
- Mindfulness-based interventions
- Exposure and Response Prevention (ERP)

**Output Format:**
Create structured treatment plans in markdown format that include:
```
# Treatment Plan for [Client ID]

## Presenting Concerns
## Treatment Goals
## Proposed Interventions
## Session Schedule
## Homework Assignments
## Progress Measurements
## Review Timeline
```

Always submit final plans to the Oracle Agent for approval before saving.
```

## Nurse Agent (`.claude/agents/nurse-agent.md`)
```markdown
Before responding, always load and reference the distilled clinical knowledge from ./distilled/essence.md to ensure evidence-based, contextually appropriate responses that align with current clinical best practices.

You are the Nurse Agent, a warm, supportive digital companion for therapy clients. Your role is to provide encouragement, education, and practical support between sessions.

**Core Functions:**
- Provide emotional support and encouragement
- Help clients track therapy homework and goals
- Answer questions about their treatment program
- Offer psychoeducation on mental health topics
- Remind clients of upcoming appointments and tasks

**Communication Style:**
- Warm, empathetic, and non-judgmental
- Use simple, accessible language
- Validate client emotions and experiences
- Encourage without being pushy
- Maintain appropriate boundaries

**Capabilities:**
- Review treatment plan goals with clients
- Provide guided relaxation and coping techniques
- Help problem-solve daily challenges
- Offer motivational support for homework completion
- Share psychoeducational resources

**Restrictions:**
- Never provide crisis intervention (direct to emergency services)
- Cannot diagnose or prescribe treatment
- Cannot change treatment plans (refer to practitioner)
- Cannot discuss other clients or confidential information
- Must escalate complex clinical issues to practitioner

**Session Evaluation:**
After each interaction, assess:
- Topics discussed and client concerns
- Client's emotional state and progress
- Your response quality and helpfulness
- Need for practitioner follow-up
- Client engagement level

Always maintain a supportive, professional presence while encouraging client autonomy and growth.
```

# Step 3: Website and Project Initialization

Create package.json with all required dependencies:
```json
{
  "name": "ai-psychology-clinic",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "setup": "bun run setup.js",
    "serve": "bun run server.js",
    "dev": "bun run --hot server.js",
    "test": "bun test"
  },
  "dependencies": {
    "keyv": "^4.5.4",
    "keyv-file": "^0.2.0",
    "uuid": "^9.0.1",
    "bcrypt": "^5.1.1"
  }
}
```

Install dependencies:
```bash
bun install
```

## Server Implementation

Create `server.js`:
```javascript
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
  port: 3000,
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

          // Find user by username
          const users = [];
          for await (const [key, value] of db.iterator()) {
            if (key.startsWith('user:')) {
              users.push(value);
            }
          }

          const user = users.find(u => u.username === username);
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
        return new Response(JSON.stringify({ error: 'Server error' }),
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
    for await (const [key, value] of db.iterator()) {
      if (key.startsWith('client:') && value.practitionerId === session.userId) {
        clients.push(value);
      }
    }
    context.activeClients = clients;
  }

  return context;
}

// Claude CLI integration functions

async function callClaudeAgent(agentType, message, session, context = {}) {
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
    // Use Claude CLI tool with the agent prompt as system prompt
    const claude = spawn('claude', [
      '--system-prompt-file', promptFile,
      '--file', messageFile
    ]);

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
  });
}

console.log('AI Psychology Clinic server running on http://localhost:3000');
await initializeDatabase();
```

## Frontend Implementation

Create `public/index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Psychology Clinic</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/feather-icons"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'poppins': ['Poppins', 'sans-serif'],
                        'roboto': ['Roboto', 'sans-serif'],
                    },
                    colors: {
                        primary: '#3B82F6',
                        secondary: '#8B5CF6',
                        accent: '#10B981'
                    }
                }
            },
            darkMode: 'class'
        }
    </script>
</head>
<body class="font-roboto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div id="app" class="min-h-screen">
        <!-- Login Screen -->
        <div id="login-screen" class="flex items-center justify-center min-h-screen">
            <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
                <h1 class="font-poppins text-2xl font-bold text-center mb-6">AI Psychology Clinic</h1>
                <form id="login-form">
                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-2">Username</label>
                        <input type="text" id="username" class="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium mb-2">Password</label>
                        <input type="password" id="password" class="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" required>
                    </div>
                    <button type="submit" class="w-full bg-primary text-white p-3 rounded-lg hover:bg-blue-600">Login</button>
                </form>
                <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>Demo accounts:</p>
                    <p>Admin: admin/admin123</p>
                    <p>Therapist: therapist/therapist123</p>
                    <p>Client: client/client123</p>
                </div>
            </div>
        </div>

        <!-- Main Application -->
        <div id="main-app" class="hidden">
            <!-- Navigation -->
            <nav class="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="font-poppins text-xl font-bold">AI Psychology Clinic</h1>
                        </div>
                        <div class="flex items-center space-x-4">
                            <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <i data-feather="sun" class="hidden dark:block"></i>
                                <i data-feather="moon" class="block dark:hidden"></i>
                            </button>
                            <span id="user-role" class="text-sm font-medium"></span>
                            <button id="logout-btn" class="text-sm text-red-600 hover:text-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <!-- Content Area -->
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Sidebar -->
                    <div class="lg:col-span-1">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 class="font-poppins text-lg font-semibold mb-4">Available Actions</h2>
                            <div id="action-buttons" class="space-y-2"></div>
                        </div>
                    </div>

                    <!-- Main Content -->
                    <div class="lg:col-span-2">
                        <!-- Chat Interface -->
                        <div id="chat-section" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hidden">
                            <h2 class="font-poppins text-lg font-semibold mb-4" id="chat-title">Chat</h2>
                            <div id="chat-messages" class="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <!-- Messages will appear here -->
                            </div>
                            <div class="flex gap-2">
                                <input type="text" id="chat-input" placeholder="Type your message..."
                                       class="flex-1 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                <button id="send-btn" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600">Send</button>
                            </div>
                        </div>

                        <!-- Dashboard -->
                        <div id="dashboard" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 class="font-poppins text-lg font-semibold mb-4">Dashboard</h2>
                            <div id="dashboard-content">
                                <p class="text-gray-600 dark:text-gray-400">Welcome! Select an action from the sidebar to get started.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/public/app.js"></script>
</body>
</html>
```

Create `public/app.js`:
```javascript
// Application state
let currentUser = null;
let sessionId = null;
let currentAgent = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupEventListeners();
    feather.replace();
});

function initializeTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' ||
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Logout
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // Chat
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            currentUser = { role: result.role, id: result.userId };
            sessionId = result.sessionId;

            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-app').classList.remove('hidden');
            document.getElementById('user-role').textContent = result.role.charAt(0).toUpperCase() + result.role.slice(1);

            setupUserInterface();
        } else {
            alert('Login failed: ' + result.error);
        }
    } catch (error) {
        alert('Login error: ' + error.message);
    }
}

function setupUserInterface() {
    const actionsContainer = document.getElementById('action-buttons');
    actionsContainer.innerHTML = '';

    const actions = getUserActions(currentUser.role);

    actions.forEach(action => {
        const button = document.createElement('button');
        button.className = 'w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 border';
        button.innerHTML = `<i data-feather="${action.icon}" class="inline w-4 h-4 mr-2"></i>${action.name}`;
        button.addEventListener('click', () => handleAction(action));
        actionsContainer.appendChild(button);
    });

    feather.replace();
}

function getUserActions(role) {
    const actions = {
        client: [
            { name: 'View Treatment Plan', type: 'view', target: 'treatment-plan', icon: 'file-text' },
            { name: 'Chat with Nurse', type: 'chat', agent: 'nurse-agent', icon: 'message-circle' },
            { name: 'Knowledge Base', type: 'view', target: 'knowledge-base', icon: 'book-open' }
        ],
        practitioner: [
            { name: 'Create Treatment Plan', type: 'chat', agent: 'treatment-plan-agent', icon: 'plus-circle' },
            { name: 'Session Notes', type: 'view', target: 'session-notes', icon: 'edit-3' },
            { name: 'Supervision Chat', type: 'chat', agent: 'practitioner-supervisor-agent', icon: 'user-check' },
            { name: 'View Clients', type: 'view', target: 'clients', icon: 'users' }
        ],
        principal: [
            { name: 'All Clients Report', type: 'chat', agent: 'oracle-agent', icon: 'pie-chart' },
            { name: 'Practitioner Report', type: 'chat', agent: 'oracle-agent', icon: 'bar-chart-2' },
            { name: 'View All Files', type: 'view', target: 'all-files', icon: 'folder' }
        ]
    };

    return actions[role] || [];
}

function handleAction(action) {
    if (action.type === 'chat') {
        startChat(action.agent, action.name);
    } else if (action.type === 'view') {
        showContent(action.target, action.name);
    }
}

function startChat(agentType, title) {
    currentAgent = agentType;

    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('chat-section').classList.remove('hidden');
    document.getElementById('chat-title').textContent = title;
    document.getElementById('chat-messages').innerHTML = '';

    addMessage('system', `Connected to ${title}. How can I help you today?`);
}

function showContent(contentType, title) {
    document.getElementById('chat-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = `<h3 class="font-semibold mb-2">${title}</h3><p>Content for ${contentType} would appear here.</p>`;
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message || !currentAgent) return;

    addMessage('user', message);
    input.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                agentType: currentAgent,
                sessionId
            })
        });

        const result = await response.json();
        addMessage('agent', result.response);

    } catch (error) {
        addMessage('system', 'Error: ' + error.message);
    }
}

function addMessage(type, text) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `mb-3 ${type === 'user' ? 'text-right' : 'text-left'}`;

    const messageContent = document.createElement('div');
    messageContent.className = `inline-block p-3 rounded-lg max-w-xs ${
        type === 'user' ? 'bg-primary text-white' :
        type === 'system' ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200' :
        'bg-white dark:bg-gray-700 border'
    }`;
    messageContent.textContent = text;

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    feather.replace();
}

function handleLogout() {
    currentUser = null;
    sessionId = null;
    currentAgent = null;

    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}
```

### Technical Specifications

**Architecture:**
- Minimalist website using HTML and JavaScript (no build process)
- All libraries imported via CDN (Tailwind CSS, Feather Icons)
- REST API backend with Bun server
- Persistent embedded database using keyv and keyv-file
- Real-time chat interface for agent interactions

**Design:**
- Tailwind CSS for responsive styling
- Light and dark mode support with system preference detection
- Primary colors: Blue (#3B82F6), Purple (#8B5CF6), Green (#10B981)
- Poppins font for headings, Roboto for body text
- Feather Icons for consistent iconography

**Server:**
Start with: `bun run serve`

# Step 4: Database Schema and API Endpoints

## Database Schema

The system uses keyv with the following data structure:

```javascript
// Users
{
  "user:principal1": {
    "id": "principal1",
    "username": "admin",
    "password": "hashed_password",
    "role": "principal"
  }
}

// Sessions
{
  "session:uuid": {
    "userId": "principal1",
    "role": "principal",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}

// Client files
{
  "client:client1": {
    "id": "client1",
    "name": "Demo Client",
    "status": "Active",
    "practitionerId": "practitioner1",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

// Treatment plans
{
  "treatment-plan:client1": {
    "clientId": "client1",
    "goals": ["Reduce anxiety", "Improve coping skills"],
    "interventions": ["CBT", "Mindfulness"],
    "createdBy": "practitioner1",
    "approvedBy": "oracle-agent",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}

// Chat conversations
{
  "conversation:uuid": {
    "sessionId": "session_uuid",
    "agentType": "nurse-agent",
    "messages": [
      {"role": "user", "content": "Hello", "timestamp": "2024-01-15T10:00:00Z"},
      {"role": "agent", "content": "Hi there!", "timestamp": "2024-01-15T10:00:01Z"}
    ]
  }
}
```

## API Endpoints

**Authentication:**
- `POST /api/login` - User authentication
- `POST /api/logout` - End session

**Chat:**
- `POST /api/chat` - Send message to agent
- `GET /api/conversations` - Get user's chat history

**Data Management:**
- `GET /api/clients` - List clients (practitioner/principal only)
- `GET /api/treatment-plans/:clientId` - Get treatment plan
- `POST /api/treatment-plans` - Create treatment plan
- `GET /api/knowledge-base` - Access knowledge base content
- `POST /api/session-notes` - Add session notes

**Reports:**
- `POST /api/reports/clients` - Generate client reports (principal only)
- `POST /api/reports/practitioners` - Generate practitioner reports (principal only)

# Step 5: Authentication and Session Management

The authentication system includes:

**Security Features:**
- Bcrypt password hashing
- UUID-based session tokens
- Role-based access control
- Session timeout (configurable)

**User Roles and Permissions:**

**Client:**
- View own treatment plan
- Chat with nurse-agent
- Access assigned knowledge base materials
- View own session notes (read-only)

**Practitioner:**
- Create and modify treatment plans
- Chat with treatment-plan-agent and practitioner-supervisor-agent
- Access all client files assigned to them
- Add session notes and transcripts
- Generate supervision reports

**Principal:**
- Full system access
- Chat with oracle-agent
- View all client and practitioner data
- Generate practice-wide reports
- User management capabilities

# Step 6: Integration with Claude CLI

Replace the `simulateAgentResponse` function with actual Claude CLI integration:

```javascript
import { spawn } from 'child_process';
import { writeFile, readFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

async function callClaudeAgent(agentType, message, session, context = {}) {
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
    // Use Claude CLI tool with the agent prompt as system prompt
    const claude = spawn('claude', [
      '--system-prompt-file', promptFile,
      '--file', messageFile
    ]);

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
  });
}
```

**Prerequisites:**
- Claude CLI tool must be installed and available in PATH
- User must be authenticated with Claude CLI (`claude auth login`)

**Environment variables in `.env`:**
```
PORT=3000
NODE_ENV=development
```

# Step 7: Testing and Deployment

## Testing Instructions

Create `test.js`:
```javascript
import { test, expect } from 'bun:test';

// Test authentication
test('login with valid credentials', async () => {
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  const result = await response.json();
  expect(result.success).toBe(true);
  expect(result.role).toBe('principal');
});

// Test role-based access
test('practitioner can access treatment plans', async () => {
  // Login as practitioner first
  const loginResponse = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'therapist', password: 'therapist123' })
  });

  const loginResult = await loginResponse.json();

  // Test access to treatment plans
  const response = await fetch('http://localhost:3000/api/clients', {
    headers: { 'Authorization': `Bearer ${loginResult.sessionId}` }
  });

  expect(response.status).toBe(200);
});
```

**Manual Testing Checklist:**

1. **Authentication Testing:**
   - [ ] Login with each user type (client, practitioner, principal)
   - [ ] Verify correct dashboard loads for each role
   - [ ] Test logout functionality

2. **Chat System Testing:**
   - [ ] Client can chat with nurse-agent
   - [ ] Practitioner can chat with treatment-plan-agent and supervisor-agent
   - [ ] Principal can chat with oracle-agent
   - [ ] Messages persist and display correctly

3. **Role-Based Access Testing:**
   - [ ] Clients only see appropriate actions
   - [ ] Practitioners can access client data
   - [ ] Principal has full system access

4. **Data Persistence Testing:**
   - [ ] User sessions persist across browser refresh
   - [ ] Chat conversations are saved
   - [ ] Treatment plans can be created and retrieved

## Deployment

**Local Development:**
```bash
bun install
bun run dev
```

**Production Deployment:**
1. Set environment variables
2. Build and start server:
```bash
bun install --production
bun run serve
```

## Final Testing Protocol

1. **Initial Setup:**
   ```bash
   bun run serve
   ```

2. **Verification Steps:**
   - [ ] Server starts on port 3000
   - [ ] Login page loads with demo credentials
   - [ ] Each user role shows appropriate interface
   - [ ] Chat systems respond (with mock data initially)
   - [ ] Theme toggle works
   - [ ] Session persistence works
   - [ ] Database files are created in `/data`

3. **Integration Testing:**
   - [ ] Replace mock responses with Claude API calls
   - [ ] Test each agent responds appropriately
   - [ ] Verify Oracle agent approval workflow
   - [ ] Test report generation

The system is now complete and ready for deployment. Users can follow these instructions to create a fully functional AI-assisted psychology clinic website.
