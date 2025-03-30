import React, { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { AiAgent, setInput, startProcessing, completeProcessing, setError } from '../../state/reducers/agentReducer';
import { useClipboard } from '../../context/ClipboardContext';
import { delay } from '../../utils/helpers';
import { completeStep } from '../../state/reducers/workflowReducer';
import { showToast, showCompletionDialog } from '../../state/reducers/notificationReducer';
import { completeProject } from '../../state/reducers/projectReducer';

interface BaseAgentProps {
  agent: AiAgent;
  children?: ReactNode;
}

const BaseAgentInterface: React.FC<BaseAgentProps> = ({ agent, children }) => {
  const dispatch = useAppDispatch();
  const { content, sourceId, setCopyContent } = useClipboard();
  
  // Get workflow and project information
  const workflow = useAppSelector(state => state.workflow.current);
  const activeStep = useAppSelector(state => workflow.steps.find(step => step.isActive));
  const isActiveInWorkflow = activeStep?.agentId === agent.id;
  const isLastStep = activeStep && workflow.steps.indexOf(activeStep) === workflow.steps.length - 1;
  const activeProject = useAppSelector(state => {
    const activeProjectId = state.projects.activeProjectId;
    return activeProjectId ? state.projects.projects.find(p => p.id === activeProjectId) : null;
  });
  
  // Add event listener for processing
  useEffect(() => {
    const handleProcessEvent = (e: CustomEvent) => {
      if (e.detail?.agentId === agent.id) {
        handleProcess();
      }
    };
    
    // Add event listener
    document.addEventListener('processAgent', handleProcessEvent as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener('processAgent', handleProcessEvent as EventListener);
    };
  }, [agent.id, agent.currentInput, agent.status]);
  
  // Auto-complete workflow step when agent processing is done
  useEffect(() => {
    if (agent.status === "complete" && isActiveInWorkflow && activeStep) {
      // When this agent's processing completes and it's the active step, mark the step as completed
      dispatch(completeStep({ stepId: activeStep.id }));
      
      // Show guidance toast
      if (isLastStep) {
        dispatch(showToast({ 
          type: "success", 
          message: "Code generated! Click 'Complete Project' to finish." 
        }));
      } else {
        dispatch(showToast({ 
          type: "info", 
          message: "Use the Copy button to transfer output to the next agent." 
        }));
      }
    }
  }, [agent.status, isActiveInWorkflow, activeStep, isLastStep, dispatch]);
  
  const handleCopy = () => {
    if (agent.currentOutput) {
      setCopyContent(agent.currentOutput, agent.id);
      
      // Show guidance toast
      dispatch(showToast({ 
        type: "success", 
        message: "Content copied! Now paste it to the next agent." 
      }));
    }
  };
  
  const handlePaste = () => {
    if (content && sourceId !== agent.id) {
      dispatch(setInput({ agentId: agent.id, input: content }));
    }
  };
  
  const handleProcess = async () => {
    if (agent.status === "processing" || !agent.currentInput.trim()) {
      return;
    }
    
    dispatch(startProcessing({ agentId: agent.id }));
    
    try {
      // Simulate processing time
      await delay(agent.processingTime);
      
      // Generate response based on agent type
      let output = "";
      
      if (agent.type === "product_vision") {
        output = `REQUIREMENTS:\n- User authentication functionality\n- Dashboard for data visualization\n- Export capabilities for reports\n\nFEATURES:\n- Login/logout system\n- Interactive charts\n- PDF and CSV export options\n\nNON-FUNCTIONAL REQUIREMENTS:\n- Response time under 2 seconds\n- Mobile-friendly interface\n- GDPR compliance`;
      } else if (agent.type === "code_writer") {
        output = `function createAuthSystem() {\n  // Authentication system implementation\n  class AuthService {\n    constructor() {\n      this.isLoggedIn = false;\n    }\n    \n    login(username, password) {\n      // Implementation here\n      this.isLoggedIn = true;\n      return true;\n    }\n    \n    logout() {\n      this.isLoggedIn = false;\n    }\n  }\n  \n  return new AuthService();\n}`;
      }
      
      dispatch(completeProcessing({ agentId: agent.id, output }));
    } catch (error) {
      console.error("Error processing agent:", error);
      dispatch(setError({ 
        agentId: agent.id, 
        errorMessage: "An error occurred while processing your request." 
      }));
    }
  };
  
  // Handle project completion
  const handleCompleteProject = () => {
    if (!activeProject) return;
    
    // For demo, always mark as successful
    const success = true;
    dispatch(completeProject({ projectId: activeProject.id, success }));
    
    // Show completion dialog
    dispatch(showCompletionDialog({ project: { ...activeProject, success } }));
  };
  
  // Calculate copy/paste button states
  const canCopy = agent.currentOutput && agent.status === "complete";
  const canPaste = !!content && sourceId !== agent.id;
  
  // Show "Complete Project" button on the last step when completed
  const showCompleteProjectButton = isLastStep && agent.status === "complete" && agent.currentOutput;
  
  return (
    <div className="agent-interface flex flex-col h-full">
      <div className="agent-actions flex justify-end space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-sm ${canPaste ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          onClick={handlePaste}
          disabled={!canPaste}
        >
          Paste
        </button>
        <button
          className={`px-3 py-1 rounded text-sm ${canCopy ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          onClick={handleCopy}
          disabled={!canCopy}
        >
          Copy
        </button>
      </div>
      
      {isActiveInWorkflow && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-md p-2 mb-3 text-sm">
          ⚠️ This agent is active in the current workflow step. Complete its task to proceed.
        </div>
      )}
      
      {children}
      
      {showCompleteProjectButton && (
        <div className="mt-4 bg-green-900/30 border border-green-700 rounded-md p-3 text-center">
          <p className="text-sm text-green-300 mb-2">All steps completed! You can now finish the project.</p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
            onClick={handleCompleteProject}
          >
            Complete Project
          </button>
        </div>
      )}
      
      {agent.status === "error" && (
        <div className="error-message mt-4 p-3 bg-red-900 border border-red-700 rounded-md">
          <p className="text-red-300 text-sm">{agent.errorMessage || "An error occurred"}</p>
        </div>
      )}
      
      {agent.status === "processing" && (
        <div className="processing-indicator mt-4 flex justify-center">
          <div className="animate-pulse text-blue-400">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default BaseAgentInterface;
