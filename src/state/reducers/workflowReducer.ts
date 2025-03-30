import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workflow } from '../../types/workflow';

// Default workflow for the MVP
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
    {
      id: "step-certification",
      agentId: "code-writer", // We're using the same agent for certification
      name: "Code Certification",
      description: "Review and certify the generated code",
      isCompleted: false,
      isActive: false,
    }
  ],
};

export interface WorkflowState {
  current: Workflow;
  activeStepId: string | null;
}

const initialState: WorkflowState = {
  current: defaultWorkflow,
  activeStepId: defaultWorkflow.steps[0].id,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    completeStep: (state, action: PayloadAction<{ stepId: string }>) => {
      const currentIndex = state.current.steps.findIndex(step => step.id === action.payload.stepId);
      const nextStepId = currentIndex < state.current.steps.length - 1 
        ? state.current.steps[currentIndex + 1].id 
        : null;
      
      // Mark current step as completed and activate next step if available
      state.current.steps = state.current.steps.map((step) => ({
        ...step,
        isCompleted: step.isCompleted || step.id === action.payload.stepId,
        isActive: nextStepId ? step.id === nextStepId : false
      }));
      
      // Update the activeStepId to the next step
      state.activeStepId = nextStepId;
    },
    
    resetWorkflow: (state) => {
      // Reset to initial state
      state.current.steps = state.current.steps.map((step) => ({
        ...step,
        isCompleted: false,
        isActive: step.id === state.current.steps[0].id,
      }));
      
      state.activeStepId = state.current.steps[0].id;
    }
  }
});

export const { completeStep, resetWorkflow } = workflowSlice.actions;

export default workflowSlice.reducer;
