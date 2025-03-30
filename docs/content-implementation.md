# AI Orchestrator - Content and Implementation

## 7. Content Generation
Simplified content generation system for the MVP.

### Implementation Details:
- Create basic templates for AI agent responses
- Implement simple response generation logic

### Response Templates:
```typescript
// Response template system
interface ResponseTemplate {
  id: string;
  agentType: AgentType;
  templates: string[]; // Possible response templates
}

// Function to generate agent responses
function generateAgentResponse(agent: AiAgent): string {
  // Find matching templates for this agent type
  const matchingTemplates = responseTemplates.filter(template => {
    return template.agentType === agent.type;
  });
  
  if (matchingTemplates.length === 0) {
    return "Processing complete.";
  }
  
  // Randomly select one of the matching templates
  const template = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
  
  // Randomly select one of the response templates
  const responseTemplate = template.templates[Math.floor(Math.random() * template.templates.length)];
  
  return responseTemplate;
}

// Sample response templates
const responseTemplates: ResponseTemplate[] = [
  // Product Vision AI templates
  {
    id: "product-vision-responses",
    agentType: AgentType.PRODUCT_VISION,
    templates: [
      "REQUIREMENTS:\n- User authentication functionality\n- Dashboard for data visualization\n- Export capabilities for reports\n\nFEATURES:\n- Login/logout system\n- Interactive charts\n- PDF and CSV export options\n\nNON-FUNCTIONAL REQUIREMENTS:\n- Response time under 2 seconds\n- Mobile-friendly interface\n- GDPR compliance",
      
      "REQUIREMENTS:\n- Bug fix for login system\n- Performance optimization for database queries\n- UI improvements for mobile view\n\nFEATURES:\n- Corrected authentication flow\n- Faster data retrieval\n- Responsive design elements\n\nNON-FUNCTIONAL REQUIREMENTS:\n- Maintain existing security protocols\n- Backward compatibility\n- No downtime during deployment",
      
      "REQUIREMENTS:\n- Integration with third-party payment processor\n- User notification system\n- Administrative control panel\n\nFEATURES:\n- Credit card and PayPal processing\n- Email and in-app notifications\n- User management dashboard\n\nNON-FUNCTIONAL REQUIREMENTS:\n- PCI compliance\n- 99.9% uptime\n- End-to-end encryption"
    ]
  },
  
  // Code Writer AI templates
  {
    id: "code-writer-responses",
    agentType: AgentType.CODE_WRITER,
    templates: [
      "```javascript\n// Authentication Module Implementation\nclass AuthService {\n  constructor(config) {\n    this.apiUrl = config.apiUrl || '/api/auth';\n    this.tokenKey = config.tokenKey || 'auth_token';\n    this.user = null;\n  }\n\n  async login(credentials) {\n    try {\n      const response = await fetch(`${this.apiUrl}/login`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(credentials)\n      });\n      \n      if (!response.ok) {\n        throw new Error('Login failed');\n      }\n      \n      const data = await response.json();\n      localStorage.setItem(this.tokenKey, data.token);\n      this.user = data.user;\n      return data.user;\n    } catch (error) {\n      console.error('Login error:', error);\n      throw error;\n    }\n  }\n\n  logout() {\n    localStorage.removeItem(this.tokenKey);\n    this.user = null;\n  }\n\n  getToken() {\n    return localStorage.getItem(this.tokenKey);\n  }\n\n  isAuthenticated() {\n    return !!this.getToken();\n  }\n\n  async getCurrentUser() {\n    if (this.user) return this.user;\n    \n    const token = this.getToken();\n    if (!token) return null;\n    \n    try {\n      const response = await fetch(`${this.apiUrl}/me`, {\n        headers: {\n          'Authorization': `Bearer ${token}`\n        }\n      });\n      \n      if (!response.ok) {\n        this.logout();\n        return null;\n      }\n      \n      const data = await response.json();\n      this.user = data.user;\n      return this.user;\n    } catch (error) {\n      console.error('Get user error:', error);\n      return null;\n    }\n  }\n}\n\nexport default AuthService;\n```",
      
      "```javascript\n// Data Visualization Component\nimport React, { useState, useEffect } from 'react';\n\nconst DataDashboard = ({ dataSource }) => {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n  \n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        setLoading(true);\n        const response = await fetch(dataSource);\n        \n        if (!response.ok) {\n          throw new Error(`HTTP error! status: ${response.status}`);\n        }\n        \n        const result = await response.json();\n        setData(result);\n        setLoading(false);\n      } catch (e) {\n        console.error('Error fetching data:', e);\n        setError(e.message);\n        setLoading(false);\n      }\n    };\n    \n    fetchData();\n  }, [dataSource]);\n  \n  const renderChart = () => {\n    if (data.length === 0) return <div>No data available</div>;\n    \n    return (\n      <div className=\"chart-container\">\n        <h3>Data Visualization</h3>\n        <div className=\"chart\">\n          {/* Chart implementation would go here */}\n          {data.map((item, index) => (\n            <div key={index} className=\"chart-bar\" style={{ height: `${item.value}%` }}>\n              <span className=\"tooltip\">{item.label}: {item.value}</span>\n            </div>\n          ))}\n        </div>\n      </div>\n    );\n  };\n  \n  if (loading) return <div>Loading data...</div>;\n  if (error) return <div>Error loading data: {error}</div>;\n  \n  return (\n    <div className=\"dashboard\">\n      <h2>Dashboard</h2>\n      {renderChart()}\n      <div className=\"controls\">\n        <button onClick={() => console.log('Export data')}>Export as CSV</button>\n        <button onClick={() => console.log('Print view')}>Print View</button>\n      </div>\n    </div>\n  );\n};\n\nexport default DataDashboard;\n```",
      
      "```javascript\n// Payment Processing Integration\nclass PaymentProcessor {\n  constructor(options = {}) {\n    this.apiKey = options.apiKey || '';\n    this.endpoint = options.endpoint || 'https://api.payment-processor.com/v1';\n    this.currency = options.currency || 'USD';\n  }\n  \n  async processPayment(paymentDetails) {\n    if (!this.apiKey) {\n      throw new Error('API key is required');\n    }\n    \n    try {\n      const response = await fetch(`${this.endpoint}/payments`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n          'Authorization': `Bearer ${this.apiKey}`\n        },\n        body: JSON.stringify({\n          amount: paymentDetails.amount,\n          currency: this.currency,\n          source: paymentDetails.cardToken,\n          description: paymentDetails.description || 'Payment',\n          metadata: paymentDetails.metadata || {}\n        })\n      });\n      \n      if (!response.ok) {\n        const errorData = await response.json();\n        throw new Error(errorData.message || 'Payment processing failed');\n      }\n      \n      return await response.json();\n    } catch (error) {\n      console.error('Payment error:', error);\n      throw error;\n    }\n  }\n  \n  async createCustomer(customerData) {\n    try {\n      const response = await fetch(`${this.endpoint}/customers`, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json',\n          'Authorization': `Bearer ${this.apiKey}`\n        },\n        body: JSON.stringify(customerData)\n      });\n      \n      if (!response.ok) {\n        const errorData = await response.json();\n        throw new Error(errorData.message || 'Customer creation failed');\n      }\n      \n      return await response.json();\n    } catch (error) {\n      console.error('Customer creation error:', error);\n      throw error;\n    }\n  }\n}\n\nexport default PaymentProcessor;\n```"
    ]
  }
];
```

## Implementation Plan

### Phase 1: Core UI and Environment (2 weeks)
- Set up project with TypeScript, React, and build system
- Implement basic workspace layout with fixed panels
- Set up Redux store structure
- Create the two AI agent interfaces

#### Specific Tasks:
1. Initialize project with Vite, React, and TypeScript
2. Set up Tailwind CSS configuration
3. Implement Redux store with basic reducers
4. Create layout grid system for workspace
5. Implement fixed panels for AI agents
6. Create documentation and notification panels
7. Implement the ProductVision AI interface
8. Implement the CodeWriter AI interface
9. Set up basic routing (if needed for different screens)

#### Deliverables:
- Functioning workspace UI with fixed panels
- Basic AI agent interfaces

### Phase 2: Copy-Paste and Project Mechanics (2 weeks)
- Develop clipboard system
- Implement simple project management
- Create basic workflow visualization
- Build validation for transfers

#### Specific Tasks:
1. Create clipboard context provider
2. Implement copy button components
3. Implement paste button components
4. Create simple validation for transfers
5. Implement workflow visualization component
6. Create project card components
7. Implement project generation
8. Build project success/failure evaluation
9. Create simple feedback system with toasts

#### Deliverables:
- Functioning copy-paste system
- Basic project system
- Simple workflow visualization

### Phase 3: Content and Polish (1 week)
- Implement content generation for AI responses
- Add basic help system
- Create necessary UI components
- Perform testing and bug fixes

#### Specific Tasks:
1. Implement response template system
2. Create help dialog component
3. Implement tooltips for UI elements
4. Add project completion dialog
5. Create notification toasts
6. Perform basic testing
7. Fix identified bugs
8. Polish UI elements

#### Deliverables:
- Content generation system
- Help and feedback systems
- Polished, functional MVP

## State Management

```typescript
// Root state structure
interface RootState {
  workspace: WorkspaceState;
  agents: AiAgent[];
  projects: ProjectState;
  workflow: WorkflowState;
  notifications: NotificationState;
  help: HelpState;
  clipboard: string; // For simplicity we'll just track the current clipboard content
}

// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import workspaceReducer from './state/reducers/workspaceReducer';
import agentReducer from './state/reducers/agentReducer';
import projectReducer from './state/reducers/projectReducer';
import workflowReducer from './state/reducers/workflowReducer';
import notificationReducer from './state/reducers/notificationReducer';
import helpReducer from './state/reducers/helpReducer';

const store = configureStore({
  reducer: {
    workspace: workspaceReducer,
    agents: agentReducer,
    projects: projectReducer,
    workflow: workflowReducer,
    notifications: notificationReducer,
    help: helpReducer,
  },
});

export default store;
```

## Auto-Save System

```typescript
// Simple auto-save function
function saveGameState(state: RootState): void {
  try {
    localStorage.setItem('aiOrchestrator_saveGame', JSON.stringify({
      projects: state.projects,
      activeProjectId: state.projects.activeProjectId,
    }));
  } catch (error) {
    console.error('Error saving game:', error);
  }
}

// Load game function
function loadGameState(): Partial<RootState> | null {
  try {
    const savedData = localStorage.getItem('aiOrchestrator_saveGame');
    if (!savedData) return null;
    
    return JSON.parse(savedData);
  } catch (error) {
    console.error('Error loading game:', error);
    return null;
  }
}
```

## Testing Strategy

For this simplified MVP, focus on manual testing:

1. Test the copy-paste flow between agents
2. Verify project success/failure evaluation
3. Test UI responsiveness
4. Validate auto-save functionality
5. Ensure help system works properly

## Visual Asset Requirements

### Minimal Assets for MVP
- Basic workspace background (cubicle-like environment)
- Icons for AI agents (2 icons)
- Simple icon set (copy, paste, help icons)
- Status indicators (success, error, processing icons)
- Button and UI element styles (using Tailwind)

## Conclusion

This simplified implementation plan focuses on delivering the core satirical experience of being a human middleware in an AI-driven development process, while minimizing development complexity. By reducing the number of AI agents, simplifying the window management system, removing customization features, and streamlining other aspects of the game, this MVP will be more achievable while still capturing the essence of the concept.

The implementation focuses on:
1. Two AI agent interfaces (instead of three)
2. Fixed panels (instead of draggable windows)
3. Simple linear workflow
4. Basic project success/failure system
5. Core copy-paste mechanics
6. Minimal feedback system
7. Static help instead of interactive tutorial

This approach dramatically increases the likelihood of successful implementation while preserving the core humor and gameplay of the original concept.