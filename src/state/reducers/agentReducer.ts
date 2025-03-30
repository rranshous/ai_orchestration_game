import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AgentType } from '../../types/agents';

export interface AiAgent {
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

// Initial processing times for different agent types
export const PROCESSING_TIMES: Record<AgentType, number> = {
  [AgentType.PRODUCT_VISION]: 3000, // 3 seconds
  [AgentType.CODE_WRITER]: 5000,    // 5 seconds
  [AgentType.VERIFICATION_AI]: 4000, // 4 seconds
  [AgentType.BOSS]: 2000,            // 2 seconds
};

const initialState: AiAgent[] = [
  {
    id: 'product-vision',
    name: 'Product Vision AI',
    type: AgentType.PRODUCT_VISION,
    description: 'Converts project requirements into detailed specifications',
    icon: '/icons/product-vision.svg',
    currentInput: '',
    currentOutput: '',
    status: 'idle',
    processingTime: PROCESSING_TIMES[AgentType.PRODUCT_VISION],
  },
  {
    id: 'code-writer',
    name: 'Code Writer AI',
    type: AgentType.CODE_WRITER,
    description: 'Creates code based on specifications',
    icon: '/icons/code-writer.svg',
    currentInput: '',
    currentOutput: '',
    status: 'idle',
    processingTime: PROCESSING_TIMES[AgentType.CODE_WRITER],
  },
  {
    id: 'verification-ai',
    name: 'Verification AI',
    type: AgentType.VERIFICATION_AI,
    description: 'Analyzes code quality and verifies implementation against requirements',
    icon: '/icons/verification-ai.svg',
    currentInput: '',
    currentOutput: '',
    status: 'idle',
    processingTime: PROCESSING_TIMES[AgentType.VERIFICATION_AI],
  }
];

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setInput: (state, action: PayloadAction<{ agentId: string; input: string }>) => {
      const agent = state.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.currentInput = action.payload.input;
      }
    },
    
    startProcessing: (state, action: PayloadAction<{ agentId: string }>) => {
      const agent = state.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.status = "processing";
      }
    },
    
    completeProcessing: (state, action: PayloadAction<{ agentId: string; output: string }>) => {
      const agent = state.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.currentOutput = action.payload.output;
        agent.status = "complete";
      }
    },
    
    setError: (state, action: PayloadAction<{ agentId: string; errorMessage: string }>) => {
      const agent = state.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.status = "error";
        agent.errorMessage = action.payload.errorMessage;
      }
    },
    
    resetAgent: (state, action: PayloadAction<{ agentId: string }>) => {
      const agent = state.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.status = "idle";
        agent.errorMessage = undefined;
      }
    }
  }
});

export const { 
  setInput,
  startProcessing,
  completeProcessing,
  setError,
  resetAgent
} = agentSlice.actions;

export default agentSlice.reducer;
