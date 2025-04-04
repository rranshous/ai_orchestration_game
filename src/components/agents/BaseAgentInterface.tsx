import React, { ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { AiAgent, startProcessing, completeProcessing, setError } from '../../state/reducers/agentReducer';
import { completeStep } from '../../state/reducers/workflowReducer';
import { showCompletionDialog } from '../../state/reducers/notificationReducer';
import { completeProject } from '../../state/reducers/projectReducer';
import modelService from '../../services/modelService';

interface BaseAgentProps {
  agent: AiAgent;
  children?: ReactNode;
}

const BaseAgentInterface: React.FC<BaseAgentProps> = ({ agent, children }) => {
  const dispatch = useAppDispatch();
  
  // Get workflow and project information
  const workflow = useAppSelector(state => state.workflow.current);
  const activeStep = useAppSelector(() => workflow.steps.find(step => step.isActive));
  const activeProject = useAppSelector(state => {
    const activeProjectId = state.projects.activeProjectId;
    return activeProjectId ? state.projects.projects.find(p => p.id === activeProjectId) : null;
  });
  
  // Check if this is the final step (certification step)
  const isCertificationStep = activeStep?.id === "step-certification";
  
  // Add event listener for processing
  useEffect(() => {
    const handleProcessEvent = (e: CustomEvent) => {
      if (e.detail?.agentId === agent.id) {
        handleProcess();
      }
    };
    
    document.addEventListener('processAgent', handleProcessEvent as EventListener);
    
    return () => {
      document.removeEventListener('processAgent', handleProcessEvent as EventListener);
    };
  }, [agent.id, agent.currentInput, agent.status]);
  
  // Auto-complete workflow step when agent processing is done
  useEffect(() => {
    if (agent.status === "complete" && activeStep?.agentId === agent.id) {
      // Only auto-complete non-certification steps
      if (!isCertificationStep) {
        dispatch(completeStep({ stepId: activeStep.id }));
      }
    }
  }, [agent.status, activeStep, dispatch, isCertificationStep]);
  
  const handleProcess = async () => {
    if (agent.status === "processing" || !agent.currentInput.trim()) {
      return;
    }
    
    dispatch(startProcessing({ agentId: agent.id }));
    
    try {
      // Using the activeProject from the component scope instead of using a hook inside this function
      const output = await modelService.generateAgentResponse(
        agent.type, 
        agent.currentInput,
        {
          projectName: activeProject?.name,
          projectDescription: activeProject?.description
        }
      );
      
      dispatch(completeProcessing({ agentId: agent.id, output }));
    } catch (error) {
      console.error("Error processing agent:", error);
      dispatch(setError({ 
        agentId: agent.id, 
        errorMessage: "An error occurred while processing your request." 
      }));
    }
  };
  
  // Handle project certification
  const handleCertifyCode = () => {
    if (!activeProject) return;
    
    // Mark the certification step as completed
    if (activeStep?.id === "step-certification") {
      dispatch(completeStep({ stepId: activeStep.id }));
    }
    
    // For demo, always mark as successful
    const success = true;
    dispatch(completeProject({ projectId: activeProject.id, success }));
    
    // Show completion dialog
    dispatch(showCompletionDialog({ project: { ...activeProject, success } }));
  };
  
  // Modified to make the button more visible - always show the button when in certification step
  const showCertifyButton = isCertificationStep && activeStep?.agentId === agent.id;
  
  return (
    <div className="agent-interface flex flex-col h-full">
      {children}
      
      {showCertifyButton && (
        <div className="mt-4 bg-green-900/30 border border-green-700 rounded-md p-3 text-center sticky bottom-0 z-10">
          <p className="text-sm text-green-300 mb-2">
            <strong>FINAL STEP:</strong> Review the code and certify that it meets requirements.
          </p>
          <button 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
            onClick={handleCertifyCode}
          >
            CERTIFY CODE
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
