import { test, expect, beforeAll, afterAll } from 'bun:test';
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

let serverProcess;
const BASE_URL = 'http://localhost:3001'; // Use different port for testing

beforeAll(async () => {
  // Start server in test mode on port 3001
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3001';
  
  serverProcess = spawn('bun', ['run', 'server.js'], {
    env: { ...process.env, NODE_ENV: 'test', PORT: '3001' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Wait for server to start
  await setTimeout(2000);
});

afterAll(async () => {
  if (serverProcess) {
    serverProcess.kill();
    await setTimeout(1000);
  }
});

// Authentication Tests
test('Authentication - Login with valid credentials', async () => {
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });

  const result = await response.json();
  expect(response.status).toBe(200);
  expect(result.success).toBe(true);
  expect(result.role).toBe('principal');
  expect(result.sessionId).toBeDefined();
});

test('Authentication - All user roles can login', async () => {
  const users = [
    { username: 'admin', password: 'admin123', expectedRole: 'principal' },
    { username: 'therapist', password: 'therapist123', expectedRole: 'practitioner' },
    { username: 'client', password: 'client123', expectedRole: 'client' }
  ];

  for (const user of users) {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, password: user.password })
    });

    const result = await response.json();
    expect(result.role).toBe(user.expectedRole);
  }
});

// Chat API Tests
test('Chat API - Client can chat with nurse agent', async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'client', password: 'client123' })
  });
  
  const { sessionId } = await loginResponse.json();

  const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'I am feeling anxious today',
      agentType: 'nurse-agent',
      sessionId
    })
  });

  const chatResult = await chatResponse.json();
  expect(chatResponse.status).toBe(200);
  expect(chatResult.response).toContain('Mock Mode');
});

// Role-Based Access Tests
test('Role-Based Access - Practitioner can access clients', async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'therapist', password: 'therapist123' })
  });
  
  const { sessionId } = await loginResponse.json();

  const clientResponse = await fetch(`${BASE_URL}/api/clients`, {
    headers: { 'Authorization': `Bearer ${sessionId}` }
  });

  expect(clientResponse.status).toBe(200);
});

test('Role-Based Access - Client cannot access clients endpoint', async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'client', password: 'client123' })
  });
  
  const { sessionId } = await loginResponse.json();

  const clientResponse = await fetch(`${BASE_URL}/api/clients`, {
    headers: { 'Authorization': `Bearer ${sessionId}` }
  });

  expect(clientResponse.status).toBe(403);
});

// Mock Mode Tests
test('Mock Mode - All agents return mock responses', async () => {
  const loginResponse = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  });
  
  const { sessionId } = await loginResponse.json();

  const agents = ['oracle-agent', 'practitioner-supervisor-agent', 'treatment-plan-agent', 'nurse-agent'];
  
  for (const agentType of agents) {
    const chatResponse = await fetch(`${BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test message',
        agentType,
        sessionId
      })
    });

    const chatResult = await chatResponse.json();
    expect(chatResponse.status).toBe(200);
    expect(chatResult.response).toContain('Mock Mode');
  }
});

// Static File Tests
test('Static Files - Homepage loads correctly', async () => {
  const response = await fetch(`${BASE_URL}/`);
  expect(response.status).toBe(200);
  
  const html = await response.text();
  expect(html).toContain('AI Psychology Clinic');
});