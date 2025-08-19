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