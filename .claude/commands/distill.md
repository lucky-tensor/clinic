This command processes raw knowledge base materials into structured, AI-optimized formats for clinical decision support.

**Purpose:** Transform human-written clinical materials into actionable, searchable, and contextually rich data that AI agents can effectively use for treatment planning, assessment, and client support.

**Input Sources:**
- `knowledge_base/*.md` - Original clinical materials (textbooks, protocols, assessments)

**Output Destinations:**
- `distilled/essence.md`

## Processing Instructions

### 1. Knowledge Extraction and Structuring

### Phase 1: Content Analysis
1. **Scan knowledge_base/ directory** for all source materials
2. **Identify knowledge domains** (CBT, DBT, assessments, etc.)
3. **Categorize content types** (protocols, tools, research, examples)
4. **Map relationships** between different knowledge areas

### Phase 2: Extraction and Transformation
1. **Extract key concepts** using the structured format above
2. **Create decision trees** for complex processes
3. **Optimize assessment tools** for agent use
4. **Catalog interventions** with detailed metadata
5. **Build context packages** for common scenarios

### Phase 3: Integration and Cross-Referencing
1. **Link related knowledge** across different files
2. **Create agent-specific views** of the knowledge
3. **Build search indexes** for quick knowledge retrieval
4. **Validate completeness** and identify gaps

### Phase 4: Quality Assurance
1. **Review for clinical accuracy** and evidence-base
2. **Ensure agent usability** and clear instructions
3. **Test integration** with existing agent prompts
4. **Document knowledge provenance** and update dates
