# AI-Assisted Psychology Clinic

## Overview

This repository contains a complete AI-assisted psychology clinic system that can be deployed from a single Claude command. The system provides a comprehensive digital healthcare platform designed to support licensed mental health professionals in delivering evidence-based therapeutic interventions.

## 🎯 Goal

**From a single `claude` command, you can set up a fully functional AI-assisted psychotherapy clinic.**

The system includes:
- **Four specialized AI agents** (Oracle, Practitioner Supervisor, Treatment Plan, Nurse)
- **Role-based web interface** for clients, practitioners, and principals
- **Secure authentication and session management**
- **Clinical knowledge base with distillation capabilities**
- **Comprehensive testing framework with mock mode**
- **Real-time chat interfaces** for therapeutic support

## 🔧 Prerequisites

Before using this system, you need to install the following on your developer machine:

### 1. Claude Code CLI
```bash
# Install Claude Code CLI
curl -fsSL https://claude.ai/install.sh | sh
```

### 2. Claude Subscription
- You need an active Claude subscription
- Authenticate the CLI: `claude auth login`

### 3. Bun Runtime
```bash
# Install Bun (JavaScript runtime)
curl -fsSL https://bun.sh/install | bash
```

### 4. Verify Installation
```bash
# Check that all tools are installed
claude --version
bun --version
```

## 🚀 Quick Start

### 1. Deploy the Complete System
```bash
# Single command to build the entire clinic
claude /build-clinic
```

This command will:
- Create the complete directory structure
- Generate all AI agent configurations
- Set up the web application (frontend & backend)
- Initialize the database
- Install all dependencies
- Create the knowledge base
- Set up testing infrastructure

### 2. Start the Clinic
```bash
# Start in production mode (requires Claude CLI)
bun run serve

# Or start in mock mode for development/testing
bun run test:mock
```

### 3. Access the System
- **Web Interface**: http://localhost:3000
- **Demo Accounts**:
  - **Admin/Principal**: `admin` / `admin123`
  - **Therapist/Practitioner**: `therapist` / `therapist123` 
  - **Client**: `client` / `client123`

## 🏥 System Architecture

### AI Agents
- **Oracle Agent**: Clinical director ensuring ethical standards and quality control
- **Practitioner Supervisor Agent**: Provides supervision and guidance to therapists
- **Treatment Plan Agent**: Creates evidence-based treatment plans
- **Nurse Agent**: Supportive companion for clients between sessions

### User Roles
- **Client**: Access treatment plans, chat with nurse agent, view progress
- **Practitioner**: Create treatment plans, access supervision, manage client cases
- **Principal**: System oversight, reports, full administrative access

### Technical Stack
- **Backend**: Bun server with REST API
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Database**: Keyv with file storage
- **Authentication**: bcrypt with session management
- **AI Integration**: Claude CLI with mock mode for testing

## 📚 Knowledge Management & AI Enhancement

### Clinical Knowledge Base
- **Location**: `knowledge_base/` - Human-written clinical materials
- **Distilled Knowledge**: `distilled/essence.md` - AI-optimized clinical context
- **Processing**: Use `claude /distill` to process knowledge base materials

### The `/distill` Command - Lightweight RAG System

The `/distill` command creates a compact, local data structure that serves as a "poor man's RAG" - a lightweight knowledge retrieval system designed to minimize context usage:

```bash
# Process all knowledge base materials into compact format
claude /distill
```

**What it does:**
1. **Scans** all files in `knowledge_base/` directory
2. **Compresses** extensive clinical materials into essential knowledge
3. **Creates** `distilled/essence.md` - a small, dense knowledge file (minimal tokens)
4. **Structures** information for quick AI agent retrieval
5. **Eliminates** the need to load entire knowledge base into context

**Why This Approach:**
- **Token Efficiency**: Instead of loading hundreds of pages of clinical materials into every AI conversation, agents reference a single, condensed file
- **Cost Optimization**: Reduces API costs by keeping context windows small
- **Performance**: Fast retrieval without external vector databases or embeddings
- **Local Storage**: No external dependencies - everything runs locally
- **Consistency**: All agents reference the same compressed knowledge source

**The Distillation Process:**
1. **Compression**: Reduces extensive clinical literature to essential concepts
2. **Hierarchical Structure**: Organizes knowledge by priority and relevance  
3. **Cross-References**: Links related concepts without duplication
4. **Context Optimization**: Formats content for efficient AI consumption
5. **Version Control**: Maintains single source of truth for clinical knowledge

**Essence File Structure:**
The `distilled/essence.md` contains:
- **Core Principles** - Fundamental therapeutic concepts (high-priority)
- **Decision Trees** - When/how to apply interventions (structured logic)
- **Safety Protocols** - Critical risk factors and contraindications
- **Assessment Shortcuts** - Key diagnostic indicators
- **Intervention Map** - Treatment options with evidence levels
- **Ethical Guardrails** - Professional boundary reminders

**Token Budget Management:**
- **Target Size**: ~500-1000 tokens (fits easily in any context window)
- **Information Density**: Maximum clinical value per token
- **Layered Depth**: Essential info first, details as needed
- **Agent-Specific Views**: Tailored sections for different agent roles

### Knowledge Integration Architecture

**Lightweight RAG Implementation:**
Every AI agent automatically loads the compact `distilled/essence.md` (not the entire knowledge base), ensuring:
- **Minimal Context Usage** - Small token footprint per conversation
- **Fast Retrieval** - No database queries or embedding searches needed
- **Consistent Knowledge** - All agents reference identical compressed knowledge
- **Cost Efficiency** - Dramatically reduces API token consumption
- **Local Operation** - No external services or network dependencies

**Agent-Specific Integration:**
- **Oracle Agent**: Uses knowledge for clinical oversight and quality control
- **Practitioner Supervisor**: References evidence-based supervision practices
- **Treatment Plan Agent**: Applies structured treatment protocols
- **Nurse Agent**: Provides psychoeducation and supportive interventions

**Knowledge Maintenance:**
```bash
# Update knowledge when new materials are added
claude /distill

# The system automatically:
# - Preserves existing knowledge structure
# - Integrates new clinical information  
# - Updates cross-references and relationships
# - Maintains version control of changes
```

**Benefits of This Lightweight RAG Approach:**
- **Token Economy**: Massive reduction in context usage vs. loading full knowledge base
- **Cost Savings**: Lower API costs due to minimal context windows
- **Performance**: No latency from external vector DB queries or embeddings
- **Simplicity**: Single file system - no complex RAG infrastructure needed
- **Reliability**: Local storage eliminates external service dependencies
- **Consistency**: All agents reference identical compressed knowledge source

**Comparison to Traditional RAG:**
| Traditional RAG | Distilled Essence |
|-----------------|-------------------|
| Vector database required | Single local file |
| Embedding model needed | No embeddings |
| Query/retrieval latency | Instant access |
| Complex infrastructure | Simple file read |
| Variable context sizes | Fixed small footprint |
| External dependencies | Fully local |

This "poor man's RAG" approach provides the benefits of knowledge-augmented AI responses while keeping the system lightweight, fast, and cost-effective for clinical applications.

## 🧪 Testing & Development

### Run Tests
```bash
# Complete test suite (13 tests)
bun test

# Start server in mock mode
bun run test:mock
```

### Test Coverage
- ✅ Authentication for all user roles
- ✅ Chat API with all AI agents
- ✅ Role-based access control
- ✅ Static file serving
- ✅ Error handling
- ✅ Mock mode functionality

### Mock Mode
For development and testing without Claude API calls:
- Realistic mock responses for all agents
- 100ms delay simulation
- Automatic activation in test environment

## 📂 Project Structure

```
clinic/
├── .claude/
│   ├── agents/          # AI agent configurations
│   └── commands/        # Claude commands (build-clinic, distill)
├── knowledge_base/      # Clinical reference materials
├── distilled/          # AI-processed knowledge
├── client_files/       # Client case materials
├── data/              # Database files
├── public/            # Web interface files
├── test/              # Test suite
└── server.js          # Main server application
```

## 🔒 Security & Compliance

- **Password Security**: bcrypt hashing
- **Session Management**: UUID-based tokens
- **Role-Based Access**: Strict permission controls
- **HIPAA Considerations**: Designed with healthcare privacy in mind
- **Ethical Standards**: Oracle agent oversight for clinical decisions

## 🚀 Deployment Options

### Local Development
```bash
bun run dev          # Hot reload development
bun run test:mock    # Mock mode for testing
```

### Production
```bash
bun run serve        # Production with Claude CLI
```

### Environment Variables
- `NODE_ENV=test` - Activates mock mode
- `MOCK_CLAUDE=true` - Forces mock responses
- `PORT=3000` - Server port (default: 3000)

## 📈 Usage Scenarios

### For Therapists
- Create evidence-based treatment plans
- Get clinical supervision and guidance  
- Manage client cases and progress tracking
- Access professional development resources

### For Clients
- Receive supportive care between sessions
- Track therapy goals and homework
- Access psychoeducational materials
- Communicate with care team

### For Practice Administrators
- Monitor clinical quality and outcomes
- Generate practice reports
- Oversee practitioner performance
- Ensure ethical compliance

## 🛠️ Customization

### Adding Clinical Knowledge
The system is designed to grow with your practice's knowledge base:

#### 1. Add Source Materials
```bash
# Add any clinical content to knowledge_base/
knowledge_base/
├── cbt-protocols.md          # Cognitive behavioral therapy procedures
├── assessment-tools.md       # Clinical assessment instruments  
├── crisis-interventions.md   # Emergency response protocols
├── treatment-modalities.md   # Evidence-based interventions
└── ethical-guidelines.md     # Professional standards and ethics
```

#### 2. Process with AI Distillation
```bash
# Transform raw materials into AI-optimized knowledge
claude /distill
```
This command will:
- Analyze new clinical content
- Integrate with existing knowledge base
- Create structured decision trees
- Update agent-specific guidance
- Generate cross-references and relationships

#### 3. Deploy Updated Knowledge
```bash
# Restart server to load new distilled knowledge
bun run serve
```

#### 4. Verify Integration
```bash
# Test that agents are using updated knowledge
bun run test:mock
# Look for new concepts in agent responses
```

**Knowledge Types Supported:**
- **Treatment Protocols**: Step-by-step therapeutic procedures
- **Assessment Tools**: Structured clinical evaluations
- **Intervention Libraries**: Evidence-based treatment techniques
- **Crisis Protocols**: Safety and emergency procedures
- **Ethical Guidelines**: Professional boundary standards
- **Research Findings**: Latest clinical evidence and outcomes

### Modifying Agents
1. Edit agent files in `.claude/agents/`
2. Restart server to apply changes
3. Test with mock mode first

### Extending API
1. Add new endpoints to `server.js`
2. Update frontend in `public/app.js`
3. Add corresponding tests in `test/api.test.js`

## 🤝 Contributing

This is a complete, deployable system designed for immediate use. For customizations:
1. Fork the repository
2. Make your changes
3. Test thoroughly with `bun test`
4. Deploy with `bun run serve`

## ⚠️ Important Notes

- **Professional Use Only**: This system is designed for licensed mental health professionals
- **Not a Replacement**: AI agents supplement but do not replace human clinical judgment
- **Compliance**: Ensure local healthcare regulations and licensing requirements are met
- **Security**: Use secure hosting and follow healthcare data protection standards

## 📞 Support

For technical issues:
- Check the test suite: `bun test`
- Review server logs
- Verify Claude CLI authentication
- Test in mock mode first

---

**Ready to deploy your AI-assisted psychology clinic in minutes!** 🏥✨