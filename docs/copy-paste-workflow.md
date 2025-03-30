# AI Orchestrator - Copy-Paste and Workflow

## 3. Copy-Paste Mechanics
The core gameplay interaction of transferring information between AI agents.

### Implementation Details:
- Implement clipboard system with visual feedback
- Create simple validation for transfers
- Include visual cues for valid/invalid transfers

### Component Structure:
```typescript
// Clipboard Context
interface ClipboardContextValue {
  content: string;
  sourceId: string | null;
  setCopyContent: (content: string, sourceId: string) => void;
  clearClipboard: () => void;
}

export const ClipboardContext = React.createContext<ClipboardContextValue>(null!);

export const ClipboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState("");
  const [sourceId, setSourceId] = useState<string | null>(null);
  
  const setCopyContent = useCallback((content: string, sourceId: string) => {
    setContent(content);
    setSourceId(sourceId);
  }, []);
  
  const clearClipboard = useCallback(() => {
    setContent("");
    setSourceId(null);
  }, []);
  
  return (
    <ClipboardContext.Provider value={{ content, sourceId, setCopyContent, clearClipboard }}>
      {children}
    </ClipboardContext.Provider>
  );
};

// Custom hook to use clipboard
export function useClipboard() {
  return useContext(ClipboardContext);
}

// Copy Button Component
interface CopyButtonProps {
  content: string;
  sourceId: string;
  label?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ content, sourceId, label = "Copy" }) => {
  const { setCopyContent } = useClipboard();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopyContent(content, sourceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button
      className={`px-3 py-1 rounded text-sm ${copied ? 'bg-green-600' : 'bg-gray-600 hover:bg-gray-500'}`}
      onClick={handleCopy}
    >
      {copied ? "Copied!" : label}
    </button>
  );
};

// Paste Button Component
interface PasteButtonProps {
  targetId: string;
  onPaste: (content: string) => void;
  disabled?: boolean;
}

export const PasteButton: React.FC<PasteButtonProps> = ({ 
  targetId, 
  onPaste, 
  disabled = false 
}) => {
  const { content, sourceId, clearClipboard } = useClipboard();
  
  const handlePaste = () => {
    if (content && !disabled) {
      onPaste(content);
      clearClipboard();
    }
  };
  
  // Simple validation - only enable if there's content and it's not pasting to the source
  const isValid = !!content && sourceId !== targetId;
  
  return (
    <button
      className={`px-3 py-1 rounded text-sm ${
        !isValid || disabled 
        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
      onClick={handlePaste}
      disabled={!isValid || disabled}
    >
      Paste
    </button>
  );
};
```

### Validation System:
```typescript
// Simple validation for transfers - for MVP, only check basic rules
function validateTransfer(sourceAgentId: string, targetAgentId: string, content: string): boolean {
  // Cannot transfer to the same agent
  if (sourceAgentId === targetAgentId) {
    return false;
  }
  
  // Content cannot be empty
  if (!content.trim()) {
    return false;
  }
  
  // For the simplified MVP workflow:
  // - Only allow transfer from Product Vision to Code Writer
  if (sourceAgentId === 'product-vision' && targetAgentId === 'code-writer') {
    return true;
  }
  
  return false;
}
```

### Redux Actions:
```typescript
// Transfer-related actions
const transferActions = {
  attemptTransfer: (sourceAgentId: string, targetAgentId: string, content: string) => ({
    type: 'transfer/attempt' as const,
    payload: { sourceAgentId, targetAgentId, content }
  }),
  
  transferSuccess: (sourceAgentId: string, targetAgentId: string, content: string) => ({
    type: 'transfer/success' as const,
    payload: { sourceAgentId, targetAgentId, content }
  }),
  
  transferFailure: (sourceAgentId: string, targetAgentId: string) => ({
    type: 'transfer/failure' as const,
    payload: { sourceAgentId, targetAgentId }
  }),
};
```

## 4. Simple Workflow System
A basic linear workflow for the MVP.

### Implementation Details:
- Implement a very simple linear workflow (Product Vision → Code Writer)
- Create basic workflow visualization
- Show current workflow step

### Component Structure:
```typescript
// Workflow types
interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  agentId: string;
  name: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Workflow display component
interface WorkflowDisplayProps {
  workflow: Workflow;
  currentStepId: string | null;
}

export const WorkflowDisplay: React.FC<WorkflowDisplayProps> = ({ 
  workflow, 
  currentStepId 
}) => {
  return (
    <div className="workflow-display p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{workflow.name}</h3>
      <div className="workflow-steps space-y-2">
        {workflow.steps.map((step, index) => (
          <div key={step.id}>
            <div 
              className={`
                p-3 rounded border
                ${step.isCompleted ? 'bg-green-900 border-green-700' : 
                  step.isActive ? 'bg-blue-900 border-blue-700' : 
                  'bg-gray-700 border-gray-600'}
                ${currentStepId === step.id ? 'ring-2 ring-white' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <span>{step.name}</span>
                {step.isCompleted && <span className="text-green-400">✓</span>}
              </div>
              <div className="text-sm text-gray-400">{step.description}</div>
            </div>
            
            {/* Arrow to next step */}
            {index < workflow.steps.length - 1 && (
              <div className="flex justify-center my-2">
                <div className="w-0.5 h-6 bg-gray-600"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Default Workflow for MVP:
```typescript
// Simple fixed workflow for MVP
const defaultWorkflow: Workflow = {
  id: "workflow-default",
  name: "Software Development Workflow",
  steps: [
    {
      id: "step-product-vision",
      agentId: "product-vision",
      name: "Requirements Specification",
      description: "Define project requirements and specifications",
      isCompleted: false,
      isActive: true,
    },
    {
      id: "step-code-writer",
      agentId: "code-writer",
      name: "Code Implementation",
      description: "Write code based on specifications",
      isCompleted: false,
      isActive: false,
    },
  ],
};

// Redux reducer for workflow state
interface WorkflowState {
  current: Workflow;
  activeStepId: string | null;
}

const initialWorkflowState: WorkflowState = {
  current: defaultWorkflow,
  activeStepId: defaultWorkflow.steps[0].id,
};

function workflowReducer(state: WorkflowState = initialWorkflowState, action: any): WorkflowState {
  switch (action.type) {
    case 'workflow/completeStep':
      const currentIndex = state.current.steps.findIndex(step => step.id === action.payload.stepId);
      const nextStepId = currentIndex < state.current.steps.length - 1 
        ? state.current.steps[currentIndex + 1].id 
        : null;
      
      return {
        ...state,
        activeStepId: nextStepId,
        current: {
          ...state.current,
          steps: state.current.steps.map((step, index) => ({
            ...step,
            isCompleted: step.isCompleted || step.id === action.payload.stepId,
            isActive: index === currentIndex + 1, // Activate next step
          })),
        },
      };
    
    case 'workflow/reset':
      return {
        ...initialWorkflowState,
      };
    
    default:
      return state;
  }
}
```