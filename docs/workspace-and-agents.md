# AI Orchestrator - Workspace and Agents

## 1. Workspace Environment
The central gameplay area representing the player's virtual cubicle, simplified to fixed panels.

### Implementation Details:
- Create a fixed grid-based layout with non-movable panels
- Main zones: AI Agent panels (2), documentation panel, and notifications panel
- Use CSS Grid for layout with Flexbox for component arrangement

### UI Components:
```typescript
// Workspace Component
export const Workspace: React.FC = () => {
  // Component implementation
};

// Agent Panel Component
interface AgentPanelProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const AgentPanel: React.FC<AgentPanelProps> = (props) => {
  // Component implementation
};

// Documentation Panel Component
interface DocumentationPanelProps {
  activeWorkflow: Workflow;
  currentStep: WorkflowStep;
}

export const DocumentationPanel: React.FC<DocumentationPanelProps> = (props) => {
  // Component implementation
};

// Notifications Panel Component
interface NotificationsPanelProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = (props) => {
  // Component implementation
};
```

### State Structure:
```typescript
// Workspace-related Redux State
interface WorkspaceState {
  layout: {
    agentPanels: {
      id: string;
      agentId: string;
      title: string;
    }[];
    documentationPanel: {
      visible: boolean;
    };
    notificationsPanel: {
      visible: boolean;
    };
  };
  activeAgentId: string | null;
}
```

### Layout CSS (Tailwind Classes):
```typescript
// Example Tailwind classes for layout
const workspaceClasses = "grid grid-cols-12 grid-rows-6 gap-2 h-screen w-screen bg-gray-800 p-4";
const agentPanelClasses = "bg-gray-900 rounded-lg shadow-md overflow-hidden p-4";
const documentationPanelClasses = "bg-gray-700 rounded-lg shadow-md p-4 overflow-auto";
const notificationsPanelClasses = "bg-gray-700 rounded-lg shadow-md p-4 overflow-auto";
```

## 2. AI Agent Interfaces
Two specialized AI agent interfaces for the MVP.

### Implementation Details:
- Create base AI agent component with common functionality
- Develop specialized interfaces for two AI agents:
  - **ProductVision AI**: Form-like interface for specifications
  - **CodeWriter AI**: Code editor style interface with output window
- Each interface should include:
  - Input field/area
  - Output display
  - Status indicator
  - "Processing" animation

### Component Structure:
```typescript
// Base AI Agent Component
interface BaseAgentProps {
  agent: AiAgent;
  onInputChange: (id: string, input: string) => void;
  onProcess: (id: string) => void;
  onCopyOutput: (id: string) => void;
}

export const BaseAgentInterface: React.FC<BaseAgentProps> = (props) => {
  // Component implementation
};

// Product Vision AI Component
export const ProductVisionInterface: React.FC<BaseAgentProps> = (props) => {
  // Extends BaseAgentInterface with specific UI for product vision
  return (
    <BaseAgentInterface {...props}>
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea 
            className="w-full h-40 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            value={props.agent.currentInput}
            onChange={(e) => props.onInputChange(props.agent.id, e.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => props.onProcess(props.agent.id)}
          >
            Generate Specifications
          </button>
        </div>
      </div>
    </BaseAgentInterface>
  );
};

// Code Writer AI Component
export const CodeWriterInterface: React.FC<BaseAgentProps> = (props) => {
  // Code editor interface implementation
  return (
    <BaseAgentInterface {...props}>
      <div className="flex flex-col h-full">
        <div className="flex-grow grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Implementation Plan</label>
            <textarea 
              className="w-full h-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white font-mono"
              value={props.agent.currentInput}
              onChange={(e) => props.onInputChange(props.agent.id, e.target.value)}
              readOnly={props.agent.status === "processing"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Generated Code</label>
            <div className="w-full h-full bg-gray-700 border border-gray-600 rounded p-2 text-white font-mono overflow-auto">
              {props.agent.currentOutput ? (
                <pre className="whitespace-pre">{props.agent.currentOutput}</pre>
              ) : (
                <div className="text-gray-500 italic text-center mt-10">
                  Code will appear here after processing
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="text-sm text-gray-400">
            {props.agent.status === "processing" ? "Processing..." : "Ready"}
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => props.onProcess(props.agent.id)}
            disabled={props.agent.status === "processing" || !props.agent.currentInput}
          >
            Generate Code
          </button>
        </div>
      </div>
    </BaseAgentInterface>
  );
};
```

### Data Structures:
```typescript
interface AiAgent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  icon: string; // Path to icon image
  currentInput: string;
  currentOutput: string;
  status: "idle" | "processing" | "complete" | "error";
  processingTime: number; // in milliseconds
  errorMessage?: string;
}

enum AgentType {
  PRODUCT_VISION = "product_vision",
  CODE_WRITER = "code_writer",
}

// Agent processing configuration
const PROCESSING_TIMES = {
  [AgentType.PRODUCT_VISION]: 3000, // 3 seconds
  [AgentType.CODE_WRITER]: 5000,    // 5 seconds
};
```

### Redux Actions & Reducers:
```typescript
// Agent-related actions
const agentActions = {
  setInput: (agentId: string, input: string) => ({
    type: 'agent/setInput' as const,
    payload: { agentId, input }
  }),
  
  startProcessing: (agentId: string) => ({
    type: 'agent/startProcessing' as const,
    payload: { agentId }
  }),
  
  completeProcessing: (agentId: string, output: string) => ({
    type: 'agent/completeProcessing' as const,
    payload: { agentId, output }
  }),
  
  setError: (agentId: string, errorMessage: string) => ({
    type: 'agent/setError' as const,
    payload: { agentId, errorMessage }
  }),
};

// Agent reducer (simplified)
function agentReducer(state: AiAgent[] = [], action: any): AiAgent[] {
  switch (action.type) {
    case 'agent/setInput':
      return state.map(agent => 
        agent.id === action.payload.agentId
          ? { ...agent, currentInput: action.payload.input }
          : agent
      );
    
    case 'agent/startProcessing':
      return state.map(agent => 
        agent.id === action.payload.agentId
          ? { 
              ...agent, 
              status: "processing", 
              processingTime: PROCESSING_TIMES[agent.type] 
            }
          : agent
      );
    
    case 'agent/completeProcessing':
      return state.map(agent => 
        agent.id === action.payload.agentId
          ? { 
              ...agent, 
              currentOutput: action.payload.output,
              status: "complete" 
            }
          : agent
      );
      
    case 'agent/setError':
      return state.map(agent => 
        agent.id === action.payload.agentId
          ? { 
              ...agent, 
              status: "error",
              errorMessage: action.payload.errorMessage 
            }
          : agent
      );
    
    default:
      return state;
  }
}
```